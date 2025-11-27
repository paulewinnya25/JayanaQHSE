const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all equipment
router.get('/equipment', auth, async (req, res) => {
  try {
    const { chantier_id, type, status } = req.query;
    let query = `
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name,
             (SELECT COUNT(*) FROM maintenance_records mr WHERE mr.equipment_id = e.id) as maintenance_count
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND e.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND e.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (type) {
      query += ` AND e.type = $${paramCount++}`;
      params.push(type);
    }

    if (status) {
      query += ` AND e.status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY e.next_maintenance ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get equipment due for maintenance
router.get('/equipment/due', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const result = await pool.query(`
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE e.next_maintenance <= CURRENT_DATE + INTERVAL '${days} days'
      AND e.status = 'active'
      ORDER BY e.next_maintenance ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single equipment
router.get('/equipment/:id', auth, async (req, res) => {
  try {
    const equipmentResult = await pool.query(`
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE e.id = $1
    `, [req.params.id]);

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const maintenanceResult = await pool.query(`
      SELECT mr.*, u.first_name || ' ' || u.last_name as performed_by_name
      FROM maintenance_records mr
      LEFT JOIN users u ON mr.performed_by = u.id
      WHERE mr.equipment_id = $1
      ORDER BY mr.date_performed DESC
    `, [req.params.id]);

    res.json({
      ...equipmentResult.rows[0],
      maintenance_history: maintenanceResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create equipment
router.post('/equipment', auth, async (req, res) => {
  try {
    const { chantier_id, name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, responsible_user_id } = req.body;

    const result = await pool.query(
      `INSERT INTO equipment (chantier_id, name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, responsible_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, responsible_user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update equipment
router.put('/equipment/:id', auth, async (req, res) => {
  try {
    const { name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, status, responsible_user_id } = req.body;

    const result = await pool.query(
      `UPDATE equipment 
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           serial_number = COALESCE($3, serial_number),
           manufacturer = COALESCE($4, manufacturer),
           purchase_date = COALESCE($5, purchase_date),
           last_maintenance = COALESCE($6, last_maintenance),
           next_maintenance = COALESCE($7, next_maintenance),
           status = COALESCE($8, status),
           responsible_user_id = COALESCE($9, responsible_user_id)
       WHERE id = $10
       RETURNING *`,
      [name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, status, responsible_user_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create maintenance record
router.post('/records', auth, async (req, res) => {
  try {
    const { equipment_id, type, description, date_performed, next_due_date, cost } = req.body;

    const result = await pool.query(
      `INSERT INTO maintenance_records (equipment_id, type, description, performed_by, date_performed, next_due_date, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [equipment_id, type, description, req.user.id, date_performed || new Date(), next_due_date, cost]
    );

    // Update equipment last_maintenance and next_maintenance
    if (next_due_date) {
      await pool.query(
        `UPDATE equipment 
         SET last_maintenance = $1, next_maintenance = $2
         WHERE id = $3`,
        [date_performed || new Date(), next_due_date, equipment_id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get maintenance records
router.get('/records', auth, async (req, res) => {
  try {
    const { equipment_id } = req.query;
    let query = `
      SELECT mr.*, 
             e.name as equipment_name,
             e.type as equipment_type,
             u.first_name || ' ' || u.last_name as performed_by_name
      FROM maintenance_records mr
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN users u ON mr.performed_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    if (equipment_id) {
      query += ' AND mr.equipment_id = $1';
      params.push(equipment_id);
    }

    query += ' ORDER BY mr.date_performed DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


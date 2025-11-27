const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all risks
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status } = req.query;
    let query = `
      SELECT r.*, 
             u1.first_name || ' ' || u1.last_name as created_by_name,
             u2.first_name || ' ' || u2.last_name as responsible_name,
             c.name as chantier_name
      FROM risks r
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN users u2 ON r.responsible_user_id = u2.id
      LEFT JOIN chantiers c ON r.chantier_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND r.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND r.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (status) {
      query += ` AND r.status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single risk
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
             u1.first_name || ' ' || u1.last_name as created_by_name,
             u2.first_name || ' ' || u2.last_name as responsible_name,
             c.name as chantier_name
      FROM risks r
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN users u2 ON r.responsible_user_id = u2.id
      LEFT JOIN chantiers c ON r.chantier_id = c.id
      WHERE r.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create risk
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, description, category, probability, severity, responsible_user_id } = req.body;
    
    const criticality = (probability || 1) * (severity || 1);

    const result = await pool.query(
      `INSERT INTO risks (chantier_id, title, description, category, probability, severity, criticality, responsible_user_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, title, description, category, probability || 1, severity || 1, criticality, responsible_user_id, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update risk
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, probability, severity, status, responsible_user_id } = req.body;
    
    const criticality = probability && severity ? probability * severity : null;

    const result = await pool.query(
      `UPDATE risks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           probability = COALESCE($4, probability),
           severity = COALESCE($5, severity),
           criticality = COALESCE($6, criticality),
           status = COALESCE($7, status),
           responsible_user_id = COALESCE($8, responsible_user_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, category, probability, severity, criticality, status, responsible_user_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete risk
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM risks WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    res.json({ message: 'Risk deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


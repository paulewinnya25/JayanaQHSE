const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all inspections
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, type } = req.query;
    let query = `
      SELECT i.*, 
             u.first_name || ' ' || u.last_name as inspector_name,
             c.name as chantier_name
      FROM inspections i
      LEFT JOIN users u ON i.inspector_id = u.id
      LEFT JOIN chantiers c ON i.chantier_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND i.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND i.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (status) {
      query += ` AND i.status = $${paramCount++}`;
      params.push(status);
    }

    if (type) {
      query += ` AND i.type = $${paramCount++}`;
      params.push(type);
    }

    query += ' ORDER BY i.date_planned DESC, i.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single inspection
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, 
             u.first_name || ' ' || u.last_name as inspector_name,
             c.name as chantier_name
      FROM inspections i
      LEFT JOIN users u ON i.inspector_id = u.id
      LEFT JOIN chantiers c ON i.chantier_id = c.id
      WHERE i.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create inspection
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, title, inspector_id, date_planned, findings, photos } = req.body;

    const result = await pool.query(
      `INSERT INTO inspections (chantier_id, type, title, inspector_id, date_planned, findings, photos)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, type, title, inspector_id || req.user.id, date_planned, findings, photos || []]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inspection
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, title, inspector_id, date_planned, date_realized, status, findings, photos } = req.body;

    const result = await pool.query(
      `UPDATE inspections 
       SET type = COALESCE($1, type),
           title = COALESCE($2, title),
           inspector_id = COALESCE($3, inspector_id),
           date_planned = COALESCE($4, date_planned),
           date_realized = COALESCE($5, date_realized),
           status = COALESCE($6, status),
           findings = COALESCE($7, findings),
           photos = COALESCE($8, photos)
       WHERE id = $9
       RETURNING *`,
      [type, title, inspector_id, date_planned, date_realized, status, findings, photos, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inspection
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM inspections WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


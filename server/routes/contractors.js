const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all contractors
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, status } = req.query;
    let query = `
      SELECT c.*, ch.name as chantier_name
      FROM contractors c
      LEFT JOIN chantiers ch ON c.chantier_id = ch.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND c.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND c.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (type) {
      query += ` AND c.type = $${paramCount++}`;
      params.push(type);
    }

    if (status) {
      query += ` AND c.status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contractor
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, ch.name as chantier_name
      FROM contractors c
      LEFT JOIN chantiers ch ON c.chantier_id = ch.id
      WHERE c.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create contractor
router.post('/', auth, async (req, res) => {
  try {
    const { name, company, email, phone, chantier_id, type, certifications, access_level } = req.body;

    const result = await pool.query(
      `INSERT INTO contractors (name, company, email, phone, chantier_id, type, certifications, access_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, company, email, phone, chantier_id || req.user.chantier_id, type, certifications || [], access_level]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contractor
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, company, email, phone, type, certifications, access_level, status } = req.body;

    const result = await pool.query(
      `UPDATE contractors 
       SET name = COALESCE($1, name),
           company = COALESCE($2, company),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           type = COALESCE($5, type),
           certifications = COALESCE($6, certifications),
           access_level = COALESCE($7, access_level),
           status = COALESCE($8, status)
       WHERE id = $9
       RETURNING *`,
      [name, company, email, phone, type, certifications, access_level, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contractor
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contractors WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    res.json({ message: 'Contractor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


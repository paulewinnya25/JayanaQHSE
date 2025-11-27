const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all non-conformities
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, category } = req.query;
    let query = `
      SELECT nc.*, 
             u1.first_name || ' ' || u1.last_name as detected_by_name,
             u2.first_name || ' ' || u2.last_name as responsible_name,
             c.name as chantier_name
      FROM non_conformities nc
      LEFT JOIN users u1 ON nc.detected_by = u1.id
      LEFT JOIN users u2 ON nc.responsible_user_id = u2.id
      LEFT JOIN chantiers c ON nc.chantier_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND nc.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND nc.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (status) {
      query += ` AND nc.status = $${paramCount++}`;
      params.push(status);
    }

    if (category) {
      query += ` AND nc.category = $${paramCount++}`;
      params.push(category);
    }

    query += ' ORDER BY nc.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single non-conformity
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT nc.*, 
             u1.first_name || ' ' || u1.last_name as detected_by_name,
             u2.first_name || ' ' || u2.last_name as responsible_name,
             c.name as chantier_name
      FROM non_conformities nc
      LEFT JOIN users u1 ON nc.detected_by = u1.id
      LEFT JOIN users u2 ON nc.responsible_user_id = u2.id
      LEFT JOIN chantiers c ON nc.chantier_id = c.id
      WHERE nc.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Non-conformity not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create non-conformity
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, description, category, severity, responsible_user_id, corrective_action, due_date } = req.body;

    const result = await pool.query(
      `INSERT INTO non_conformities (chantier_id, title, description, category, severity, detected_by, responsible_user_id, corrective_action, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, title, description, category, severity, req.user.id, responsible_user_id, corrective_action, due_date]
    );

    // Create notification for responsible user
    if (responsible_user_id) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'non_conformity', 'Nouvelle non-conformité', $2, $3)`,
        [responsible_user_id, `Non-conformité "${title}" vous a été assignée`, `/non-conformities/${result.rows[0].id}`]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update non-conformity
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, severity, status, responsible_user_id, corrective_action, due_date } = req.body;

    const result = await pool.query(
      `UPDATE non_conformities 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           severity = COALESCE($4, severity),
           status = COALESCE($5, status),
           responsible_user_id = COALESCE($6, responsible_user_id),
           corrective_action = COALESCE($7, corrective_action),
           due_date = COALESCE($8, due_date),
           closed_at = CASE WHEN $5 = 'closed' THEN CURRENT_TIMESTAMP ELSE closed_at END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, category, severity, status, responsible_user_id, corrective_action, due_date, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Non-conformity not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete non-conformity
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM non_conformities WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Non-conformity not found' });
    }

    res.json({ message: 'Non-conformity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


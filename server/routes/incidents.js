const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all incidents
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, type, severity } = req.query;
    let query = `
      SELECT i.*, 
             u.first_name || ' ' || u.last_name as reported_by_name,
             c.name as chantier_name
      FROM incidents i
      LEFT JOIN users u ON i.reported_by = u.id
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

    if (severity) {
      query += ` AND i.severity = $${paramCount++}`;
      params.push(severity);
    }

    query += ' ORDER BY i.date_incident DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single incident
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, 
             u.first_name || ' ' || u.last_name as reported_by_name,
             c.name as chantier_name
      FROM incidents i
      LEFT JOIN users u ON i.reported_by = u.id
      LEFT JOIN chantiers c ON i.chantier_id = c.id
      WHERE i.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create incident
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, title, description, date_incident, location, severity, photos, medical_report } = req.body;

    const result = await pool.query(
      `INSERT INTO incidents (chantier_id, type, title, description, date_incident, location, severity, reported_by, photos, medical_report)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, type, title, description, date_incident || new Date(), location, severity, req.user.id, photos || [], medical_report]
    );

    // Create notification for QHSE supervisors
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, message, link)
      SELECT id, 'incident', 'Nouvel incident déclaré', $1, $2
      FROM users WHERE role = 'superviseur_qhse'
    `, [`Incident "${title}" déclaré`, `/incidents/${result.rows[0].id}`]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update incident
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, title, description, date_incident, location, severity, status, photos, medical_report, investigation, root_cause, corrective_actions } = req.body;

    const result = await pool.query(
      `UPDATE incidents 
       SET type = COALESCE($1, type),
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           date_incident = COALESCE($4, date_incident),
           location = COALESCE($5, location),
           severity = COALESCE($6, severity),
           status = COALESCE($7, status),
           photos = COALESCE($8, photos),
           medical_report = COALESCE($9, medical_report),
           investigation = COALESCE($10, investigation),
           root_cause = COALESCE($11, root_cause),
           corrective_actions = COALESCE($12, corrective_actions),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [type, title, description, date_incident, location, severity, status, photos, medical_report, investigation, root_cause, corrective_actions, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete incident
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM incidents WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


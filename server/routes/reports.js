const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate dashboard report
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const chantierFilter = chantier_id || (req.user.chantier_id ? `AND i.chantier_id = ${req.user.chantier_id}` : '');

    // Get comprehensive statistics
    const incidents = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN severity = 'grave' THEN 1 END) as grave,
             COUNT(CASE WHEN severity = 'moyen' THEN 1 END) as moyen,
             COUNT(CASE WHEN severity = 'léger' THEN 1 END) as leger
      FROM incidents i
      WHERE 1=1 ${chantierFilter}
      ${start_date ? `AND date_incident >= '${start_date}'` : ''}
      ${end_date ? `AND date_incident <= '${end_date}'` : ''}
    `);

    const inspections = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
             COUNT(CASE WHEN status = 'planned' THEN 1 END) as planned
      FROM inspections i
      WHERE 1=1 ${chantierFilter}
    `);

    const nonConformities = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
             COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed
      FROM non_conformities nc
      WHERE 1=1 ${chantierFilter}
    `);

    const trainings = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM trainings t
    `);

    res.json({
      period: { start_date, end_date },
      summary: {
        incidents: incidents.rows[0],
        inspections: inspections.rows[0],
        nonConformities: nonConformities.rows[0],
        trainings: trainings.rows[0]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate incidents report
router.get('/incidents', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
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

    if (start_date) {
      query += ` AND i.date_incident >= $${paramCount++}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND i.date_incident <= $${paramCount++}`;
      params.push(end_date);
    }

    query += ' ORDER BY i.date_incident DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate inspections report
router.get('/inspections', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
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

    if (start_date) {
      query += ` AND i.date_realized >= $${paramCount++}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND i.date_realized <= $${paramCount++}`;
      params.push(end_date);
    }

    query += ' ORDER BY i.date_realized DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


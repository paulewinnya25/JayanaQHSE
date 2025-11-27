const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Filter by chantier if user has specific chantier or if specified in query
    const chantierFilter = chantier_id || (req.user.chantier_id ? `AND i.chantier_id = ${req.user.chantier_id}` : '');

    // Get incidents count
    const incidentsResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN severity = 'grave' THEN 1 END) as grave,
             COUNT(CASE WHEN severity = 'moyen' THEN 1 END) as moyen,
             COUNT(CASE WHEN severity = 'léger' THEN 1 END) as leger
      FROM incidents i
      WHERE 1=1 ${chantierFilter}
      ${start_date ? `AND date_incident >= '${start_date}'` : ''}
      ${end_date ? `AND date_incident <= '${end_date}'` : ''}
    `);

    // Get inspections count
    const inspectionsResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
             COUNT(CASE WHEN status = 'planned' THEN 1 END) as planned
      FROM inspections i
      WHERE 1=1 ${chantierFilter}
    `);

    // Get non-conformities count
    const ncResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
             COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed
      FROM non_conformities nc
      WHERE 1=1 ${chantierFilter}
    `);

    // Get trainings count
    const trainingsResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
             COUNT(CASE WHEN status = 'planned' THEN 1 END) as planned
      FROM trainings t
    `);

    // Get corrective actions overdue
    const overdueActions = await pool.query(`
      SELECT COUNT(*) as count
      FROM non_conformities
      WHERE status = 'open' AND due_date < CURRENT_DATE
      ${chantierFilter}
    `);

    // Get upcoming trainings
    const upcomingTrainings = await pool.query(`
      SELECT t.*, COUNT(tp.user_id) as participants_count
      FROM trainings t
      LEFT JOIN training_participants tp ON t.id = tp.training_id
      WHERE t.date_planned >= CURRENT_DATE
      GROUP BY t.id
      ORDER BY t.date_planned ASC
      LIMIT 5
    `);

    // Get planned inspections this week
    const thisWeekInspections = await pool.query(`
      SELECT COUNT(*) as count
      FROM inspections
      WHERE date_planned >= CURRENT_DATE
      AND date_planned <= CURRENT_DATE + INTERVAL '7 days'
      AND status = 'planned'
      ${chantierFilter}
    `);

    // Get recent incidents (last 30 days)
    const recentIncidents = await pool.query(`
      SELECT i.*, u.first_name || ' ' || u.last_name as reported_by_name
      FROM incidents i
      LEFT JOIN users u ON i.reported_by = u.id
      WHERE i.date_incident >= CURRENT_DATE - INTERVAL '30 days'
      ${chantierFilter}
      ORDER BY i.date_incident DESC
      LIMIT 10
    `);

    res.json({
      kpis: {
        incidents: incidentsResult.rows[0],
        inspections: inspectionsResult.rows[0],
        nonConformities: ncResult.rows[0],
        trainings: trainingsResult.rows[0]
      },
      alerts: {
        overdueActions: parseInt(overdueActions.rows[0].count),
        upcomingTrainings: upcomingTrainings.rows.length,
        thisWeekInspections: parseInt(thisWeekInspections.rows[0].count)
      },
      upcomingTrainings: upcomingTrainings.rows,
      recentIncidents: recentIncidents.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const dbType = getDatabaseType();
    const filterChantierId = chantier_id || req.user.chantier_id;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Get incidents
      let incidentsQuery = supabase.from('incidents').select('severity, date_incident');
      if (filterChantierId) {
        incidentsQuery = incidentsQuery.eq('chantier_id', filterChantierId);
      }
      if (start_date) {
        incidentsQuery = incidentsQuery.gte('date_incident', start_date);
      }
      if (end_date) {
        incidentsQuery = incidentsQuery.lte('date_incident', end_date);
      }
      const { data: incidents } = await incidentsQuery;
      
      const incidentsStats = {
        total: incidents?.length || 0,
        grave: incidents?.filter(i => i.severity === 'grave').length || 0,
        moyen: incidents?.filter(i => i.severity === 'moyen').length || 0,
        leger: incidents?.filter(i => i.severity === 'léger').length || 0
      };
      
      // Get inspections
      let inspectionsQuery = supabase.from('inspections').select('status');
      if (filterChantierId) {
        inspectionsQuery = inspectionsQuery.eq('chantier_id', filterChantierId);
      }
      const { data: inspections } = await inspectionsQuery;
      
      const inspectionsStats = {
        total: inspections?.length || 0,
        completed: inspections?.filter(i => i.status === 'completed').length || 0,
        planned: inspections?.filter(i => i.status === 'planned').length || 0
      };
      
      // Get non-conformities
      let ncQuery = supabase.from('non_conformities').select('status');
      if (filterChantierId) {
        ncQuery = ncQuery.eq('chantier_id', filterChantierId);
      }
      const { data: nonConformities } = await ncQuery;
      
      const ncStats = {
        total: nonConformities?.length || 0,
        open: nonConformities?.filter(nc => nc.status === 'open').length || 0,
        closed: nonConformities?.filter(nc => nc.status === 'closed').length || 0
      };
      
      // Get trainings
      const { data: trainings } = await supabase.from('trainings').select('status');
      
      const trainingsStats = {
        total: trainings?.length || 0,
        completed: trainings?.filter(t => t.status === 'completed').length || 0,
        planned: trainings?.filter(t => t.status === 'planned').length || 0
      };
      
      // Get corrective actions overdue
      let overdueQuery = supabase
        .from('non_conformities')
        .select('id')
        .eq('status', 'open')
        .lt('due_date', new Date().toISOString().split('T')[0]);
      if (filterChantierId) {
        overdueQuery = overdueQuery.eq('chantier_id', filterChantierId);
      }
      const { data: overdue } = await overdueQuery;
      
      // Get upcoming trainings
      const { data: upcomingTrainings } = await supabase
        .from('trainings')
        .select('*')
        .gte('date_planned', new Date().toISOString().split('T')[0])
        .order('date_planned', { ascending: true })
        .limit(5);
      
      // Compter les participants pour chaque formation
      if (upcomingTrainings && upcomingTrainings.length > 0) {
        const trainingIds = upcomingTrainings.map(t => t.id);
        const { data: participants } = await supabase
          .from('training_participants')
          .select('training_id')
          .in('training_id', trainingIds);
        
        const participantCounts = {};
        (participants || []).forEach(p => {
          participantCounts[p.training_id] = (participantCounts[p.training_id] || 0) + 1;
        });
        
        upcomingTrainings.forEach(t => {
          t.participants_count = participantCounts[t.id] || 0;
        });
      }
      
      // Get planned inspections this week
      const weekStart = new Date();
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      let thisWeekQuery = supabase
        .from('inspections')
        .select('id')
        .eq('status', 'planned')
        .gte('date_planned', weekStart.toISOString().split('T')[0])
        .lte('date_planned', weekEnd.toISOString().split('T')[0]);
      if (filterChantierId) {
        thisWeekQuery = thisWeekQuery.eq('chantier_id', filterChantierId);
      }
      const { data: thisWeekInspections } = await thisWeekQuery;
      
      // Get recent incidents (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let recentQuery = supabase
        .from('incidents')
        .select('*')
        .gte('date_incident', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date_incident', { ascending: false })
        .limit(10);
      if (filterChantierId) {
        recentQuery = recentQuery.eq('chantier_id', filterChantierId);
      }
      const { data: recentIncidents } = await recentQuery;
      
      // Récupérer les noms des utilisateurs pour les incidents récents
      if (recentIncidents && recentIncidents.length > 0) {
        const userIds = [...new Set(recentIncidents.map(i => i.reported_by).filter(Boolean))];
        const { data: users } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .in('id', userIds);
        
        const usersMap = {};
        (users || []).forEach(u => { usersMap[u.id] = u; });
        
        recentIncidents.forEach(incident => {
          incident.reported_by_name = formatFullName(usersMap[incident.reported_by]);
        });
      }
      
      res.json({
        kpis: {
          incidents: incidentsStats,
          inspections: inspectionsStats,
          nonConformities: ncStats,
          trainings: trainingsStats
        },
        alerts: {
          overdueActions: overdue?.length || 0,
          upcomingTrainings: upcomingTrainings?.length || 0,
          thisWeekInspections: thisWeekInspections?.length || 0
        },
        upcomingTrainings: upcomingTrainings || [],
        recentIncidents: recentIncidents || []
      });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const chantierFilter = filterChantierId ? `AND i.chantier_id = ${filterChantierId}` : '';

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
    }
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


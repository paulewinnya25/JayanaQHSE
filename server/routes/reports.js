const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Generate dashboard report
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const dbType = getDatabaseType();
    const filterChantierId = chantier_id || req.user.chantier_id;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Récupérer les incidents
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
      
      // Calculer les stats incidents
      const incidentsStats = {
        total: incidents?.length || 0,
        grave: incidents?.filter(i => i.severity === 'grave').length || 0,
        moyen: incidents?.filter(i => i.severity === 'moyen').length || 0,
        leger: incidents?.filter(i => i.severity === 'léger').length || 0
      };
      
      // Récupérer les inspections
      let inspectionsQuery = supabase.from('inspections').select('status');
      if (filterChantierId) {
        inspectionsQuery = inspectionsQuery.eq('chantier_id', filterChantierId);
      }
      const { data: inspections } = await inspectionsQuery;
      
      // Calculer les stats inspections
      const inspectionsStats = {
        total: inspections?.length || 0,
        completed: inspections?.filter(i => i.status === 'completed').length || 0,
        planned: inspections?.filter(i => i.status === 'planned').length || 0
      };
      
      // Récupérer les non-conformités
      let ncQuery = supabase.from('non_conformities').select('status');
      if (filterChantierId) {
        ncQuery = ncQuery.eq('chantier_id', filterChantierId);
      }
      const { data: nonConformities } = await ncQuery;
      
      // Calculer les stats non-conformités
      const ncStats = {
        total: nonConformities?.length || 0,
        open: nonConformities?.filter(nc => nc.status === 'open').length || 0,
        closed: nonConformities?.filter(nc => nc.status === 'closed').length || 0
      };
      
      // Récupérer les formations
      const { data: trainings } = await supabase.from('trainings').select('status');
      
      // Calculer les stats formations
      const trainingsStats = {
        total: trainings?.length || 0,
        completed: trainings?.filter(t => t.status === 'completed').length || 0
      };
      
      res.json({
        period: { start_date, end_date },
        summary: {
          incidents: incidentsStats,
          inspections: inspectionsStats,
          nonConformities: ncStats,
          trainings: trainingsStats
        }
      });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const chantierFilter = filterChantierId ? `AND i.chantier_id = ${filterChantierId}` : '';

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
    }
  } catch (error) {
    console.error('❌ Error generating dashboard report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate incidents report
router.get('/incidents', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('incidents').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (start_date) {
        query = query.gte('date_incident', start_date);
      }
      
      if (end_date) {
        query = query.lte('date_incident', end_date);
      }
      
      query = query.order('date_incident', { ascending: false });
      
      const { data: incidents, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const userIds = [...new Set(incidents.map(i => i.reported_by).filter(Boolean))];
      const chantierIds = [...new Set(incidents.map(i => i.chantier_id).filter(Boolean))];
      
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => { chantiersMap[c.id] = c; });
      
      const result = (incidents || []).map(incident => ({
        ...incident,
        reported_by_name: formatFullName(usersMap[incident.reported_by]),
        chantier_name: chantiersMap[incident.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error generating incidents report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate inspections report
router.get('/inspections', auth, async (req, res) => {
  try {
    const { chantier_id, start_date, end_date } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('inspections').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (start_date) {
        query = query.gte('date_realized', start_date);
      }
      
      if (end_date) {
        query = query.lte('date_realized', end_date);
      }
      
      query = query.order('date_realized', { ascending: false });
      
      const { data: inspections, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const userIds = [...new Set(inspections.map(i => i.inspector_id).filter(Boolean))];
      const chantierIds = [...new Set(inspections.map(i => i.chantier_id).filter(Boolean))];
      
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => { chantiersMap[c.id] = c; });
      
      const result = (inspections || []).map(inspection => ({
        ...inspection,
        inspector_name: formatFullName(usersMap[inspection.inspector_id]),
        chantier_name: chantiersMap[inspection.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error generating inspections report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


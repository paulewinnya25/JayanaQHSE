const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all incidents
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, type, severity } = req.query;
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
      
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      if (severity) query = query.eq('severity', severity);
      
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
    }
  } catch (error) {
    console.error('❌ Error fetching incidents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single incident
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: incident, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      
      // Récupérer les relations
      const { data: user } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', incident.reported_by)
        .single();
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', incident.chantier_id)
        .single();
      
      const result = {
        ...incident,
        reported_by_name: formatFullName(user),
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error fetching incident:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create incident
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, title, description, date_incident, location, severity, photos, medical_report } = req.body;
    const dbType = getDatabaseType();
    
    const incidentData = {
      chantier_id: chantier_id || req.user.chantier_id,
      type,
      title,
      description,
      date_incident: date_incident || new Date().toISOString(),
      location,
      severity,
      reported_by: req.user.id,
      photos: photos || [],
      medical_report
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('incidents')
        .insert(incidentData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create notification for QHSE supervisors
      const { data: supervisors } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'superviseur_qhse');
      
      if (supervisors && supervisors.length > 0) {
        const notifications = supervisors.map(s => ({
          user_id: s.id,
          type: 'incident',
          title: 'Nouvel incident déclaré',
          message: `Incident "${title}" déclaré`,
          link: `/incidents/${data.id}`
        }));
        
        await supabase.from('notifications').insert(notifications);
      }
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO incidents (chantier_id, type, title, description, date_incident, location, severity, reported_by, photos, medical_report)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [incidentData.chantier_id, incidentData.type, incidentData.title, incidentData.description, incidentData.date_incident, incidentData.location, incidentData.severity, incidentData.reported_by, incidentData.photos, incidentData.medical_report]
      );

      // Create notification for QHSE supervisors
      await pool.query(`
        INSERT INTO notifications (user_id, type, title, message, link)
        SELECT id, 'incident', 'Nouvel incident déclaré', $1, $2
        FROM users WHERE role = 'superviseur_qhse'
      `, [`Incident "${title}" déclaré`, `/incidents/${result.rows[0].id}`]);

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating incident:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update incident
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, title, description, date_incident, location, severity, status, photos, medical_report, investigation, root_cause, corrective_actions } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date_incident !== undefined) updateData.date_incident = date_incident;
    if (location !== undefined) updateData.location = location;
    if (severity !== undefined) updateData.severity = severity;
    if (status !== undefined) updateData.status = status;
    if (photos !== undefined) updateData.photos = photos;
    if (medical_report !== undefined) updateData.medical_report = medical_report;
    if (investigation !== undefined) updateData.investigation = investigation;
    if (root_cause !== undefined) updateData.root_cause = root_cause;
    if (corrective_actions !== undefined) updateData.corrective_actions = corrective_actions;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('incidents')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Incident not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error updating incident:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete incident
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Incident not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      
      res.json({ message: 'Incident deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM incidents WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      res.json({ message: 'Incident deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting incident:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


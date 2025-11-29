const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all non-conformities
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, category } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('non_conformities').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);
      
      query = query.order('created_at', { ascending: false });
      
      const { data: nonConformities, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const userIds = [...new Set([
        ...nonConformities.map(nc => nc.detected_by),
        ...nonConformities.map(nc => nc.responsible_user_id)
      ].filter(Boolean))];
      
      const chantierIds = [...new Set(nonConformities.map(nc => nc.chantier_id).filter(Boolean))];
      
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
      
      const result = (nonConformities || []).map(nc => ({
        ...nc,
        detected_by_name: formatFullName(usersMap[nc.detected_by]),
        responsible_name: formatFullName(usersMap[nc.responsible_user_id]),
        chantier_name: chantiersMap[nc.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error fetching non-conformities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single non-conformity
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: nc, error } = await supabase
        .from('non_conformities')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !nc) {
        return res.status(404).json({ message: 'Non-conformity not found' });
      }
      
      // Récupérer les relations
      const userIds = [nc.detected_by, nc.responsible_user_id].filter(Boolean);
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', nc.chantier_id)
        .single();
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const result = {
        ...nc,
        detected_by_name: formatFullName(usersMap[nc.detected_by]),
        responsible_name: formatFullName(usersMap[nc.responsible_user_id]),
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error fetching non-conformity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create non-conformity
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, description, category, severity, responsible_user_id, corrective_action, due_date } = req.body;
    const dbType = getDatabaseType();
    
    const ncData = {
      chantier_id: chantier_id || req.user.chantier_id,
      title,
      description,
      category,
      severity,
      detected_by: req.user.id,
      responsible_user_id,
      corrective_action,
      due_date
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('non_conformities')
        .insert(ncData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create notification for responsible user
      if (responsible_user_id) {
        await supabase.from('notifications').insert({
          user_id: responsible_user_id,
          type: 'non_conformity',
          title: 'Nouvelle non-conformité',
          message: `Non-conformité "${title}" vous a été assignée`,
          link: `/non-conformities/${data.id}`
        });
      }
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO non_conformities (chantier_id, title, description, category, severity, detected_by, responsible_user_id, corrective_action, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [ncData.chantier_id, ncData.title, ncData.description, ncData.category, ncData.severity, ncData.detected_by, ncData.responsible_user_id, ncData.corrective_action, ncData.due_date]
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
    }
  } catch (error) {
    console.error('❌ Error creating non-conformity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update non-conformity
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, severity, status, responsible_user_id, corrective_action, due_date } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (severity !== undefined) updateData.severity = severity;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }
    }
    if (responsible_user_id !== undefined) updateData.responsible_user_id = responsible_user_id;
    if (corrective_action !== undefined) updateData.corrective_action = corrective_action;
    if (due_date !== undefined) updateData.due_date = due_date;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('non_conformities')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Non-conformity not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Non-conformity not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error updating non-conformity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete non-conformity
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('non_conformities')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Non-conformity not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Non-conformity not found' });
      }
      
      res.json({ message: 'Non-conformity deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM non_conformities WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Non-conformity not found' });
      }

      res.json({ message: 'Non-conformity deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting non-conformity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


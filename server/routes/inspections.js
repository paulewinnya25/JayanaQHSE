const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all inspections
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status, type } = req.query;
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
      
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      
      query = query.order('date_planned', { ascending: false }).order('created_at', { ascending: false });
      
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
    }
  } catch (error) {
    console.error('❌ Error fetching inspections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single inspection
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: inspection, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !inspection) {
        return res.status(404).json({ message: 'Inspection not found' });
      }
      
      // Récupérer les relations
      const { data: user } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', inspection.inspector_id)
        .single();
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', inspection.chantier_id)
        .single();
      
      const result = {
        ...inspection,
        inspector_name: formatFullName(user),
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error fetching inspection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create inspection
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, title, inspector_id, date_planned, findings, photos } = req.body;
    const dbType = getDatabaseType();
    
    const inspectionData = {
      chantier_id: chantier_id || req.user.chantier_id,
      type,
      title,
      inspector_id: inspector_id || req.user.id,
      date_planned,
      findings,
      photos: photos || []
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('inspections')
        .insert(inspectionData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO inspections (chantier_id, type, title, inspector_id, date_planned, findings, photos)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [inspectionData.chantier_id, inspectionData.type, inspectionData.title, inspectionData.inspector_id, inspectionData.date_planned, inspectionData.findings, inspectionData.photos]
      );

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating inspection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inspection
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, title, inspector_id, date_planned, date_realized, status, findings, photos } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (inspector_id !== undefined) updateData.inspector_id = inspector_id;
    if (date_planned !== undefined) updateData.date_planned = date_planned;
    if (date_realized !== undefined) updateData.date_realized = date_realized;
    if (status !== undefined) updateData.status = status;
    if (findings !== undefined) updateData.findings = findings;
    if (photos !== undefined) updateData.photos = photos;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('inspections')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Inspection not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Inspection not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
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
    }
  } catch (error) {
    console.error('❌ Error updating inspection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete inspection
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Inspection not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Inspection not found' });
      }
      
      res.json({ message: 'Inspection deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM inspections WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Inspection not found' });
      }

      res.json({ message: 'Inspection deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting inspection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


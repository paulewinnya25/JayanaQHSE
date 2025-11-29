const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { fetchWithRelations, formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all risks
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, status } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Construire la requête Supabase
      let query = supabase.from('risks').select('*');
      
      // Appliquer les filtres
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      // Ordre
      query = query.order('created_at', { ascending: false });
      
      const { data: risks, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Récupérer les relations séparément
      const userIds = [...new Set([
        ...risks.map(r => r.created_by),
        ...risks.map(r => r.responsible_user_id)
      ].filter(Boolean))];
      
      const chantierIds = [...new Set(risks.map(r => r.chantier_id).filter(Boolean))];
      
      // Récupérer les users
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      // Récupérer les chantiers
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      // Créer des maps pour accès rapide
      const usersMap = {};
      (users || []).forEach(u => {
        usersMap[u.id] = u;
      });
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => {
        chantiersMap[c.id] = c;
      });
      
      // Combiner les données
      const result = (risks || []).map(risk => ({
        ...risk,
        created_by_name: formatFullName(usersMap[risk.created_by]),
        responsible_name: formatFullName(usersMap[risk.responsible_user_id]),
        chantier_name: chantiersMap[risk.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      let query = `
        SELECT r.*, 
               u1.first_name || ' ' || u1.last_name as created_by_name,
               u2.first_name || ' ' || u2.last_name as responsible_name,
               c.name as chantier_name
        FROM risks r
        LEFT JOIN users u1 ON r.created_by = u1.id
        LEFT JOIN users u2 ON r.responsible_user_id = u2.id
        LEFT JOIN chantiers c ON r.chantier_id = c.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 1;

      if (chantier_id) {
        query += ` AND r.chantier_id = $${paramCount++}`;
        params.push(chantier_id);
      } else if (req.user.chantier_id) {
        query += ` AND r.chantier_id = $${paramCount++}`;
        params.push(req.user.chantier_id);
      }

      if (status) {
        query += ` AND r.status = $${paramCount++}`;
        params.push(status);
      }

      query += ' ORDER BY r.created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching risks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single risk
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Récupérer le risk
      const { data: risk, error } = await supabase
        .from('risks')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !risk) {
        return res.status(404).json({ message: 'Risk not found' });
      }
      
      // Récupérer les relations
      const userIds = [risk.created_by, risk.responsible_user_id].filter(Boolean);
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', risk.chantier_id)
        .single();
      
      const usersMap = {};
      (users || []).forEach(u => {
        usersMap[u.id] = u;
      });
      
      const result = {
        ...risk,
        created_by_name: formatFullName(usersMap[risk.created_by]),
        responsible_name: formatFullName(usersMap[risk.responsible_user_id]),
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(`
        SELECT r.*, 
               u1.first_name || ' ' || u1.last_name as created_by_name,
               u2.first_name || ' ' || u2.last_name as responsible_name,
               c.name as chantier_name
        FROM risks r
        LEFT JOIN users u1 ON r.created_by = u1.id
        LEFT JOIN users u2 ON r.responsible_user_id = u2.id
        LEFT JOIN chantiers c ON r.chantier_id = c.id
        WHERE r.id = $1
      `, [req.params.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Risk not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error fetching risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create risk
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, description, category, probability, severity, responsible_user_id } = req.body;
    const dbType = getDatabaseType();
    
    const criticality = (probability || 1) * (severity || 1);
    const riskData = {
      chantier_id: chantier_id || req.user.chantier_id,
      title,
      description,
      category,
      probability: probability || 1,
      severity: severity || 1,
      criticality,
      responsible_user_id,
      created_by: req.user.id
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('risks')
        .insert(riskData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO risks (chantier_id, title, description, category, probability, severity, criticality, responsible_user_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [riskData.chantier_id, riskData.title, riskData.description, riskData.category, riskData.probability, riskData.severity, riskData.criticality, riskData.responsible_user_id, riskData.created_by]
      );

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update risk
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, probability, severity, status, responsible_user_id } = req.body;
    const dbType = getDatabaseType();
    
    const criticality = probability && severity ? probability * severity : null;
    
    // Construire l'objet de mise à jour (seulement les champs fournis)
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (probability !== undefined) updateData.probability = probability;
    if (severity !== undefined) updateData.severity = severity;
    if (criticality !== null) updateData.criticality = criticality;
    if (status !== undefined) updateData.status = status;
    if (responsible_user_id !== undefined) updateData.responsible_user_id = responsible_user_id;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('risks')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Risk not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Risk not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE risks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             probability = COALESCE($4, probability),
             severity = COALESCE($5, severity),
             criticality = COALESCE($6, criticality),
             status = COALESCE($7, status),
             responsible_user_id = COALESCE($8, responsible_user_id),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [title, description, category, probability, severity, criticality, status, responsible_user_id, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Risk not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete risk
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('risks')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Risk not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Risk not found' });
      }
      
      res.json({ message: 'Risk deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM risks WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Risk not found' });
      }

      res.json({ message: 'Risk deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


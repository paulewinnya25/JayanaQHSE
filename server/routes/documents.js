const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, category, status } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('documents').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category', category);
      if (status) query = query.eq('status', status);
      
      query = query.order('created_at', { ascending: false });
      
      const { data: documents, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const userIds = [...new Set([
        ...documents.map(d => d.uploaded_by),
        ...documents.map(d => d.validated_by)
      ].filter(Boolean))];
      
      const chantierIds = [...new Set(documents.map(d => d.chantier_id).filter(Boolean))];
      
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
      
      const result = (documents || []).map(doc => ({
        ...doc,
        uploaded_by_name: formatFullName(usersMap[doc.uploaded_by]),
        validated_by_name: formatFullName(usersMap[doc.validated_by]),
        chantier_name: chantiersMap[doc.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      let query = `
        SELECT d.*, 
               u1.first_name || ' ' || u1.last_name as uploaded_by_name,
               u2.first_name || ' ' || u2.last_name as validated_by_name,
               c.name as chantier_name
        FROM documents d
        LEFT JOIN users u1 ON d.uploaded_by = u1.id
        LEFT JOIN users u2 ON d.validated_by = u2.id
        LEFT JOIN chantiers c ON d.chantier_id = c.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 1;

      if (chantier_id) {
        query += ` AND d.chantier_id = $${paramCount++}`;
        params.push(chantier_id);
      } else if (req.user.chantier_id) {
        query += ` AND d.chantier_id = $${paramCount++}`;
        params.push(req.user.chantier_id);
      }

      if (type) {
        query += ` AND d.type = $${paramCount++}`;
        params.push(type);
      }

      if (category) {
        query += ` AND d.category = $${paramCount++}`;
        params.push(category);
      }

      if (status) {
        query += ` AND d.status = $${paramCount++}`;
        params.push(status);
      }

      query += ' ORDER BY d.created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !doc) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Récupérer les relations
      const userIds = [doc.uploaded_by, doc.validated_by].filter(Boolean);
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', doc.chantier_id)
        .single();
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const result = {
        ...doc,
        uploaded_by_name: formatFullName(usersMap[doc.uploaded_by]),
        validated_by_name: formatFullName(usersMap[doc.validated_by]),
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(`
        SELECT d.*, 
               u1.first_name || ' ' || u1.last_name as uploaded_by_name,
               u2.first_name || ' ' || u2.last_name as validated_by_name,
               c.name as chantier_name
        FROM documents d
        LEFT JOIN users u1 ON d.uploaded_by = u1.id
        LEFT JOIN users u2 ON d.validated_by = u2.id
        LEFT JOIN chantiers c ON d.chantier_id = c.id
        WHERE d.id = $1
      `, [req.params.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error fetching document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create document
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, type, category, file_url, version } = req.body;
    const dbType = getDatabaseType();
    
    const docData = {
      chantier_id: chantier_id || req.user.chantier_id,
      title,
      type,
      category,
      file_url,
      version: version || '1.0',
      uploaded_by: req.user.id
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('documents')
        .insert(docData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO documents (chantier_id, title, type, category, file_url, version, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [docData.chantier_id, docData.title, docData.type, docData.category, docData.file_url, docData.version, docData.uploaded_by]
      );

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, type, category, file_url, version, status } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (version !== undefined) updateData.version = version;
    if (status !== undefined) updateData.status = status;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Document not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE documents 
         SET title = COALESCE($1, title),
             type = COALESCE($2, type),
             category = COALESCE($3, category),
             file_url = COALESCE($4, file_url),
             version = COALESCE($5, version),
             status = COALESCE($6, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [title, type, category, file_url, version, status, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Validate document
router.post('/:id/validate', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    const updateData = {
      status: 'validated',
      validated_by: req.user.id,
      validated_at: new Date().toISOString()
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Document not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE documents 
         SET status = 'validated',
             validated_by = $1,
             validated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [req.user.id, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error validating document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('documents')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Document not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      res.json({ message: 'Document deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json({ message: 'Document deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


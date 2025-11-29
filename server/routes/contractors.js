const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all contractors
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, status } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('contractors').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (type) query = query.eq('type', type);
      if (status) query = query.eq('status', status);
      
      query = query.order('created_at', { ascending: false });
      
      const { data: contractors, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les chantiers
      const chantierIds = [...new Set(contractors.map(c => c.chantier_id).filter(Boolean))];
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => { chantiersMap[c.id] = c; });
      
      const result = (contractors || []).map(contractor => ({
        ...contractor,
        chantier_name: chantiersMap[contractor.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      let query = `
        SELECT c.*, ch.name as chantier_name
        FROM contractors c
        LEFT JOIN chantiers ch ON c.chantier_id = ch.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 1;

      if (chantier_id) {
        query += ` AND c.chantier_id = $${paramCount++}`;
        params.push(chantier_id);
      } else if (req.user.chantier_id) {
        query += ` AND c.chantier_id = $${paramCount++}`;
        params.push(req.user.chantier_id);
      }

      if (type) {
        query += ` AND c.type = $${paramCount++}`;
        params.push(type);
      }

      if (status) {
        query += ` AND c.status = $${paramCount++}`;
        params.push(status);
      }

      query += ' ORDER BY c.created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching contractors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single contractor
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: contractor, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !contractor) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
      
      // Récupérer le chantier
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', contractor.chantier_id)
        .single();
      
      const result = {
        ...contractor,
        chantier_name: chantier?.name || null
      };
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(`
        SELECT c.*, ch.name as chantier_name
        FROM contractors c
        LEFT JOIN chantiers ch ON c.chantier_id = ch.id
        WHERE c.id = $1
      `, [req.params.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contractor not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error fetching contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create contractor
router.post('/', auth, async (req, res) => {
  try {
    const { name, company, email, phone, chantier_id, type, certifications, access_level } = req.body;
    const dbType = getDatabaseType();
    
    const contractorData = {
      name,
      company,
      email,
      phone,
      chantier_id: chantier_id || req.user.chantier_id,
      type,
      certifications: certifications || [],
      access_level
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('contractors')
        .insert(contractorData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO contractors (name, company, email, phone, chantier_id, type, certifications, access_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [contractorData.name, contractorData.company, contractorData.email, contractorData.phone, contractorData.chantier_id, contractorData.type, contractorData.certifications, contractorData.access_level]
      );

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update contractor
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, company, email, phone, type, certifications, access_level, status } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (type !== undefined) updateData.type = type;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (access_level !== undefined) updateData.access_level = access_level;
    if (status !== undefined) updateData.status = status;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('contractors')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Contractor not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE contractors 
         SET name = COALESCE($1, name),
             company = COALESCE($2, company),
             email = COALESCE($3, email),
             phone = COALESCE($4, phone),
             type = COALESCE($5, type),
             certifications = COALESCE($6, certifications),
             access_level = COALESCE($7, access_level),
             status = COALESCE($8, status)
         WHERE id = $9
         RETURNING *`,
        [name, company, email, phone, type, certifications, access_level, status, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contractor not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete contractor
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('contractors')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Contractor not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
      
      res.json({ message: 'Contractor deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM contractors WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contractor not found' });
      }

      res.json({ message: 'Contractor deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting contractor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


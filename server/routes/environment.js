const express = require('express');
const router = express.Router();
const { getDatabaseType, getSupabase, getPool } = require('../config/database');

// Get all environment data
router.get('/', async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('environmental_data')
        .select('*')
        .order('date_recorded', { ascending: false });
      
      if (error) throw error;
      
      res.json(data || []);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM environmental_data ORDER BY date_recorded DESC'
      );
      res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching environment data:', error);
    res.status(500).json({ error: 'Error fetching environment data', message: error.message });
  }
});

// Get environment statistics
router.get('/stats', async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Récupérer toutes les données pour calculer les stats
      const { data, error } = await supabase
        .from('environmental_data')
        .select('type, category, date_recorded');
      
      if (error) throw error;
      
      // Calculer les stats
      const stats = {
        total_records: data?.length || 0,
        unique_types: new Set(data?.map(d => d.type).filter(Boolean)).size || 0,
        unique_categories: new Set(data?.map(d => d.category).filter(Boolean)).size || 0,
        first_record: data && data.length > 0 ? 
          new Date(Math.min(...data.map(d => new Date(d.date_recorded).getTime()))).toISOString() : null,
        last_record: data && data.length > 0 ? 
          new Date(Math.max(...data.map(d => new Date(d.date_recorded).getTime()))).toISOString() : null
      };
      
      res.json(stats);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_records,
          COUNT(DISTINCT type) as unique_types,
          COUNT(DISTINCT category) as unique_categories,
          MIN(date_recorded) as first_record,
          MAX(date_recorded) as last_record
        FROM environmental_data
      `);
      res.json(result.rows[0] || {});
    }
  } catch (error) {
    console.error('❌ Error fetching environment stats:', error);
    res.status(500).json({ error: 'Error fetching environment stats', message: error.message });
  }
});

// Create new environment data
router.post('/', async (req, res) => {
  try {
    const { type, category, value, unit, date_recorded, notes, recorded_by } = req.body;
    const dbType = getDatabaseType();
    
    const envData = {
      type,
      category,
      value,
      unit,
      date_recorded: date_recorded || new Date().toISOString(),
      notes,
      recorded_by: recorded_by || 1
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('environmental_data')
        .insert(envData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO environmental_data (type, category, value, unit, date_recorded, notes, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [envData.type, envData.category, envData.value, envData.unit, envData.date_recorded, envData.notes, envData.recorded_by]
      );
      
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating environment data:', error);
    res.status(500).json({ error: 'Error creating environment data', message: error.message });
  }
});

// Update environment data
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, value, unit, date_recorded, notes } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (value !== undefined) updateData.value = value;
    if (unit !== undefined) updateData.unit = unit;
    if (date_recorded !== undefined) updateData.date_recorded = date_recorded;
    if (notes !== undefined) updateData.notes = notes;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('environmental_data')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Environment data not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ error: 'Environment data not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE environmental_data 
         SET type = $1, category = $2, value = $3, unit = $4, date_recorded = $5, notes = $6
         WHERE id = $7
         RETURNING *`,
        [type, category, value, unit, date_recorded, notes, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Environment data not found' });
      }
      
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating environment data:', error);
    res.status(500).json({ error: 'Error updating environment data', message: error.message });
  }
});

// Delete environment data
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('environmental_data')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Environment data not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ error: 'Environment data not found' });
      }
      
      res.json({ message: 'Environment data deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        'DELETE FROM environmental_data WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Environment data not found' });
      }
      
      res.json({ message: 'Environment data deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting environment data:', error);
    res.status(500).json({ error: 'Error deleting environment data', message: error.message });
  }
});

module.exports = router;


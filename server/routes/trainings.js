const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all trainings
router.get('/', auth, async (req, res) => {
  try {
    const { status, type } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('trainings').select('*');
      
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      
      query = query.order('date_planned', { ascending: false });
      
      const { data: trainings, error } = await query;
      
      if (error) throw error;
      
      // Récupérer le nombre de participants pour chaque formation
      const trainingIds = trainings.map(t => t.id);
      const { data: participants } = await supabase
        .from('training_participants')
        .select('training_id')
        .in('training_id', trainingIds);
      
      // Compter les participants par formation
      const participantCounts = {};
      (participants || []).forEach(p => {
        participantCounts[p.training_id] = (participantCounts[p.training_id] || 0) + 1;
      });
      
      const result = (trainings || []).map(training => ({
        ...training,
        participant_count: participantCounts[training.id] || 0
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      let query = `
        SELECT t.*, 
               COUNT(tp.id) as participant_count
        FROM trainings t
        LEFT JOIN training_participants tp ON t.id = tp.training_id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 1;

      if (status) {
        query += ` AND t.status = $${paramCount++}`;
        params.push(status);
      }

      if (type) {
        query += ` AND t.type = $${paramCount++}`;
        params.push(type);
      }

      query += ' GROUP BY t.id ORDER BY t.date_planned DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching trainings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single training
router.get('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: training, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !training) {
        return res.status(404).json({ message: 'Training not found' });
      }
      
      // Récupérer les participants
      const { data: participants } = await supabase
        .from('training_participants')
        .select('*')
        .eq('training_id', req.params.id);
      
      // Récupérer les infos des utilisateurs
      const userIds = participants?.map(p => p.user_id).filter(Boolean) || [];
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const participantsWithNames = (participants || []).map(p => ({
        ...p,
        participant_name: formatFullName(usersMap[p.user_id]),
        email: usersMap[p.user_id]?.email || null
      }));
      
      res.json({
        ...training,
        participant_count: participantsWithNames.length,
        participants: participantsWithNames
      });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(`
        SELECT t.*, 
               COUNT(tp.id) as participant_count
        FROM trainings t
        LEFT JOIN training_participants tp ON t.id = tp.training_id
        WHERE t.id = $1
        GROUP BY t.id
      `, [req.params.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Training not found' });
      }

      // Get participants
      const participants = await pool.query(`
        SELECT tp.*, 
               u.first_name || ' ' || u.last_name as participant_name,
               u.email
        FROM training_participants tp
        LEFT JOIN users u ON tp.user_id = u.id
        WHERE tp.training_id = $1
      `, [req.params.id]);

      res.json({
        ...result.rows[0],
        participants: participants.rows
      });
    }
  } catch (error) {
    console.error('❌ Error fetching training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create training
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, duration, provider, date_planned } = req.body;
    const dbType = getDatabaseType();
    
    const trainingData = {
      title,
      description,
      type,
      duration,
      provider,
      date_planned
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('trainings')
        .insert(trainingData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO trainings (title, description, type, duration, provider, date_planned)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [trainingData.title, trainingData.description, trainingData.type, trainingData.duration, trainingData.provider, trainingData.date_planned]
      );

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update training
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, type, duration, provider, date_planned, date_realized, status } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (duration !== undefined) updateData.duration = duration;
    if (provider !== undefined) updateData.provider = provider;
    if (date_planned !== undefined) updateData.date_planned = date_planned;
    if (date_realized !== undefined) updateData.date_realized = date_realized;
    if (status !== undefined) updateData.status = status;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('trainings')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Training not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Training not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE trainings 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             type = COALESCE($3, type),
             duration = COALESCE($4, duration),
             provider = COALESCE($5, provider),
             date_planned = COALESCE($6, date_planned),
             date_realized = COALESCE($7, date_realized),
             status = COALESCE($8, status)
         WHERE id = $9
         RETURNING *`,
        [title, description, type, duration, provider, date_planned, date_realized, status, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Training not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete training
router.delete('/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Training not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Training not found' });
      }
      
      res.json({ message: 'Training deleted successfully' });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query('DELETE FROM trainings WHERE id = $1 RETURNING *', [req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Training not found' });
      }

      res.json({ message: 'Training deleted successfully' });
    }
  } catch (error) {
    console.error('❌ Error deleting training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add participant to training
router.post('/:id/participants', auth, async (req, res) => {
  try {
    const { user_id } = req.body;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Vérifier si le participant existe déjà
      const { data: existing } = await supabase
        .from('training_participants')
        .select('id')
        .eq('training_id', req.params.id)
        .eq('user_id', user_id)
        .single();
      
      if (existing) {
        return res.status(400).json({ message: 'Participant already registered' });
      }
      
      const { data, error } = await supabase
        .from('training_participants')
        .insert({
          training_id: req.params.id,
          user_id
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return res.status(400).json({ message: 'Participant already registered' });
        }
        throw error;
      }
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO training_participants (training_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [req.params.id, user_id]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Participant already registered or invalid' });
      }

      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error adding participant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update participant status
router.put('/:id/participants/:participantId', auth, async (req, res) => {
  try {
    const { status, completed_at, expires_at } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (completed_at !== undefined) updateData.completed_at = completed_at;
    if (expires_at !== undefined) updateData.expires_at = expires_at;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('training_participants')
        .update(updateData)
        .eq('id', req.params.participantId)
        .eq('training_id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Participant not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Participant not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
      const result = await pool.query(
        `UPDATE training_participants 
         SET status = COALESCE($1, status),
             completed_at = COALESCE($2, completed_at),
             expires_at = COALESCE($3, expires_at)
         WHERE id = $4 AND training_id = $5
         RETURNING *`,
        [status, completed_at, expires_at, req.params.participantId, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Participant not found' });
      }

      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating participant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


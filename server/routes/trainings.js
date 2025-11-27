const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all trainings
router.get('/', auth, async (req, res) => {
  try {
    const { status, type } = req.query;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single training
router.get('/:id', auth, async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create training
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, duration, provider, date_planned } = req.body;

    const result = await pool.query(
      `INSERT INTO trainings (title, description, type, duration, provider, date_planned)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, type, duration, provider, date_planned]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update training
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, type, duration, provider, date_planned, date_realized, status } = req.body;

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete training
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM trainings WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Training not found' });
    }

    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add participant to training
router.post('/:id/participants', auth, async (req, res) => {
  try {
    const { user_id } = req.body;

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update participant status
router.put('/:id/participants/:participantId', auth, async (req, res) => {
  try {
    const { status, completed_at, expires_at } = req.body;

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


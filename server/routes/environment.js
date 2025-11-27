const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all environment data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM environmental_data ORDER BY date_recorded DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching environment data:', error);
    res.status(500).json({ error: 'Error fetching environment data' });
  }
});

// Get environment statistics
router.get('/stats', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching environment stats:', error);
    res.status(500).json({ error: 'Error fetching environment stats' });
  }
});

// Create new environment data
router.post('/', async (req, res) => {
  try {
    const { type, category, value, unit, date_recorded, notes, recorded_by } = req.body;
    
    const result = await pool.query(
      `INSERT INTO environmental_data (type, category, value, unit, date_recorded, notes, recorded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [type, category, value, unit, date_recorded || new Date(), notes, recorded_by || 1]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating environment data:', error);
    res.status(500).json({ error: 'Error creating environment data' });
  }
});

// Update environment data
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, value, unit, date_recorded, notes } = req.body;
    
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
  } catch (error) {
    console.error('Error updating environment data:', error);
    res.status(500).json({ error: 'Error updating environment data' });
  }
});

// Delete environment data
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM environmental_data WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Environment data not found' });
    }
    
    res.json({ message: 'Environment data deleted successfully' });
  } catch (error) {
    console.error('Error deleting environment data:', error);
    res.status(500).json({ error: 'Error deleting environment data' });
  }
});

module.exports = router;


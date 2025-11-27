const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const { chantier_id, type, category, status } = req.query;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create document
router.post('/', auth, async (req, res) => {
  try {
    const { chantier_id, title, type, category, file_url, version } = req.body;

    const result = await pool.query(
      `INSERT INTO documents (chantier_id, title, type, category, file_url, version, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [chantier_id || req.user.chantier_id, title, type, category, file_url, version || '1.0', req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, type, category, file_url, version, status } = req.body;

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate document
router.post('/:id/validate', auth, async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


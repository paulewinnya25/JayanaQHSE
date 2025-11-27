const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/contractors', require('./routes/contractors'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/environment', require('./routes/environment'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/non-conformities', require('./routes/nonConformities'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/risks', require('./routes/risks'));
app.use('/api/trainings', require('./routes/trainings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jayana qhse API is running' });
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Jayana qhse server running on port ${PORT}`);
});


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getDatabaseType, getPool, getSupabase } = require('./config/database');

const app = express();

// Middleware
// Configuration CORS pour accepter les requêtes depuis Netlify et localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://jayanaqhse.netlify.app',
    /\.netlify\.app$/ // Accepter tous les sous-domaines Netlify
  ].filter(Boolean), // Filtrer les valeurs undefined
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, { 
    body: req.method === 'POST' ? { ...req.body, password: req.body.password ? '***' : undefined } : undefined,
    timestamp: new Date().toISOString()
  });
  next();
});

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
app.get('/api/health', async (req, res) => {
  const dbType = getDatabaseType();
  res.json({ 
    status: 'OK', 
    message: 'Jayana qhse API is running',
    database: dbType
  });
});

// Test database connection
(async () => {
  const dbType = getDatabaseType();
  if (dbType === 'supabase') {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (OK for first run)
          console.error('❌ Supabase connection error:', error);
        } else {
          console.log('✅ Supabase connected successfully');
        }
      } catch (err) {
        console.log('✅ Supabase client initialized (tables may need to be created)');
      }
    }
  } else {
    const pool = getPool();
    if (pool) {
      pool.query('SELECT NOW()', (err, res) => {
        if (err) {
          console.error('❌ Database connection error:', err);
        } else {
          console.log('✅ Database connected successfully');
        }
      });
    }
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Jayana qhse server running on port ${PORT}`);
});


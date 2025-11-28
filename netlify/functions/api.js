// Netlify Function qui route toutes les requêtes API
// Cette fonction utilise le serveur Express existant

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

// Importer le serveur Express existant
const app = express();

// Middleware CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://jayanaqhse.netlify.app',
    /\.netlify\.app$/
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, { 
    body: req.method === 'POST' ? { ...req.body, password: req.body.password ? '***' : undefined } : undefined,
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes - importer depuis le serveur existant
// Note: Netlify Functions route déjà vers /api, donc on utilise les chemins sans /api
app.use('/auth', require('../../server/routes/auth'));
app.use('/dashboard', require('../../server/routes/dashboard'));
app.use('/contractors', require('../../server/routes/contractors'));
app.use('/documents', require('../../server/routes/documents'));
app.use('/environment', require('../../server/routes/environment'));
app.use('/incidents', require('../../server/routes/incidents'));
app.use('/inspections', require('../../server/routes/inspections'));
app.use('/maintenance', require('../../server/routes/maintenance'));
app.use('/non-conformities', require('../../server/routes/nonConformities'));
app.use('/notifications', require('../../server/routes/notifications'));
app.use('/reports', require('../../server/routes/reports'));
app.use('/risks', require('../../server/routes/risks'));
app.use('/trainings', require('../../server/routes/trainings'));

// Health check
app.get('/health', async (req, res) => {
  const { getSupabase } = require('../../server/config/database');
  const supabase = getSupabase();
  
  let dbType = 'postgresql';
  if ((process.env.SUPABASE_URL || process.env.USE_SUPABASE === 'true' || process.env.USE_SUPABASE === '"true"') && supabase) {
    dbType = 'supabase';
  }
  
  res.json({ 
    status: 'OK', 
    message: 'Jayana qhse API is running',
    database: dbType,
    supabaseConfigured: !!supabase,
    environment: {
      USE_SUPABASE: process.env.USE_SUPABASE,
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    }
  });
});

// Convertir l'app Express en fonction serverless
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Netlify Functions nécessitent que context.callbackWaitsForEmptyEventLoop = false
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Netlify route /api/* vers cette fonction, donc on doit ajuster le path
  // Si le path commence par /api, on le retire pour que Express puisse router correctement
  if (event.path && event.path.startsWith('/api')) {
    event.path = event.path.replace('/api', '') || '/';
  }
  
  return await handler(event, context);
};


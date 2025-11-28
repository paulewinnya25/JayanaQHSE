// Netlify Function qui route toutes les requêtes API
// Cette fonction utilise le serveur Express existant

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

// Charger les variables d'environnement
// Dans Netlify Functions, les variables d'environnement sont déjà disponibles
// mais on charge dotenv pour le développement local
require('dotenv').config();

// Log des variables d'environnement pour le débogage (sans exposer les clés)
console.log('🔍 Environment variables check:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET (' + process.env.SUPABASE_ANON_KEY.length + ' chars)' : 'NOT SET',
  USE_SUPABASE: process.env.USE_SUPABASE,
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV
});

// Ajouter le chemin du serveur au require path pour que les modules soient trouvés
const serverPath = path.join(__dirname, '../../server');
process.env.NODE_PATH = process.env.NODE_PATH 
  ? `${process.env.NODE_PATH}:${serverPath}`
  : serverPath;

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
  
  // Log des variables d'environnement à chaque appel (pour débogage)
  console.log('🔍 Environment check in handler:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET (' + process.env.SUPABASE_URL.substring(0, 30) + '...)' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET (' + process.env.SUPABASE_ANON_KEY.length + ' chars)' : 'NOT SET',
    USE_SUPABASE: process.env.USE_SUPABASE,
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  });
  
  // Log pour le débogage
  console.log('📥 Netlify Function called:', {
    path: event.path,
    rawPath: event.rawPath,
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters
  });
  
  // Netlify route /api/* vers cette fonction via la redirection
  // Le path dans event.path sera comme "/api/auth/login"
  // On doit le transformer en "/auth/login" pour Express
  if (event.path) {
    // Retirer /api du début du path
    if (event.path.startsWith('/api')) {
      event.path = event.path.replace(/^\/api/, '') || '/';
    }
    // Aussi mettre à jour rawPath si présent
    if (event.rawPath && event.rawPath.startsWith('/api')) {
      event.rawPath = event.rawPath.replace(/^\/api/, '') || '/';
    }
  }
  
  // Si le path est vide après suppression de /api, utiliser rawPath
  if (!event.path || event.path === '/') {
    if (event.rawPath) {
      event.path = event.rawPath.replace(/^\/api/, '') || '/';
    }
  }
  
  try {
    const result = await handler(event, context);
    console.log('✅ Function response status:', result?.statusCode || 'unknown');
    return result;
  } catch (error) {
    console.error('❌ Netlify Function Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        path: event.path
      })
    };
  }
};


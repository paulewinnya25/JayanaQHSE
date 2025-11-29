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

// Résoudre les chemins absolus pour les modules du serveur
// Dans Netlify Functions, __dirname pointe vers /var/task/netlify/functions
const serverPath = path.resolve(__dirname, '../../server');
const configPath = path.resolve(__dirname, '../../server/config');

// Ajouter les chemins au module.paths pour que require() puisse les trouver
if (!module.paths.includes(serverPath)) {
  module.paths.push(serverPath);
}
if (!module.paths.includes(configPath)) {
  module.paths.push(configPath);
}

console.log('📁 Paths configured:', {
  __dirname,
  serverPath,
  configPath,
  modulePaths: module.paths.slice(0, 3) // Afficher seulement les 3 premiers
});

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

// Routes - importer depuis le serveur existant avec chemins absolus
// Note: Netlify Functions route déjà vers /api, donc on utilise les chemins sans /api
const routesPath = path.resolve(__dirname, '../../server/routes');

app.use('/auth', require(path.join(routesPath, 'auth')));
app.use('/dashboard', require(path.join(routesPath, 'dashboard')));
app.use('/contractors', require(path.join(routesPath, 'contractors')));
app.use('/documents', require(path.join(routesPath, 'documents')));
app.use('/environment', require(path.join(routesPath, 'environment')));
app.use('/incidents', require(path.join(routesPath, 'incidents')));
app.use('/inspections', require(path.join(routesPath, 'inspections')));
app.use('/maintenance', require(path.join(routesPath, 'maintenance')));
app.use('/non-conformities', require(path.join(routesPath, 'nonConformities')));
app.use('/notifications', require(path.join(routesPath, 'notifications')));
app.use('/reports', require(path.join(routesPath, 'reports')));
app.use('/risks', require(path.join(routesPath, 'risks')));
app.use('/trainings', require(path.join(routesPath, 'trainings')));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Utiliser des chemins absolus pour charger les modules
    const databasePath = path.resolve(__dirname, '../../server/config/database');
    const supabasePath = path.resolve(__dirname, '../../server/config/supabase');
    
    // Forcer le rechargement des modules pour s'assurer que les variables sont chargées
    if (require.cache[databasePath]) {
      delete require.cache[databasePath];
    }
    if (require.cache[supabasePath]) {
      delete require.cache[supabasePath];
    }
    
    // Recharger dotenv pour s'assurer que les variables sont disponibles
    require('dotenv').config();
    
    const { getSupabase, getDatabaseType } = require(databasePath);
  
  // Forcer l'initialisation de Supabase
  const supabase = getSupabase();
  const dbType = getDatabaseType();
  
  console.log('🏥 Health check details:', {
    dbType,
    hasSupabase: !!supabase,
    supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'SET (' + process.env.SUPABASE_ANON_KEY.length + ' chars)' : 'NOT SET',
    useSupabase: process.env.USE_SUPABASE
  });
  
    res.json({ 
      status: 'OK', 
      message: 'Jayana qhse API is running',
      database: dbType,
      supabaseConfigured: !!supabase,
      environment: {
        USE_SUPABASE: process.env.USE_SUPABASE,
        SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET (' + process.env.SUPABASE_ANON_KEY.length + ' chars)' : 'NOT SET'
      }
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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
      name: error.name,
      path: event.path,
      httpMethod: event.httpMethod
    });
    
    // Si c'est une erreur de module non trouvé, donner plus de détails
    if (error.message.includes('Cannot find module')) {
      console.error('❌ Module not found error. Check that all dependencies are bundled.');
      console.error('❌ Missing module:', error.message);
    }
    
    // Si c'est une erreur Supabase SQL, donner un message plus clair
    if (error.code === 'SUPABASE_SQL_NOT_SUPPORTED') {
      return {
        statusCode: 501, // Not Implemented
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'This route needs to be adapted for Supabase',
          error: 'Direct SQL queries are not supported with Supabase. The route needs to be migrated to use Supabase client methods.',
          path: event.path,
          code: 'ROUTE_NOT_ADAPTED'
        })
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
        path: event.path,
        code: error.code,
        // En production, on peut montrer l'erreur pour le débogage
        details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      })
    };
  }
};


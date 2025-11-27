require('dotenv').config();

// Debug: Log environment variables
console.log('🔍 Environment check:');
console.log('  USE_SUPABASE:', process.env.USE_SUPABASE);
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

const USE_SUPABASE = process.env.USE_SUPABASE === 'true' || process.env.USE_SUPABASE === '"true"' || process.env.SUPABASE_URL;

let pool = null;
let supabase = null;
let databaseType = 'postgresql';

// Si Supabase est configuré, l'utiliser
if (USE_SUPABASE || process.env.SUPABASE_URL) {
  console.log('🔧 Attempting to initialize Supabase...');
  try {
    const { supabase: supabaseClient } = require('./supabase');
    supabase = supabaseClient;
    if (supabase) {
      databaseType = 'supabase';
      console.log('✅ Using Supabase database');
    } else {
      console.error('❌ Supabase client is null after initialization');
    }
  } catch (error) {
    console.error('❌ Error initializing Supabase, falling back to PostgreSQL:', error);
    console.error('Error details:', error.message, error.stack);
  }
} else {
  console.log('⚠️ Supabase not configured. USE_SUPABASE:', process.env.USE_SUPABASE, 'SUPABASE_URL:', process.env.SUPABASE_URL);
}

// Ne créer le pool PostgreSQL que si Supabase n'est PAS configuré
if (!supabase && (!USE_SUPABASE && !process.env.SUPABASE_URL)) {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'qhse_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    // Test database connection
    pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('❌ Database connection error:', err);
    });

    databaseType = 'postgresql';
    console.log('✅ Using PostgreSQL database');
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL:', error);
  }
}

// Wrapper pour les requêtes qui fonctionne avec les deux systèmes
const query = async (sql, params = []) => {
  if (databaseType === 'supabase' && supabase) {
    // Pour Supabase, nous devons convertir les requêtes SQL en appels API
    // Cette fonction est une interface de compatibilité
    // Note: Les routes devront être adaptées pour utiliser les méthodes Supabase directement
    throw new Error('Direct SQL queries not supported with Supabase. Use Supabase methods instead.');
  } else if (pool) {
    // PostgreSQL standard
    return await pool.query(sql, params);
  } else {
    throw new Error('No database connection available');
  }
};

// Getter pour le type de base de données
const getDatabaseType = () => databaseType;

// Getter pour Supabase client
const getSupabase = () => supabase;

// Getter pour PostgreSQL pool
const getPool = () => pool;

module.exports = {
  query,
  pool,
  supabase,
  getDatabaseType,
  getSupabase,
  getPool,
};

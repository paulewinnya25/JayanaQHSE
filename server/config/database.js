require('dotenv').config();

const USE_SUPABASE = process.env.USE_SUPABASE === 'true' || process.env.SUPABASE_URL;

let pool = null;
let supabase = null;
let databaseType = 'postgresql';

// Si Supabase est configuré, l'utiliser
if (USE_SUPABASE) {
  try {
    const { supabase: supabaseClient } = require('./supabase');
    supabase = supabaseClient;
    databaseType = 'supabase';
    console.log('✅ Using Supabase database');
  } catch (error) {
    console.error('❌ Error initializing Supabase, falling back to PostgreSQL:', error);
  }
}

// Sinon, utiliser PostgreSQL directement
if (!supabase) {
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

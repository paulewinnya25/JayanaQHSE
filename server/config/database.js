require('dotenv').config();

// Debug: Log environment variables
console.log('🔍 Environment check:');
console.log('  USE_SUPABASE:', process.env.USE_SUPABASE);
console.log('  USE_SUPABASE type:', typeof process.env.USE_SUPABASE);
console.log('  USE_SUPABASE trimmed:', process.env.USE_SUPABASE?.trim());
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('  SUPABASE_URL value:', process.env.SUPABASE_URL);
console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('  SUPABASE_ANON_KEY length:', process.env.SUPABASE_ANON_KEY?.length);

// Normaliser USE_SUPABASE (enlever guillemets et espaces)
const useSupabaseRaw = process.env.USE_SUPABASE?.trim().replace(/^["']|["']$/g, '') || '';
const USE_SUPABASE = useSupabaseRaw === 'true' || !!process.env.SUPABASE_URL;

let pool = null;
let supabase = null;
let databaseType = 'postgresql';

// Fonction pour initialiser Supabase (lazy loading)
const initializeSupabase = () => {
  // Re-vérifier les variables à chaque fois
  const useSupabaseRaw = process.env.USE_SUPABASE?.trim().replace(/^["']|["']$/g, '') || '';
  const useSupabase = useSupabaseRaw === 'true' || !!process.env.SUPABASE_URL;
  
  if (useSupabase || process.env.SUPABASE_URL) {
    console.log('🔧 Attempting to initialize Supabase...');
    console.log('🔧 Environment at init:', {
      USE_SUPABASE: process.env.USE_SUPABASE,
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET (' + process.env.SUPABASE_ANON_KEY.length + ' chars)' : 'NOT SET',
      useSupabase
    });
    try {
      // Clear le cache du module pour forcer le rechargement
      delete require.cache[require.resolve('./supabase')];
      const { getSupabaseClient } = require('./supabase');
      const supabaseClient = getSupabaseClient();
      if (supabaseClient) {
        supabase = supabaseClient;
        databaseType = 'supabase';
        console.log('✅ Using Supabase database');
        console.log('✅ Supabase client initialized:', !!supabase);
        return true;
      } else {
        console.error('❌ Supabase client is null after initialization');
        console.error('❌ Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing Supabase, falling back to PostgreSQL:', error);
      console.error('Error details:', error.message, error.stack);
      return false;
    }
  } else {
    console.log('⚠️ Supabase not configured. USE_SUPABASE:', process.env.USE_SUPABASE, 'SUPABASE_URL:', process.env.SUPABASE_URL);
    return false;
  }
};

// Initialiser Supabase au démarrage si les variables sont disponibles
// Cela garantit que Supabase est prêt dès le démarrage
if (process.env.SUPABASE_URL || process.env.USE_SUPABASE === 'true' || process.env.USE_SUPABASE === '"true"') {
  console.log('🔧 Auto-initializing Supabase at startup...');
  initializeSupabase();
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
const getDatabaseType = () => {
  // Normaliser USE_SUPABASE comme au démarrage
  const useSupabaseRaw = process.env.USE_SUPABASE?.trim().replace(/^["']|["']$/g, '') || '';
  const useSupabase = useSupabaseRaw === 'true' || !!process.env.SUPABASE_URL;
  
  // Force Supabase if configured and client is available
  if ((useSupabase || process.env.SUPABASE_URL) && supabase) {
    return 'supabase';
  }
  return databaseType;
};

// Getter pour Supabase client (lazy initialization)
const getSupabase = () => {
  // Re-vérifier les variables d'environnement à chaque appel
  const useSupabaseRaw = process.env.USE_SUPABASE?.trim().replace(/^["']|["']$/g, '') || '';
  const useSupabase = useSupabaseRaw === 'true' || !!process.env.SUPABASE_URL;
  
  // Si supabase est null mais que les variables sont configurées, réessayer l'initialisation
  if (!supabase && (useSupabase || process.env.SUPABASE_URL)) {
    console.log('⚠️ Supabase client is null, initializing now...');
    console.log('⚠️ Environment check:', {
      USE_SUPABASE: process.env.USE_SUPABASE,
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET (' + (process.env.SUPABASE_ANON_KEY?.length || 0) + ' chars)' : 'NOT SET',
      useSupabase
    });
    
    // Essayer d'initialiser
    const initialized = initializeSupabase();
    
    if (!initialized) {
      console.error('❌ Failed to initialize Supabase client');
      // Essayer directement avec getSupabaseClient
      try {
        delete require.cache[require.resolve('./supabase')];
        const { getSupabaseClient } = require('./supabase');
        const client = getSupabaseClient();
        if (client) {
          supabase = client;
          databaseType = 'supabase';
          console.log('✅ Supabase client initialized via direct call');
        }
      } catch (err) {
        console.error('❌ Error getting Supabase client directly:', err);
      }
    }
  }
  
  console.log('🔍 getSupabase result:', {
    supabaseIsNull: supabase === null,
    supabaseIsUndefined: supabase === undefined,
    hasSupabase: !!supabase,
    databaseType,
    useSupabase,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    currentSupabaseValue: supabase ? 'exists' : 'null'
  });
  
  return supabase;
};

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

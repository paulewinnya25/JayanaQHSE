const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Variables d'environnement avec fallback
const getSupabaseUrl = () => process.env.SUPABASE_URL || 'https://oerdkjgkmalphmpwoymt.supabase.co';
const getSupabaseAnonKey = () => process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || null;

// Clients Supabase (initialisés de manière lazy)
let supabase = null;
let supabaseAdmin = null;

// Fonction pour obtenir le client Supabase (lazy initialization)
const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ SUPABASE_URL or SUPABASE_ANON_KEY not set');
      return null;
    }
    
    console.log('🔧 Initializing Supabase client...', {
      url: supabaseUrl ? 'SET' : 'NOT SET',
      key: supabaseAnonKey ? 'SET' : 'NOT SET'
    });
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized');
  }
  return supabase;
};

// Fonction pour obtenir le client admin Supabase (lazy initialization)
const getSupabaseAdminClient = () => {
  if (!supabaseAdmin) {
    const supabaseServiceKey = getSupabaseServiceKey();
    if (supabaseServiceKey) {
      const supabaseUrl = getSupabaseUrl();
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      console.log('✅ Supabase admin client initialized');
    }
  }
  return supabaseAdmin;
};

// Initialiser les clients au chargement si les variables sont disponibles
// (pour compatibilité avec le code existant)
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Helper pour exécuter des requêtes SQL brutes
const query = async (sql, params = []) => {
  try {
    // Pour Supabase, nous utilisons RPC ou les méthodes de l'API REST
    // Cette fonction permet de convertir les requêtes SQL en requêtes Supabase
    console.log('Executing query:', sql);
    
    // Note: Supabase ne supporte pas directement les requêtes SQL arbitraires via le client JS
    // Pour les requêtes complexes, il faut utiliser l'API REST ou créer des fonctions RPC
    // Pour l'instant, nous retournons null et utiliserons les méthodes Supabase standard
    
    return { rows: [], rowCount: 0 };
  } catch (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
};

// Helper pour exécuter des requêtes avec le client admin
const adminQuery = async (sql, params = []) => {
  if (!supabaseAdmin) {
    throw new Error('Service role key not configured');
  }
  return query(sql, params);
};

module.exports = {
  supabase: getSupabaseClient(),
  supabaseAdmin: getSupabaseAdminClient(),
  getSupabaseClient,
  getSupabaseAdminClient,
  query,
  adminQuery,
};


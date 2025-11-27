const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://oerdkjgkmalphmpwoymt.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

// Client pour les opérations côté client (anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client pour les opérations admin (service role key)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

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
  supabase,
  supabaseAdmin,
  query,
  adminQuery,
};


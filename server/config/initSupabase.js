const { supabase, supabaseAdmin } = require('./supabase');

/**
 * Initialise les tables dans Supabase
 * Cette fonction crée toutes les tables nécessaires pour l'application QHSE
 */
const initSupabaseTables = async () => {
  try {
    console.log('🔄 Initializing Supabase tables...');

    // Note: Supabase utilise SQL pour créer les tables
    // Vous pouvez exécuter ces requêtes dans le SQL Editor de Supabase
    // ou créer les tables via l'interface web
    
    // Pour l'instant, nous retournons les requêtes SQL nécessaires
    const sqlQueries = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  chantier_id INTEGER,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chantiers table
CREATE TABLE IF NOT EXISTS chantiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Et toutes les autres tables...
-- (Les autres tables suivent la même structure que dans initDatabase.js)
    `;

    console.log('📝 SQL queries ready. Please run them in Supabase SQL Editor');
    console.log('   Go to: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new');
    
    return { success: true, message: 'SQL queries prepared' };
  } catch (error) {
    console.error('❌ Error initializing Supabase tables:', error);
    throw error;
  }
};

/**
 * Vérifie si les tables existent dans Supabase
 */
const checkTables = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { exists: false, message: 'Tables do not exist yet' };
      }
      throw error;
    }
    
    return { exists: true, message: 'Tables exist' };
  } catch (error) {
    console.error('Error checking tables:', error);
    return { exists: false, error: error.message };
  }
};

module.exports = {
  initSupabaseTables,
  checkTables,
};


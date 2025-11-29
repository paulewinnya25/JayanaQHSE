// Helper pour convertir les requêtes SQL en requêtes Supabase
const { getSupabase, getDatabaseType } = require('./database');

/**
 * Exécute une requête et retourne un format compatible avec pool.query()
 * @param {string} sql - Requête SQL (ignorée pour Supabase)
 * @param {Array} params - Paramètres (non utilisés pour Supabase)
 * @returns {Promise<{rows: Array, rowCount: number}>}
 */
const executeQuery = async (sql, params = []) => {
  const dbType = getDatabaseType();
  
  if (dbType === 'supabase') {
    // Pour Supabase, on ne peut pas exécuter du SQL arbitraire
    // Cette fonction est un placeholder
    console.warn('⚠️ executeQuery called with Supabase - SQL queries not supported');
    console.warn('⚠️ SQL:', sql.substring(0, 100));
    throw new Error('Direct SQL queries are not supported with Supabase. Please use Supabase client methods or create database views.');
  } else {
    // PostgreSQL fallback
    const { getPool } = require('./database');
    const pool = getPool();
    if (!pool) {
      throw new Error('PostgreSQL pool not available');
    }
    return await pool.query(sql, params);
  }
};

/**
 * Helper pour les requêtes Supabase simples (SELECT sans JOIN)
 */
const supabaseQuery = async (table, options = {}) => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  
  let query = supabase.from(table).select(options.select || '*');
  
  // Appliquer les filtres
  if (options.where) {
    Object.entries(options.where).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });
  }
  
  // Appliquer l'ordre
  if (options.orderBy) {
    query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending !== false });
  }
  
  // Limite
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return {
    rows: data || [],
    rowCount: data?.length || 0
  };
};

module.exports = {
  executeQuery,
  supabaseQuery
};


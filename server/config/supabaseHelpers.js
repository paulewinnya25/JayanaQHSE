// Helpers pour faciliter l'utilisation de Supabase dans les routes
const { getSupabase, getDatabaseType } = require('./database');

/**
 * Récupère des données avec des relations (JOINs simulés)
 * @param {string} table - Nom de la table principale
 * @param {Object} options - Options de requête
 * @returns {Promise<Array>} - Données avec relations incluses
 */
const fetchWithRelations = async (table, options = {}) => {
  const dbType = getDatabaseType();
  
  if (dbType !== 'supabase') {
    // Fallback PostgreSQL - utiliser pool.query directement
    const { getPool } = require('./database');
    const pool = getPool();
    if (options.sql) {
      return await pool.query(options.sql, options.params || []);
    }
    throw new Error('PostgreSQL mode requires SQL query');
  }
  
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  
  // Construire la requête Supabase
  let query = supabase.from(table).select(options.select || '*');
  
  // Appliquer les filtres
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query = query.eq(key, value);
      }
    });
  }
  
  // Appliquer l'ordre
  if (options.orderBy) {
    const orderBy = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
    orderBy.forEach(({ column, ascending = false }) => {
      query = query.order(column, { ascending });
    });
  }
  
  // Limite
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`❌ Supabase query error for table ${table}:`, error);
    throw error;
  }
  
  // Si des relations sont demandées, les récupérer séparément
  if (options.relations && data) {
    const relationsData = await fetchRelations(data, options.relations, supabase);
    return combineRelations(data, relationsData, options.relations);
  }
  
  return data || [];
};

/**
 * Récupère les données des relations
 */
const fetchRelations = async (mainData, relations, supabase) => {
  const relationsData = {};
  
  for (const relation of relations) {
    const { table, foreignKey, localKey, fields = ['*'] } = relation;
    
    // Récupérer les IDs uniques
    const ids = [...new Set(mainData.map(item => item[localKey]).filter(Boolean))];
    
    if (ids.length === 0) continue;
    
    // Récupérer les données de la relation
    const { data, error } = await supabase
      .from(table)
      .select(fields.join(','))
      .in(foreignKey, ids);
    
    if (error) {
      console.error(`❌ Error fetching relation ${table}:`, error);
      continue;
    }
    
    // Créer un map pour accès rapide
    relationsData[table] = {};
    (data || []).forEach(item => {
      relationsData[table][item[foreignKey]] = item;
    });
  }
  
  return relationsData;
};

/**
 * Combine les données principales avec les relations
 */
const combineRelations = (mainData, relationsData, relations) => {
  return mainData.map(item => {
    const combined = { ...item };
    
    relations.forEach(relation => {
      const { table, localKey, alias } = relation;
      const relatedData = relationsData[table]?.[item[localKey]];
      
      if (relatedData) {
        if (alias) {
          // Si un alias est spécifié, créer un champ avec ce nom
          combined[alias] = relatedData;
        } else {
          // Sinon, fusionner les champs directement
          Object.assign(combined, relatedData);
        }
      }
    });
    
    return combined;
  });
};

/**
 * Helper pour créer un nom complet (first_name + last_name)
 */
const formatFullName = (user) => {
  if (!user) return null;
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
};

module.exports = {
  fetchWithRelations,
  formatFullName
};


# ✅ Routes Adaptées pour Supabase

## Routes complètement adaptées

- ✅ `server/routes/risks.js` - Toutes les opérations CRUD
- ✅ `server/routes/incidents.js` - Toutes les opérations CRUD
- ✅ `server/routes/inspections.js` - Toutes les opérations CRUD
- ✅ `server/routes/nonConformities.js` - Toutes les opérations CRUD
- ✅ `server/routes/environment.js` - Toutes les opérations CRUD

## Routes à adapter (en cours)

- ⏳ `server/routes/trainings.js` - Nécessite adaptation pour COUNT et JOINs
- ⏳ `server/routes/maintenance.js` - Nécessite adaptation pour sous-requêtes
- ⏳ `server/routes/contractors.js` - Simple, à adapter
- ⏳ `server/routes/documents.js` - Nécessite adaptation pour JOINs
- ⏳ `server/routes/reports.js` - Nécessite adaptation pour agrégations
- ⏳ `server/routes/dashboard.js` - Nécessite adaptation pour agrégations complexes

## Pattern utilisé

Toutes les routes suivent maintenant ce pattern :

```javascript
const dbType = getDatabaseType();

if (dbType === 'supabase') {
  // Utiliser Supabase client
  const supabase = getSupabase();
  // ... requêtes Supabase
} else {
  // PostgreSQL fallback
  const pool = getPool();
  // ... requêtes SQL
}
```

## Helpers créés

- `server/config/supabaseHelpers.js` - Fonctions utilitaires pour Supabase
- `formatFullName(user)` - Formate le nom complet d'un utilisateur

## Notes importantes

1. Les JOINs sont gérés en faisant des requêtes séparées puis en combinant les résultats
2. Les agrégations (COUNT, SUM, etc.) sont calculées côté application pour Supabase
3. Les dates sont converties en ISO string pour Supabase
4. Les erreurs sont mieux gérées avec des messages explicites


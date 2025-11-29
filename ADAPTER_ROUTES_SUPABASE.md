# 🔧 Adapter les Routes pour Supabase

## ❌ Problème actuel

Les routes utilisent `pool.query()` (API PostgreSQL) mais Supabase ne supporte pas les requêtes SQL directes de cette manière. Les routes doivent être adaptées pour utiliser les méthodes Supabase.

## 📋 Routes à adapter

Toutes ces routes utilisent `pool.query()` et doivent être adaptées :

- `server/routes/risks.js`
- `server/routes/incidents.js`
- `server/routes/inspections.js`
- `server/routes/trainings.js`
- `server/routes/nonConformities.js`
- `server/routes/environment.js`
- `server/routes/maintenance.js`
- `server/routes/contractors.js`
- `server/routes/documents.js`
- `server/routes/reports.js`
- `server/routes/dashboard.js`

## ✅ Solution temporaire

Un wrapper a été créé dans `server/config/database.js` qui retourne une erreur explicite si une route essaie d'utiliser `pool.query()` avec Supabase.

## 🎯 Solution à long terme

Chaque route doit être adaptée pour utiliser Supabase au lieu de SQL direct :

### Exemple : Avant (PostgreSQL)
```javascript
const result = await pool.query('SELECT * FROM risks WHERE id = $1', [id]);
```

### Exemple : Après (Supabase)
```javascript
const supabase = getSupabase();
const { data, error } = await supabase
  .from('risks')
  .select('*')
  .eq('id', id)
  .single();
```

## 📝 Prochaines étapes

1. Adapter chaque route pour utiliser Supabase
2. Tester chaque route individuellement
3. Vérifier que les requêtes complexes (JOIN) fonctionnent avec Supabase

---

**Note :** Pour l'instant, les routes retournent une erreur 500 avec un message explicite indiquant que la route doit être adaptée.


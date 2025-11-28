# ❌ Problème : Serveur Utilise PostgreSQL au Lieu de Supabase

## 🔍 Diagnostic

Le serveur répond avec :
```json
{"status":"OK","message":"Jayana qhse API is running","database":"postgresql"}
```

**Cela signifie que le serveur utilise PostgreSQL au lieu de Supabase !**

---

## 🔧 Solution : Vérifier les Variables d'Environnement dans Railway

### Dans Railway :

1. **Service** `jayana-qhse-server` → **Onglet "Variables"**

2. **Vérifiez que ces variables existent EXACTEMENT :**

   - **`USE_SUPABASE`** = `true` (sans guillemets)
   - **`SUPABASE_URL`** = `https://oerdkjgkmalphmpwoymt.supabase.co`
   - **`SUPABASE_ANON_KEY`** = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (la longue clé)

3. **⚠️ IMPORTANT :**
   - Les valeurs ne doivent PAS avoir de guillemets (`"true"` est incorrect, utilisez `true`)
   - Pas d'espaces avant/après
   - Les 3 variables doivent être présentes

---

## 🔄 Après Vérification

1. **Attendez 1-2 minutes** que Railway redéploie

2. **Vérifiez les logs Railway au démarrage**, vous devriez voir :
   - `🔍 Environment check:`
   - `  USE_SUPABASE: true`
   - `  SUPABASE_URL: SET`
   - `  SUPABASE_ANON_KEY: SET`
   - `✅ Using Supabase database`

3. **Testez `/api/health` à nouveau**, vous devriez voir :
   ```json
   {"status":"OK","message":"Jayana qhse API is running","database":"supabase"}
   ```

---

## 🆘 Si les Variables Sont Correctes mais Ça ne Fonctionne Pas

**Vérifiez dans Railway Settings :**

1. **Onglet "Settings"** → Section **"Variables"**
2. **Vérifiez que les variables sont bien dans le bon service** (pas dans un autre service)
3. **Essayez de supprimer et recréer** la variable `USE_SUPABASE` avec exactement `true` (sans guillemets)

---

## 📋 Checklist

- [ ] Variable `USE_SUPABASE` = `true` (sans guillemets) dans Railway
- [ ] Variable `SUPABASE_URL` = `https://oerdkjgkmalphmpwoymt.supabase.co`
- [ ] Variable `SUPABASE_ANON_KEY` = (la clé complète)
- [ ] Railway redéploie après modification des variables
- [ ] Les logs montrent `✅ Using Supabase database`
- [ ] `/api/health` retourne `"database":"supabase"`

---

**Vérifiez les variables dans Railway et attendez le redéploiement !** 🔧



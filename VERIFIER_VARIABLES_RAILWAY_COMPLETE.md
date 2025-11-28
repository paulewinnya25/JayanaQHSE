# 🔍 Vérifier Toutes les Variables dans Railway

## ⚠️ Problème Actuel

L'endpoint `/api/health` retourne `"database":"postgresql"` au lieu de `"database":"supabase"`.

Les logs montrent que Supabase est initialisé, mais le serveur utilise encore PostgreSQL.

---

## 🔍 Vérification dans Railway Variables

### Dans Railway → Onglet "Variables" :

**Vous voyez actuellement :**
- Seulement les variables système Railway (RAILWAY_*)

**Vous devez aussi voir :**
- Vos variables personnalisées (USE_SUPABASE, SUPABASE_URL, etc.)

---

## ✅ Ajouter les Variables Manquantes

Si vous ne voyez pas vos variables personnalisées :

1. **Cliquez sur "New Variable"** ou le bouton **"+"** en haut à droite

2. **Ajoutez chaque variable une par une :**

   **Variable 1 :**
   - Nom : `USE_SUPABASE`
   - Valeur : `true`
   - ⚠️ Pas de guillemets, juste `true`

   **Variable 2 :**
   - Nom : `SUPABASE_URL`
   - Valeur : `https://oerdkjgkmalphmpwoymt.supabase.co`

   **Variable 3 :**
   - Nom : `SUPABASE_ANON_KEY`
   - Valeur : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

   **Variable 4 :**
   - Nom : `JWT_SECRET`
   - Valeur : `jayana_qhse_jwt_secret_2024_super_secure_key_change_in_production`

   **Variable 5 :**
   - Nom : `JWT_EXPIRE`
   - Valeur : `7d`

   **Variable 6 :**
   - Nom : `PORT`
   - Valeur : `5000`

   **Variable 7 :**
   - Nom : `NODE_ENV`
   - Valeur : `production`

   **Variable 8 :**
   - Nom : `FRONTEND_URL`
   - Valeur : `https://jayanaqhseapp.netlify.app`

---

## 🔄 Après Ajout des Variables

1. **Railway redéploiera automatiquement**
2. **Attendez 1-2 minutes**
3. **Vérifiez les logs Railway** → Vous devriez voir :
   - `USE_SUPABASE: true`
   - `SUPABASE_URL: SET`
   - `✅ Using Supabase database`

4. **Testez `/api/health`** → Vous devriez voir :
   ```json
   {"status":"OK","database":"supabase",...}
   ```

---

## 📋 Checklist

- [ ] Variables personnalisées visibles dans Railway Variables
- [ ] `USE_SUPABASE` = `true` (sans guillemets)
- [ ] `SUPABASE_URL` configurée
- [ ] `SUPABASE_ANON_KEY` configurée
- [ ] Toutes les autres variables configurées
- [ ] Railway redéploie après modification
- [ ] `/api/health` retourne `"database":"supabase"`

---

**Ajoutez les variables personnalisées dans Railway Variables si elles n'y sont pas !** 🔑



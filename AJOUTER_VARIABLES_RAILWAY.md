# 🔑 Ajouter les Variables d'Environnement dans Railway

## ❌ Problème identifié

L'erreur `ECONNREFUSED ::1:5432` signifie que le serveur essaie de se connecter à PostgreSQL au lieu de Supabase, car les **variables d'environnement Supabase ne sont pas configurées** dans Railway.

---

## ✅ SOLUTION : Ajouter les Variables dans Railway

### Dans Railway → Onglet "Variables" :

1. **Cliquez sur "New Variable"** ou le bouton **"+"** en haut à droite

2. **Ajoutez chaque variable ci-dessous** une par une :

---

## 📋 Liste des Variables à Ajouter

### 1. Configuration Supabase

**Variable 1 :**
- **Nom :** `USE_SUPABASE`
- **Valeur :** `true`
- **Cliquez sur "Add"**

**Variable 2 :**
- **Nom :** `SUPABASE_URL`
- **Valeur :** `https://oerdkjgkmalphmpwoymt.supabase.co`
- **Cliquez sur "Add"**

**Variable 3 :**
- **Nom :** `SUPABASE_ANON_KEY`
- **Valeur :** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`
- **Cliquez sur "Add"**

---

### 2. Configuration JWT

**Variable 4 :**
- **Nom :** `JWT_SECRET`
- **Valeur :** `jayana_qhse_jwt_secret_2024_super_secure_key_change_in_production`
- **Cliquez sur "Add"**

**Variable 5 :**
- **Nom :** `JWT_EXPIRE`
- **Valeur :** `7d`
- **Cliquez sur "Add"**

---

### 3. Configuration Serveur

**Variable 6 :**
- **Nom :** `PORT`
- **Valeur :** `5000`
- **Cliquez sur "Add"**

**Variable 7 :**
- **Nom :** `NODE_ENV`
- **Valeur :** `production`
- **Cliquez sur "Add"**

---

### 4. Configuration Frontend (pour CORS)

**Variable 8 :**
- **Nom :** `FRONTEND_URL`
- **Valeur :** `https://jayanaqhse.netlify.app`
- (Remplacez par votre URL Netlify si différente)
- **Cliquez sur "Add"**

---

## 🔄 Après avoir ajouté toutes les variables

1. **Railway redéploiera automatiquement** votre service
2. **Attendez 1-2 minutes** pour le redéploiement
3. **Vérifiez les logs Railway** → Onglet "Logs"
   - Vous devriez voir : `✅ Using Supabase database`
   - Et : `✅ Supabase connected successfully`
   - Et : `🚀 Jayana qhse server running on port 5000`

---

## ✅ Vérification finale

Une fois le redéploiement terminé :

1. **Testez l'API :**
   ```
   https://jayana-qhse-server-production.up.railway.app/api/health
   ```

2. **Testez la connexion :**
   - Ouvrez votre site Netlify
   - Connectez-vous avec : `admin@qhse.com` / `admin123`

---

## 🎯 Résumé rapide

Ajoutez ces 8 variables dans Railway Variables :
1. `USE_SUPABASE=true`
2. `SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co`
3. `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (la longue clé)
4. `JWT_SECRET=jayana_qhse_jwt_secret_2024_super_secure_key_change_in_production`
5. `JWT_EXPIRE=7d`
6. `PORT=5000`
7. `NODE_ENV=production`
8. `FRONTEND_URL=https://jayanaqhse.netlify.app`

**Une fois toutes les variables ajoutées, Railway redéploiera et tout devrait fonctionner ! 🚀**


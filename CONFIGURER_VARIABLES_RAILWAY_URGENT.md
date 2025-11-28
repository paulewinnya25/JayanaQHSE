# 🚨 URGENT - Configurer les Variables Railway

## ❌ Problème Identifié

Les logs montrent que les variables d'environnement ne sont **PAS définies** dans Railway :

```
USE_SUPABASE : indéfini
SUPABASE_URL : NON RÉGLÉ
SUPABASE_ANON_KEY : NON RÉGLÉ
```

## ✅ Solution Immédiate

### Étape 1: Accéder aux Variables Railway

1. **Railway Dashboard** → https://railway.app
2. **Votre projet** → **Service backend**
3. **Onglet "Variables"** (en haut ou dans le menu latéral)

### Étape 2: Ajouter les Variables OBLIGATOIRES

**Ajoutez ces 5 variables (une par une) :**

#### Variable 1: USE_SUPABASE
- **Key:** `USE_SUPABASE`
- **Value:** `true` (sans guillemets, juste `true`)

#### Variable 2: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`

#### Variable 3: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

#### Variable 4: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** `votre_super_secret_jwt_key_change_in_production` (ou une clé secrète de votre choix)

#### Variable 5: JWT_EXPIRE
- **Key:** `JWT_EXPIRE`
- **Value:** `7d`

### Étape 3: Vérifier le Root Directory

1. **Railway Dashboard** → **Votre service** → **Settings**
2. **Root Directory** → Doit être : `server`
   - Si ce n'est pas `server`, changez-le

### Étape 4: Vérifier le Start Command

1. **Railway Dashboard** → **Votre service** → **Settings**
2. **Deploy** → **Start Command**
3. Doit être : `npm start` (ou laisser vide, Railway utilisera railway.json)

### Étape 5: Redéployer

1. Après avoir ajouté toutes les variables
2. **Railway redéploie automatiquement**
3. Attendez 1-2 minutes
4. Vérifiez les logs - vous devriez voir :
   ```
   ✅ Using Supabase database
   ✅ Supabase connected successfully
   ```

## 📋 Checklist Complète

- [ ] Variable `USE_SUPABASE=true` ajoutée
- [ ] Variable `SUPABASE_URL` ajoutée
- [ ] Variable `SUPABASE_ANON_KEY` ajoutée
- [ ] Variable `JWT_SECRET` ajoutée
- [ ] Variable `JWT_EXPIRE=7d` ajoutée
- [ ] Root Directory = `server` (dans Settings)
- [ ] Attendu le redéploiement Railway
- [ ] Vérifié les logs (pas d'erreur "NON RÉGLÉ")

## 🧪 Test Après Configuration

1. **Vérifiez les logs au démarrage :**
   ```
   USE_SUPABASE: true
   SUPABASE_URL: SET
   SUPABASE_ANON_KEY: SET
   ✅ Using Supabase database
   ✅ Supabase connected successfully
   ```

2. **Testez la connexion :**
   - Email: `admin@jayana.com`
   - Mot de passe: `admin123`

## ⚠️ Important

- **Root Directory** doit être `server` (pas la racine du projet)
- Toutes les variables doivent être ajoutées **sans guillemets**
- Railway redéploie automatiquement après chaque modification de variable



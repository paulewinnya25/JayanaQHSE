# 🎯 Configurer les Variables dans le Bon Service Railway

## 📍 Services Railway Identifiés

Vous avez **2 services** dans Railway :
1. **jayana-qhse-client** (Frontend - ne pas configurer ici)
2. **jayana-qhse-server** (Backend - ⚠️ **CONFIGUREZ ICI**)

## ✅ Où Configurer les Variables

### Service : `jayana-qhse-server`

**C'est dans CE service que vous devez ajouter les variables Supabase !**

## 📋 Étapes Détaillées

### 1. Accéder au Service Serveur

1. **Railway Dashboard** → https://railway.app
2. **Votre projet**
3. **Cliquez sur le service `jayana-qhse-server`** (pas le client !)
4. **Onglet "Variables"** (en haut ou dans le menu)

### 2. Ajouter les Variables

Dans le service **`jayana-qhse-server`**, ajoutez ces 5 variables :

#### Variable 1: USE_SUPABASE
- **Key:** `USE_SUPABASE`
- **Value:** `true` (sans guillemets)

#### Variable 2: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`

#### Variable 3: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

#### Variable 4: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** `votre_super_secret_jwt_key_change_in_production` (ou une clé de votre choix)

#### Variable 5: JWT_EXPIRE
- **Key:** `JWT_EXPIRE`
- **Value:** `7d`

### 3. Vérifier le Root Directory

Dans le service **`jayana-qhse-server`** :

1. **Settings** (ou Configuration)
2. **Root Directory** → Doit être : `server`
   - Si ce n'est pas `server`, changez-le en `server`

### 4. Vérifier le Start Command

Dans le service **`jayana-qhse-server`** :

1. **Settings** → **Deploy**
2. **Start Command** → Doit être : `npm start`
   - Ou laisser vide si vous utilisez `railway.json`

## ⚠️ Important

- **NE configurez PAS les variables dans `jayana-qhse-client`**
- **Configurez UNIQUEMENT dans `jayana-qhse-server`**
- Le service client n'a pas besoin de variables Supabase

## 🧪 Vérification

Après avoir ajouté les variables dans `jayana-qhse-server` :

1. **Attendez le redéploiement** (automatique, 1-2 minutes)
2. **Ouvrez les logs du service `jayana-qhse-server`**
3. **Vous devriez voir :**
   ```
   USE_SUPABASE: true
   SUPABASE_URL: SET
   SUPABASE_ANON_KEY: SET
   ✅ Using Supabase database
   ✅ Supabase connected successfully
   ```

## 📋 Checklist

- [ ] Service `jayana-qhse-server` sélectionné (pas le client)
- [ ] Variable `USE_SUPABASE=true` ajoutée
- [ ] Variable `SUPABASE_URL` ajoutée
- [ ] Variable `SUPABASE_ANON_KEY` ajoutée
- [ ] Variable `JWT_SECRET` ajoutée
- [ ] Variable `JWT_EXPIRE=7d` ajoutée
- [ ] Root Directory = `server` (dans Settings)
- [ ] Attendu le redéploiement
- [ ] Vérifié les logs (pas d'erreur "NON RÉGLÉ")

## 🎯 Résumé

**Service à configurer :** `jayana-qhse-server` ✅  
**Service à ignorer :** `jayana-qhse-client` ❌



# 🚀 Guide de Déploiement du Backend - Jayana QHSE

## 📋 Options de déploiement

Vous avez plusieurs options pour déployer votre backend. Voici les plus simples :

### Option 1: Railway (⭐ RECOMMANDÉ - Le plus simple)
### Option 2: Render (Gratuit avec limitations)
### Option 3: Heroku (Classique mais payant)
### Option 4: Vercel (Pour serverless)

---

## 🚂 Option 1: Déploiement sur Railway (RECOMMANDÉ)

### Avantages:
- ✅ Gratuit pour commencer
- ✅ Déploiement automatique depuis GitHub
- ✅ Configuration simple
- ✅ Support PostgreSQL intégré (optionnel si vous utilisez Supabase)

### Étapes:

1. **Créer un compte Railway:**
   - Allez sur: https://railway.app
   - Inscrivez-vous avec GitHub

2. **Créer un nouveau projet:**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repo `JayanaQHSE`

3. **Configurer le service:**
   - Railway détecte automatiquement le dossier `server/`
   - Si non, configurez:
     - **Root Directory:** `server`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

4. **Configurer les variables d'environnement:**
   
   Dans Railway, allez dans "Variables" et ajoutez:

   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=votre_secret_jwt_aleatoire_et_long
   JWT_EXPIRE=7d
   
   USE_SUPABASE=true
   SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
   
   FRONTEND_URL=https://votre-site.netlify.app
   ```

5. **Récupérer l'URL de déploiement:**
   - Railway génère automatiquement une URL
   - Allez dans "Settings" → "Domains"
   - Copiez l'URL (ex: `https://jayana-qhse-production.up.railway.app`)

6. **Configurer dans Netlify:**
   - Dans Netlify, ajoutez la variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://votre-url-railway.app/api`

✅ **Railway déploie automatiquement à chaque push sur GitHub !**

---

## 🎨 Option 2: Déploiement sur Render (GRATUIT)

### Avantages:
- ✅ Entièrement gratuit (avec limitations)
- ✅ Déploiement automatique
- ✅ SSL inclus

### Limitations:
- ⚠️ Le service "s'endort" après 15 min d'inactivité (réveil lent au premier appel)

### Étapes:

1. **Créer un compte Render:**
   - Allez sur: https://render.com
   - Inscrivez-vous avec GitHub

2. **Créer un nouveau Web Service:**
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repo GitHub
   - Sélectionnez le repo `JayanaQHSE`

3. **Configuration:**
   - **Name:** `jayana-qhse-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (gratuit)

4. **Variables d'environnement:**
   - Cliquez sur "Advanced" → "Environment Variables"
   - Ajoutez les mêmes variables que pour Railway

5. **Déployer:**
   - Cliquez sur "Create Web Service"
   - Render déploie automatiquement
   - L'URL sera: `https://jayana-qhse-api.onrender.com`

6. **Configurer dans Netlify:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://jayana-qhse-api.onrender.com/api`

---

## 🔮 Option 3: Déploiement sur Heroku

### Avantages:
- ✅ Très populaire et stable
- ✅ Bonne documentation

### Limitations:
- ⚠️ Payant (mais offre un plan gratuit limité)

### Étapes:

1. **Installer Heroku CLI:**
   ```bash
   # Windows: Téléchargez depuis https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Créer les fichiers nécessaires:**
   - Voir `Procfile` (déjà créé dans le repo)
   - Voir `server/Procfile`

3. **Se connecter à Heroku:**
   ```bash
   heroku login
   ```

4. **Créer l'application:**
   ```bash
   cd server
   heroku create jayana-qhse-api
   ```

5. **Configurer les variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set USE_SUPABASE=true
   heroku config:set SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
   # ... etc pour toutes les variables
   ```

6. **Déployer:**
   ```bash
   git push heroku main
   ```

---

## 📦 Préparation du déploiement

### Créer un Procfile pour Heroku

Le fichier `server/Procfile` sera créé automatiquement.

### Variables d'environnement nécessaires

Voici toutes les variables à configurer dans votre service de déploiement:

```env
# Configuration serveur
PORT=5000
NODE_ENV=production

# JWT Authentication
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
JWT_EXPIRE=7d

# Supabase (recommandé)
USE_SUPABASE=true
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Frontend URL (pour CORS)
FRONTEND_URL=https://votre-site.netlify.app
```

### Générer un JWT_SECRET sécurisé

Pour générer un secret JWT sécurisé, utilisez:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ou en ligne: https://generate-secret.vercel.app/64

---

## ✅ Vérification après déploiement

1. **Tester l'endpoint health:**
   ```
   https://votre-api-url.com/api/health
   ```
   
   Vous devriez voir:
   ```json
   {
     "status": "OK",
     "message": "Jayana qhse API is running",
     "database": "supabase"
   }
   ```

2. **Configurer dans Netlify:**
   - Ajoutez `REACT_APP_API_URL` avec l'URL de votre API
   - Redéployez le frontend

3. **Tester la connexion:**
   - Ouvrez votre site Netlify
   - Ouvrez la console (F12)
   - Vous devriez voir: `🔗 API URL configured: ...`
   - Essayez de vous connecter

---

## 🆘 Dépannage

### Le backend ne démarre pas

1. Vérifiez les logs dans votre service (Railway/Render/Heroku)
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Vérifiez que `USE_SUPABASE=true` si vous utilisez Supabase

### Erreur CORS

Dans `server/index.js`, assurez-vous que CORS accepte votre domaine Netlify:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://votre-site.netlify.app'
  ]
}));
```

Ou pour accepter toutes les origines (développement):

```javascript
app.use(cors());
```

### Les tables Supabase n'existent pas

Exécutez le script SQL dans Supabase SQL Editor:
- Fichier: `server/supabase-init.sql`
- Voir: `SUPABASE_SETUP.md`

---

## 📚 Ressources

- **Railway:** https://railway.app
- **Render:** https://render.com
- **Heroku:** https://heroku.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt

---

**Recommandation:** Commencez par **Railway** (le plus simple) ou **Render** (gratuit). Les deux fonctionnent très bien !


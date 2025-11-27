# 🚂 Déploiement Rapide sur Railway

## Guide en 5 minutes

### Étape 1: Créer le projet sur Railway

1. Allez sur: https://railway.app
2. Cliquez sur "Start a New Project"
3. Choisissez "Deploy from GitHub repo"
4. Autorisez Railway à accéder à votre GitHub
5. Sélectionnez le repo: `paulewinnya25/JayanaQHSE`

### Étape 2: Configurer le service

Railway détecte automatiquement Node.js. Si besoin, configurez:

- **Root Directory:** `server`
- Laissez Railway détecter automatiquement les commandes

### Étape 3: Ajouter les variables d'environnement

Dans Railway, cliquez sur votre service → "Variables" → "New Variable"

Ajoutez une par une:

```
PORT=5000
```

```
NODE_ENV=production
```

```
JWT_SECRET=votre_secret_jwt_long_et_aleatoire
```
*Générez un secret avec: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`*

```
JWT_EXPIRE=7d
```

```
USE_SUPABASE=true
```

```
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
```

```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
```

```
FRONTEND_URL=https://jayanaqhse.netlify.app
```
*Remplacez par votre URL Netlify réelle*

### Étape 4: Récupérer l'URL

1. Railway génère automatiquement une URL
2. Cliquez sur "Settings" → "Networking"
3. Copiez l'URL générée (ex: `https://jayana-qhse-production.up.railway.app`)
4. Railway déploie automatiquement !

### Étape 5: Configurer dans Netlify

1. Allez sur Netlify Dashboard
2. Site configuration → Environment variables
3. Ajoutez:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://votre-url-railway.app/api`
   - *(Ajoutez `/api` à la fin de l'URL Railway)*

4. Redéployez sur Netlify

### Étape 6: Tester

1. Ouvrez: `https://votre-url-railway.app/api/health`
2. Vous devriez voir:
   ```json
   {
     "status": "OK",
     "message": "Jayana qhse API is running",
     "database": "supabase"
   }
   ```

3. Testez votre site Netlify - la connexion devrait fonctionner !

## ✅ C'est tout !

Railway déploie automatiquement à chaque push sur GitHub.

**Votre backend est maintenant déployé ! 🎉**


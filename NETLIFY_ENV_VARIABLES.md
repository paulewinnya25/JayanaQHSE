# Variables d'environnement pour Netlify

## 📋 Variables nécessaires pour le déploiement sur Netlify

### Variables pour le Frontend (React)

Ces variables sont accessibles dans l'application React. Elles doivent commencer par `REACT_APP_` :

```
REACT_APP_API_URL=https://votre-api-backend.herokuapp.com/api
```

ou si vous déployez aussi le backend sur Netlify :

```
REACT_APP_API_URL=https://votre-projet-backend.netlify.app/api
```

### Variables pour le Backend (si déployé sur Netlify Functions)

Si vous utilisez Netlify Functions pour le backend, configurez ces variables :

#### Configuration Supabase
```
USE_SUPABASE=true
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

#### Configuration JWT
```
JWT_SECRET=votre_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

#### Configuration Email (optionnel)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Autres
```
NODE_ENV=production
PORT=8888
FRONTEND_URL=https://votre-projet.netlify.app
```

## 🚀 Configuration rapide dans Netlify

### Étape 1: Accéder aux variables d'environnement

1. Allez sur votre projet dans Netlify Dashboard
2. Cliquez sur **Site configuration** → **Environment variables**
3. Cliquez sur **Add environment variable**

### Étape 2: Ajouter les variables essentielles

#### Pour le Frontend uniquement :

**Variable 1:**
- **Key:** `REACT_APP_API_URL`
- **Value:** L'URL de votre API backend (ex: `https://votre-backend.herokuapp.com/api`)

#### Si vous utilisez Supabase :

**Variable 2:**
- **Key:** `REACT_APP_SUPABASE_URL`
- **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`

**Variable 3:**
- **Key:** `REACT_APP_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

## 📝 Configuration recommandée

### Pour un déploiement standard (Frontend React sur Netlify + Backend séparé)

Ajoutez ces variables dans Netlify :

```
REACT_APP_API_URL=https://votre-backend-url.com/api
```

### Pour un déploiement complet sur Netlify (Frontend + Backend via Functions)

Ajoutez toutes les variables ci-dessus.

## ⚙️ Configuration du fichier netlify.toml

Créez un fichier `netlify.toml` à la racine du projet :

```toml
[build]
  command = "cd client && npm install && npm run build"
  publish = "client/build"

[[plugins]]
  package = "@netlify/plugin-lighthouse"

[build.environment]
  NODE_VERSION = "18"

# Pour les fonctions Netlify (si vous utilisez le backend)
[functions]
  directory = "server/functions"
  node_bundler = "esbuild"
```

## 🔐 Variables sensibles

⚠️ **Important:** Les variables sensibles comme `JWT_SECRET` et `SUPABASE_SERVICE_ROLE_KEY` doivent être marquées comme **sensitive** dans Netlify.

Dans l'interface Netlify, cochez l'option **"Sensitive variable"** pour ces variables.

## ✅ Vérification

Après avoir ajouté les variables :

1. Déclenchez un nouveau déploiement
2. Vérifiez que l'application se connecte correctement à l'API
3. Testez l'authentification et les fonctionnalités

## 📚 Ressources

- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)


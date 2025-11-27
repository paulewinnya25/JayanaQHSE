# 🚀 Guide de Configuration Netlify pour Jayana QHSE

## Variables d'environnement à configurer dans Netlify

### 📋 Variables essentielles

#### 1. URL de l'API Backend (OBLIGATOIRE)

**Key:** `REACT_APP_API_URL`

**Value:** L'URL de votre API backend déployée

Exemples :
- Si votre backend est sur Heroku: `https://jayana-qhse-api.herokuapp.com/api`
- Si votre backend est sur Railway: `https://jayana-qhse-api.railway.app/api`
- Si votre backend est sur Render: `https://jayana-qhse-api.onrender.com/api`
- Si vous utilisez un autre service, utilisez l'URL complète avec `/api` à la fin

**Comment ajouter:**
1. Dans Netlify Dashboard → Site configuration → Environment variables
2. Cliquez sur "Add environment variable"
3. Key: `REACT_APP_API_URL`
4. Value: Votre URL d'API
5. Cliquez sur "Save"

---

### 🔧 Variables Supabase (si vous utilisez Supabase)

#### 2. URL Supabase

**Key:** `REACT_APP_SUPABASE_URL`

**Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`

#### 3. Clé Supabase Anon

**Key:** `REACT_APP_SUPABASE_ANON_KEY`

**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

---

## 📝 Liste complète des variables à ajouter

Copiez-collez ces variables dans Netlify :

### Configuration minimale (obligatoire)

```
REACT_APP_API_URL=https://votre-backend-url.com/api
```

### Configuration avec Supabase (optionnel)

```
REACT_APP_API_URL=https://votre-backend-url.com/api
REACT_APP_SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
```

---

## 🎯 Instructions pas à pas

### Étape 1: Accéder aux variables d'environnement

1. Connectez-vous à votre compte Netlify
2. Sélectionnez votre site "jayanaqhse"
3. Allez dans **Site configuration** (ou **Site settings**)
4. Cliquez sur **Environment variables** dans le menu de gauche

### Étape 2: Ajouter la variable API_URL

1. Cliquez sur le bouton **"Add environment variable"** ou **"Add a variable"**
2. Dans le champ **Key**, tapez: `REACT_APP_API_URL`
3. Dans le champ **Value**, tapez: L'URL de votre API backend (ex: `https://votre-api.herokuapp.com/api`)
4. **Important:** Laissez "All scopes" sélectionné (ou sélectionnez "Production" et "Deploy previews")
5. Cliquez sur **"Save"**

### Étape 3: Ajouter les variables Supabase (optionnel)

Si vous utilisez Supabase, ajoutez également:

1. Cliquez sur **"Add environment variable"** à nouveau
2. **Key:** `REACT_APP_SUPABASE_URL`
   **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`
   Cliquez sur **"Save"**

3. Cliquez sur **"Add environment variable"** encore une fois
4. **Key:** `REACT_APP_SUPABASE_ANON_KEY`
   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`
   Cliquez sur **"Save"**

### Étape 4: Redéployer

1. Après avoir ajouté toutes les variables, allez dans **Deploys**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Ou faites un commit/push sur GitHub pour déclencher un déploiement automatique

---

## 🔍 Vérification

### Vérifier que les variables sont bien configurées

1. Après le déploiement, ouvrez votre site Netlify
2. Ouvrez la console du navigateur (F12)
3. Dans la console, tapez: `console.log(process.env.REACT_APP_API_URL)`
4. Vous devriez voir votre URL d'API

### Vérifier la connexion à l'API

1. Essayez de vous connecter sur l'application
2. Si cela ne fonctionne pas, vérifiez:
   - Que l'URL de l'API est correcte
   - Que votre backend est bien déployé et accessible
   - Que le CORS est configuré sur votre backend pour accepter les requêtes de Netlify

---

## ⚙️ Configuration du build

Le fichier `netlify.toml` a été créé à la racine du projet avec la configuration suivante:

- **Base directory:** `client` (dossier React)
- **Build command:** `npm install && npm run build`
- **Publish directory:** `build`
- **Node version:** 18

---

## 🆘 Dépannage

### L'application ne se connecte pas à l'API

**Problème:** Erreur CORS ou "Network Error"

**Solution:**
1. Vérifiez que `REACT_APP_API_URL` est bien configurée
2. Vérifiez que votre backend accepte les requêtes depuis votre domaine Netlify
3. Configurez CORS sur votre backend pour autoriser: `https://votre-site.netlify.app`

### Les variables d'environnement ne sont pas chargées

**Problème:** `process.env.REACT_APP_API_URL` est `undefined`

**Solution:**
1. Vérifiez que les variables commencent bien par `REACT_APP_`
2. Redéployez le site après avoir ajouté les variables
3. Vérifiez que vous n'avez pas de fautes de frappe dans les noms des variables

### L'application ne se build pas

**Problème:** Erreur lors du build

**Solution:**
1. Vérifiez les logs de build dans Netlify
2. Assurez-vous que toutes les dépendances sont dans `package.json`
3. Vérifiez que la version de Node.js est compatible

---

## 📚 Ressources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## ✅ Checklist de déploiement

- [ ] Variable `REACT_APP_API_URL` ajoutée avec l'URL de votre backend
- [ ] Variables Supabase ajoutées (si vous utilisez Supabase)
- [ ] Fichier `netlify.toml` présent à la racine
- [ ] Backend déployé et accessible
- [ ] CORS configuré sur le backend
- [ ] Déploiement effectué après ajout des variables
- [ ] Application testée et fonctionnelle

---

**Une fois ces variables configurées, votre application sera prête à être déployée sur Netlify ! 🎉**


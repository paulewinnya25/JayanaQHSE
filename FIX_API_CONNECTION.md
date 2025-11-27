# 🔧 Solution à l'erreur ERR_NAME_NOT_RESOLVED

## ❌ Problème

L'erreur `ERR_NAME_NOT_RESOLVED` signifie que l'application ne peut pas trouver/connecter l'URL de l'API backend.

## ✅ Solutions

### Solution 1: Vérifier que REACT_APP_API_URL est définie dans Netlify

1. **Allez sur Netlify Dashboard:**
   - Ouvrez votre site
   - Allez dans **Site configuration** → **Environment variables**

2. **Vérifiez que cette variable existe:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** L'URL de votre API backend (ex: `https://votre-api.herokuapp.com/api`)

3. **Si elle n'existe pas, ajoutez-la:**
   - Cliquez sur "Add environment variable"
   - Key: `REACT_APP_API_URL`
   - Value: Votre URL d'API complète (avec `/api` à la fin)

4. **Redéployez:**
   - Après avoir ajouté/modifié la variable, déclenchez un nouveau déploiement

### Solution 2: Vérifier que votre backend est déployé et accessible

1. **Testez l'URL de votre API:**
   - Ouvrez votre navigateur
   - Allez sur: `https://votre-api-url.com/api/health`
   - Vous devriez voir une réponse JSON

2. **Si l'API n'est pas accessible:**
   - Vérifiez que votre backend est bien déployé
   - Vérifiez que le service est actif (Heroku, Railway, Render, etc.)
   - Vérifiez les logs de votre backend pour voir s'il y a des erreurs

### Solution 3: Format correct de l'URL

L'URL doit être au format:
```
https://votre-domaine.com/api
```

**Exemples valides:**
- ✅ `https://jayana-qhse-api.herokuapp.com/api`
- ✅ `https://jayana-api.railway.app/api`
- ✅ `https://jayana-api.onrender.com/api`
- ✅ `http://localhost:5000/api` (pour le développement local)

**Exemples invalides:**
- ❌ `https://votre-api.com` (manque `/api`)
- ❌ `votre-api.com/api` (manque `https://`)
- ❌ `https://votre-api.com/api/` (slash en trop à la fin - optionnel mais peut causer des problèmes)

### Solution 4: Vérifier les CORS sur le backend

Si votre backend est déployé mais que vous avez des erreurs CORS:

Dans `server/index.js`, vérifiez que CORS est configuré pour accepter les requêtes de Netlify:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://votre-site.netlify.app',
    'https://jayanaqhse.netlify.app' // Votre domaine Netlify
  ],
  credentials: true
}));
```

Ou pour accepter toutes les origines (développement uniquement):

```javascript
app.use(cors());
```

## 🔍 Vérification étape par étape

### 1. Vérifier la variable d'environnement dans Netlify

Dans la console du navigateur (F12), après le chargement de l'app:

```javascript
console.log(process.env.REACT_APP_API_URL);
```

Vous devriez voir votre URL d'API. Si c'est `undefined`, la variable n'est pas configurée.

### 2. Vérifier l'URL utilisée par axios

Dans la console, vous verrez maintenant:
```
🔗 API URL configured: https://votre-api-url.com/api
```

### 3. Tester la connexion à l'API

Ouvrez la console du navigateur et testez:

```javascript
fetch('https://votre-api-url.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Si cela échoue, votre backend n'est pas accessible.

## 📝 Checklist de dépannage

- [ ] Variable `REACT_APP_API_URL` définie dans Netlify
- [ ] L'URL commence par `https://` (ou `http://` pour local)
- [ ] L'URL se termine par `/api`
- [ ] Backend déployé et accessible
- [ ] Endpoint `/api/health` répond correctement
- [ ] CORS configuré sur le backend pour accepter Netlify
- [ ] Redéploiement effectué après modification des variables

## 🚀 Déploiement du backend (si pas encore fait)

Si votre backend n'est pas encore déployé, vous pouvez le déployer sur:

1. **Heroku:**
   ```bash
   heroku create jayana-qhse-api
   git push heroku main
   ```

2. **Railway:**
   - Connectez votre repo GitHub
   - Sélectionnez le dossier `server/`
   - Railway déploie automatiquement

3. **Render:**
   - Créez un nouveau "Web Service"
   - Connectez votre repo
   - Root Directory: `server/`
   - Build Command: `npm install`
   - Start Command: `npm start`

Une fois déployé, utilisez l'URL fournie par le service comme valeur de `REACT_APP_API_URL`.

## 🆘 Si le problème persiste

1. Vérifiez les logs de build Netlify pour voir si les variables sont chargées
2. Vérifiez les logs de votre backend pour voir les requêtes reçues
3. Vérifiez la console du navigateur pour les erreurs détaillées


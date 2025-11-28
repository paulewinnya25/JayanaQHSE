# 🔍 Diagnostic Erreur Serveur sur Netlify

## ❌ Problème
L'application fonctionne en local mais affiche "erreur serveur" lors de la connexion sur Netlify.

## 🔎 Étapes de Diagnostic

### Étape 1: Vérifier la Console du Navigateur

1. **Ouvrez votre site Netlify**
2. **Ouvrez la Console du navigateur** (F12 → Console)
3. **Cherchez ces messages :**
   - `🔗 API URL configured: ...` - Quelle URL est affichée ?
   - `❌ Erreur de connexion à l'API: ...` - Quelle est l'erreur exacte ?

### Étape 2: Vérifier les Variables d'Environnement Netlify

1. **Allez sur Netlify Dashboard**
2. **Site configuration** → **Environment variables**
3. **Vérifiez que cette variable existe :**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** L'URL de votre backend (ex: `https://votre-backend.railway.app/api`)

### Étape 3: Vérifier que le Backend est Accessible

**Testez l'URL de votre backend directement dans le navigateur :**

```
https://votre-backend-url.com/api/health
```

**Vous devriez voir :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase"
}
```

**Si vous voyez une erreur :**
- ❌ Le backend n'est pas déployé ou n'est pas accessible
- ❌ L'URL est incorrecte

### Étape 4: Vérifier les CORS

Le backend doit accepter les requêtes depuis votre domaine Netlify. Vérifiez dans `server/index.js` que votre domaine Netlify est dans la liste CORS.

## ✅ Solutions

### Solution 1: Ajouter/Corriger REACT_APP_API_URL dans Netlify

1. **Dans Netlify Dashboard :**
   - Site configuration → Environment variables
   - Cliquez sur "Add environment variable" (ou modifiez l'existante)

2. **Ajoutez :**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://votre-backend-url.com/api`
     - ⚠️ **IMPORTANT:** Remplacez `votre-backend-url.com` par l'URL réelle de votre backend
     - ⚠️ **IMPORTANT:** Ajoutez `/api` à la fin de l'URL

3. **Exemples d'URLs correctes :**
   - Railway: `https://jayana-qhse-production.up.railway.app/api`
   - Render: `https://jayana-api.onrender.com/api`
   - Heroku: `https://jayana-qhse-api.herokuapp.com/api`

4. **Redéployez :**
   - Après avoir ajouté/modifié la variable, allez dans **Deploys**
   - Cliquez sur **"Trigger deploy"** → **"Deploy site"**

### Solution 2: Vérifier que le Backend est Déployé

1. **Testez l'endpoint health :**
   ```
   https://votre-backend-url.com/api/health
   ```

2. **Si ça ne fonctionne pas :**
   - Vérifiez que le backend est bien déployé
   - Vérifiez les logs du backend (Railway, Render, etc.)
   - Vérifiez que le backend est actif et en cours d'exécution

### Solution 3: Vérifier les CORS

Si votre backend est sur Railway/Render/Heroku, vérifiez que votre domaine Netlify est autorisé dans les CORS.

**Dans `server/index.js`, la configuration CORS devrait inclure :**
```javascript
origin: [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://jayanaqhse.netlify.app',
  /\.netlify\.app$/ // Tous les sous-domaines Netlify
]
```

## 🧪 Test Rapide

### Test 1: Vérifier l'URL dans la Console

1. Ouvrez votre site Netlify
2. Ouvrez la console (F12)
3. Cherchez : `🔗 API URL configured:`
4. **Si vous voyez `http://localhost:5000/api` :**
   - ❌ La variable `REACT_APP_API_URL` n'est pas configurée dans Netlify
   - ✅ Solution: Ajoutez la variable dans Netlify et redéployez

### Test 2: Tester l'API Directement

Ouvrez dans votre navigateur :
```
https://votre-backend-url.com/api/health
```

**Si ça fonctionne :** Le backend est OK, le problème vient de la configuration Netlify
**Si ça ne fonctionne pas :** Le backend a un problème

## 📋 Checklist

- [ ] Variable `REACT_APP_API_URL` configurée dans Netlify
- [ ] URL du backend correcte (avec `/api` à la fin)
- [ ] Backend accessible (test `/api/health`)
- [ ] Site Netlify redéployé après modification des variables
- [ ] Console du navigateur vérifiée pour les erreurs

## 🆘 Si le Problème Persiste

1. **Vérifiez les logs Netlify :**
   - Netlify Dashboard → Deploys → Cliquez sur le dernier déploiement → View build log

2. **Vérifiez les logs du Backend :**
   - Railway/Render/Heroku Dashboard → Logs

3. **Vérifiez la console du navigateur :**
   - Ouvrez F12 → Console
   - Copiez les erreurs exactes

4. **Testez avec curl ou Postman :**
   ```bash
   curl https://votre-backend-url.com/api/health
   ```


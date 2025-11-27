# 🚨 CORRECTION URGENTE - Configuration de l'URL de l'API

## ❌ Problème actuel

Votre application essaie de se connecter à: `https://votre-backend-url.com/api`

Cette URL est **une valeur d'exemple** et n'existe pas vraiment !

---

## ✅ Solution en 2 étapes

### Étape 1: Déployer le backend (OBLIGATOIRE)

Vous devez d'abord déployer votre backend pour obtenir une vraie URL.

**Option rapide - Railway (recommandé):**

1. Allez sur: https://railway.app
2. Créez un compte avec GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Sélectionnez votre repo `JayanaQHSE`
5. Configurez:
   - **Root Directory:** `server`
6. Ajoutez les variables d'environnement (voir `RAILWAY_QUICKSTART.md`)
7. Railway génère automatiquement une URL (ex: `https://jayana-qhse-production.up.railway.app`)
8. **COPIEZ CETTE URL !** Vous en aurez besoin pour l'étape 2

📚 **Guide détaillé:** Voir `DEPLOY_BACKEND.md` ou `RAILWAY_QUICKSTART.md`

---

### Étape 2: Configurer l'URL dans Netlify

Une fois votre backend déployé:

1. **Allez sur Netlify Dashboard:**
   - Ouvrez votre site
   - Allez dans **Site configuration** → **Environment variables**

2. **Modifiez ou ajoutez la variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** L'URL réelle de votre backend + `/api`
   
   **Exemples:**
   - Si Railway: `https://jayana-qhse-production.up.railway.app/api`
   - Si Render: `https://jayana-qhse-api.onrender.com/api`
   - Si Heroku: `https://jayana-qhse-api.herokuapp.com/api`

3. **IMPORTANT:** 
   - L'URL doit se terminer par `/api`
   - L'URL doit commencer par `https://` (pas `http://`)

4. **Redéployez:**
   - Après avoir modifié la variable, déclenchez un nouveau déploiement
   - Allez dans **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🔍 Vérification

Après le redéploiement:

1. Ouvrez votre site Netlify
2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir:
   ```
   🔗 API URL configured: https://votre-vraie-url.com/api
   ```

4. Testez la connexion:
   - Essayez de vous connecter avec `admin@qhse.com` / `admin123`
   - Si ça fonctionne, c'est bon ! ✅

---

## ⚠️ Si vous n'avez pas encore déployé le backend

**Vous DEVEZ déployer le backend avant que l'application ne fonctionne !**

Suivez ce guide: `RAILWAY_QUICKSTART.md` (5 minutes)

Ou voir: `DEPLOY_BACKEND.md` pour d'autres options

---

## 📝 Checklist

- [ ] Backend déployé sur Railway/Render/Heroku
- [ ] URL du backend récupérée (ex: `https://xxx.railway.app`)
- [ ] Variable `REACT_APP_API_URL` configurée dans Netlify avec l'URL réelle + `/api`
- [ ] Site redéployé sur Netlify
- [ ] Console du navigateur affiche la bonne URL
- [ ] Connexion fonctionne

---

**Une fois ces 2 étapes terminées, votre application fonctionnera ! 🎉**


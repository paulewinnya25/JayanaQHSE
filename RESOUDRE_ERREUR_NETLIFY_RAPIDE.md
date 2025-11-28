# 🚀 Résolution Rapide - Erreur Serveur sur Netlify

## ⚡ Solution en 3 Étapes

### Étape 1: Vérifier l'URL dans la Console

1. **Ouvrez votre site Netlify**
2. **Ouvrez la Console** (F12 → Console)
3. **Cherchez ce message :**
   ```
   🔗 API URL configured: ...
   ```

**Si vous voyez `http://localhost:5000/api` :**
- ❌ La variable d'environnement n'est pas configurée
- ✅ Passez à l'Étape 2

**Si vous voyez une autre URL :**
- Vérifiez que cette URL est correcte et accessible

---

### Étape 2: Configurer la Variable dans Netlify

1. **Allez sur Netlify Dashboard**
2. **Votre site** → **Site configuration** → **Environment variables**
3. **Cliquez sur "Add environment variable"**
4. **Ajoutez :**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://VOTRE-BACKEND-URL.com/api`
     - ⚠️ Remplacez `VOTRE-BACKEND-URL.com` par l'URL réelle de votre backend
     - ⚠️ N'oubliez pas d'ajouter `/api` à la fin

**Exemples :**
- Railway: `https://jayana-qhse-production.up.railway.app/api`
- Render: `https://jayana-api.onrender.com/api`
- Heroku: `https://jayana-qhse-api.herokuapp.com/api`

5. **Cliquez sur "Save"**

---

### Étape 3: Redéployer

1. **Dans Netlify Dashboard**
2. **Deploys** (onglet en haut)
3. **Cliquez sur "Trigger deploy"** → **"Deploy site"**
4. **Attendez la fin du déploiement** (2-3 minutes)

---

## ✅ Vérification

Après le redéploiement :

1. **Ouvrez votre site Netlify**
2. **Ouvrez la Console** (F12)
3. **Vous devriez voir :**
   ```
   🔗 API URL configured: https://votre-backend-url.com/api
   ```
4. **Essayez de vous connecter**

---

## 🧪 Test du Backend

**Avant de configurer Netlify, testez que votre backend fonctionne :**

Ouvrez dans votre navigateur :
```
https://votre-backend-url.com/api/health
```

**Vous devriez voir :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running"
}
```

**Si ça ne fonctionne pas :**
- Vérifiez que le backend est bien déployé
- Vérifiez les logs du backend (Railway/Render/Heroku)

---

## 📋 Checklist Rapide

- [ ] Backend accessible (test `/api/health`)
- [ ] Variable `REACT_APP_API_URL` ajoutée dans Netlify
- [ ] URL correcte (avec `/api` à la fin)
- [ ] Site redéployé après modification
- [ ] Console vérifiée (URL correcte affichée)

---

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs Netlify :**
   - Deploys → Dernier déploiement → View build log

2. **Vérifiez la console du navigateur :**
   - F12 → Console
   - Copiez les erreurs exactes

3. **Vérifiez les logs du Backend :**
   - Railway/Render/Heroku → Logs

4. **Consultez le guide détaillé :**
   - `DIAGNOSTIC_ERREUR_NETLIFY.md`


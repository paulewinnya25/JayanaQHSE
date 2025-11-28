# 🔍 Vérifier la Configuration Netlify

## 🌐 Votre Site Netlify

URL : **https://jayanaqhseapp.netlify.app**

---

## 🔧 Vérification de la Configuration

### 1. Variable d'Environnement dans Netlify

**Dans Netlify Dashboard :**

1. **Allez sur** https://app.netlify.com
2. **Sélectionnez votre site** `jayanaqhseapp`
3. **Site settings** → **Environment variables**
4. **Vérifiez que cette variable existe :**
   - **Variable :** `REACT_APP_API_URL`
   - **Valeur :** `https://jayana-qhse-client-production.up.railway.app/api`
   - ⚠️ **N'oubliez pas `/api` à la fin !**

---

### 2. Si la Variable n'Existe pas ou est Incorrecte

**Dans Netlify → Environment variables :**

1. **Ajoutez ou modifiez :**
   - Variable : `REACT_APP_API_URL`
   - Valeur : `https://jayana-qhse-client-production.up.railway.app/api`
   - ⚠️ Utilisez l'URL Railway de votre backend !

2. **Sauvegardez**

3. **Redéployez le site :**
   - Allez dans **Deploys**
   - Cliquez sur **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## 🧪 Tester la Connexion

### Test 1 : Vérifier l'API Backend

Ouvrez dans votre navigateur :
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Vous devriez voir :**
```json
{"status":"OK","message":"Jayana qhse API is running","database":"supabase"}
```

---

### Test 2 : Tester le Login sur Netlify

1. **Ouvrez** https://jayanaqhseapp.netlify.app/login
2. **Essayez de vous connecter avec :**
   - Email : `admin@qhse.com`
   - Mot de passe : `admin123`

3. **Ouvrez la console du navigateur** (F12) pour voir les erreurs

---

## 🔍 Si le Login ne Fonctionne pas

### Vérifier la Console du Navigateur (F12)

**Erreurs communes :**

1. **`ERR_NAME_NOT_RESOLVED`**
   - L'URL de l'API est incorrecte dans Netlify
   - Vérifiez `REACT_APP_API_URL` dans Netlify

2. **`500 Internal Server Error`**
   - Problème côté backend
   - Vérifiez les logs Railway

3. **`CORS error`**
   - Le backend n'accepte pas les requêtes depuis Netlify
   - Vérifiez `FRONTEND_URL` dans Railway

---

## ✅ Checklist

- [ ] Variable `REACT_APP_API_URL` configurée dans Netlify
- [ ] URL pointe vers Railway : `https://jayana-qhse-client-production.up.railway.app/api`
- [ ] `/api/health` fonctionne
- [ ] Test de connexion sur le site Netlify

---

**Vérifiez la variable `REACT_APP_API_URL` dans Netlify et testez la connexion !** 🔗




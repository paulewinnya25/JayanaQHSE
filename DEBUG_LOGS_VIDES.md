# 🔍 Déboguer : Logs Railway Vides

## ❌ Problème

Les logs Railway sont vides lors d'une tentative de login.

---

## 🔍 Vérifications à Faire

### 1. Vérifier que le Serveur Fonctionne

**Test dans le navigateur :**
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Vous devriez voir :**
```json
{"status":"OK","message":"Jayana qhse API is running","database":"supabase"}
```

**Si ça ne fonctionne pas :**
- Le serveur ne démarre pas
- Vérifiez les logs Railway au démarrage
- Cherchez les erreurs de démarrage

---

### 2. Vérifier que les Logs s'Affichent

**Dans Railway :**

1. **Onglet "Logs"**
2. **Vérifiez que vous voyez au moins :**
   - `✅ Using Supabase database`
   - `🚀 Jayana qhse server running on port 5000`

**Si vous ne voyez rien :**
- Le serveur ne démarre pas
- Vérifiez l'onglet "Deployments" pour voir si le déploiement a réussi

---

### 3. Vérifier que la Requête Arrive au Serveur

**J'ai ajouté des logs détaillés dans le code.**

**Après le redéploiement (1-2 minutes), lors d'une tentative de login :**

**Vous devriez voir dans les logs Railway :**
- `📥 POST /api/auth/login` → La requête arrive
- `🔐 Login attempt received: ...` → Le login est traité
- `🔍 Querying user for login: ...` → La requête Supabase est faite

**Si vous ne voyez rien :**
- La requête n'arrive pas au serveur
- Problème de CORS ou de routage
- Vérifiez l'URL dans Netlify

---

### 4. Vérifier l'URL dans Netlify

**Dans Netlify → Environment variables :**

Vérifiez que `REACT_APP_API_URL` est :
- `https://jayana-qhse-client-production.up.railway.app/api`
- ⚠️ Avec `/api` à la fin !

---

## 🔧 Actions Immédiates

### 1. Tester l'Endpoint Health

Ouvrez dans votre navigateur :
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Si ça fonctionne →** Le serveur fonctionne, le problème est ailleurs.

**Si ça ne fonctionne pas →** Le serveur ne démarre pas, vérifiez les logs de démarrage.

---

### 2. Attendre le Redéploiement

J'ai ajouté des logs détaillés. **Attendez 1-2 minutes** que Railway redéploie.

**Ensuite, tentez une connexion et regardez les logs Railway.**

**Vous devriez maintenant voir :**
- `📥 POST /api/auth/login`
- `🔐 Login attempt received: ...`
- `🔍 Querying user for login: ...`

---

### 3. Vérifier la Console du Navigateur

**Sur votre site Netlify :**

1. **Ouvrez la console** (F12)
2. **Tentez une connexion**
3. **Regardez les erreurs réseau**

**Erreurs possibles :**
- `CORS error` → Problème de CORS
- `ERR_NAME_NOT_RESOLVED` → URL incorrecte
- `500 Internal Server Error` → Problème côté serveur

---

## 📋 Checklist

- [ ] `/api/health` fonctionne dans le navigateur ?
- [ ] Les logs Railway montrent le démarrage du serveur ?
- [ ] Après redéploiement, les logs montrent les requêtes ?
- [ ] La console du navigateur montre des erreurs ?

---

**Testez `/api/health` d'abord, puis attendez le redéploiement et testez à nouveau !** 🔍



# 🔗 Configurer Netlify avec l'URL Railway

## ✅ URL Railway disponible

Votre backend est accessible à :
```
https://jayana-qhse-client-production.up.railway.app
```

---

## 🧪 Étape 1: Tester l'API Railway

Ouvrez dans votre navigateur :
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

Vous devriez voir une réponse JSON comme :
```json
{"status":"OK","message":"API is running"}
```

Si ça fonctionne, passez à l'étape 2 ! ✅

---

## 🔧 Étape 2: Mettre à jour Netlify

### Dans Netlify :

1. **Allez sur votre site Netlify**
   - Ouvrez https://app.netlify.com
   - Sélectionnez votre site (jayana-qhse)

2. **Allez dans Site settings**
   - Cliquez sur "Site settings" ou "Paramètres du site"

3. **Ouvrez Environment variables**
   - Dans le menu de gauche, cliquez sur "Environment variables"
   - Ou cherchez "Build & deploy" → "Environment variables"

4. **Modifiez ou ajoutez la variable :**
   - **Variable :** `REACT_APP_API_URL`
   - **Valeur :** `https://jayana-qhse-client-production.up.railway.app/api`
   - ⚠️ **IMPORTANT :** Ajoutez `/api` à la fin !

5. **Sauvegardez** (Save ou Deploy)

6. **Redéployez le site**
   - Allez dans "Deploys" (Déploiements)
   - Cliquez sur "Trigger deploy" → "Clear cache and deploy site"
   - Ou attendez le prochain déploiement automatique

---

## ✅ Étape 3: Vérifier la connexion

1. **Ouvrez votre site Netlify** (ex: `https://jayanaqhse.netlify.app`)

2. **Essayez de vous connecter**
   - Email : `admin@qhse.com`
   - Mot de passe : `admin123`

3. **Si ça fonctionne**, l'application est complètement connectée ! 🎉

---

## 🆘 Si l'API ne répond pas

Vérifiez dans Railway :

1. **Onglet "Logs"** → Cherchez :
   - `🚀 Jayana qhse server running on port 5000`
   - `✅ Supabase connected successfully`

2. **Vérifiez les variables d'environnement dans Railway :**
   - Onglet "Variables" dans Railway
   - Assurez-vous que `PORT=5000` est défini
   - Ou Railway utilisera le port par défaut

---

## 📋 Checklist finale

- [ ] Testé l'URL Railway : `/api/health` fonctionne
- [ ] Modifié `REACT_APP_API_URL` dans Netlify avec l'URL Railway + `/api`
- [ ] Redéployé Netlify
- [ ] Testé la connexion sur le site Netlify
- [ ] Tout fonctionne ! 🚀

---

**Votre URL Railway : `https://jayana-qhse-client-production.up.railway.app`**

**URL complète de l'API : `https://jayana-qhse-client-production.up.railway.app/api`**

Copiez cette dernière URL dans Netlify pour `REACT_APP_API_URL` ! 🔗


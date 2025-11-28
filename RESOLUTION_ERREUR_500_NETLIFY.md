# 🔧 Résolution de l'erreur 500 - Netlify Functions

## 📋 Problème

Erreur 500 lors de la tentative de connexion : `api/auth/login:1 Failed to load resource: the server responded with a status of 500 ()`

## ✅ Solutions appliquées

1. **Amélioration de la gestion des paths** dans `netlify/functions/api.js`
2. **Ajout de logs de débogage** pour identifier le problème
3. **Création de `netlify/functions/package.json`** pour les dépendances
4. **Amélioration de la gestion des erreurs**

## 🔍 Étapes de diagnostic

### 1. Vérifier les logs Netlify

1. Allez sur **Netlify Dashboard** → Votre site `jayanaqhse`
2. Cliquez sur **Functions** dans le menu de gauche
3. Cliquez sur **api** (votre fonction)
4. Regardez l'onglet **Logs** ou **Invocation logs**

Vous devriez voir des logs comme :
```
📥 Netlify Function called: { path: '/api/auth/login', ... }
```

### 2. Vérifier que le build a réussi

1. Netlify Dashboard → **Deploys**
2. Cliquez sur le dernier déploiement
3. Vérifiez qu'il n'y a pas d'erreur dans le build
4. Dans la section **Functions**, vérifiez que `api` est listée

### 3. Tester l'endpoint health

Ouvrez dans votre navigateur :
```
https://jayanaqhse.netlify.app/api/health
```

Si cela fonctionne, le problème est spécifique à la route `/auth/login`.

### 4. Vérifier les variables d'environnement

Dans Netlify → **Site settings** → **Environment variables**, vérifiez que toutes ces variables sont définies :

- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `USE_SUPABASE=true`
- ✅ `JWT_SECRET` (doit être une clé forte, pas `votre_secret_fort`)
- ✅ `JWT_EXPIRE=7d`
- ✅ `REACT_APP_API_URL=/api`

## 🛠️ Solutions possibles

### Solution 1 : Redéployer après le push

Les changements ont été poussés sur GitHub. Netlify devrait redéployer automatiquement.

1. Attendez 2-3 minutes
2. Vérifiez que le nouveau déploiement est terminé
3. Testez à nouveau la connexion

### Solution 2 : Vérifier les dépendances

Si les modules ne sont pas trouvés, vérifiez que :

1. `netlify/functions/package.json` existe (✅ créé)
2. La commande de build installe les dépendances :
   ```toml
   command = "npm install && cd client && npm install && npm run build && cd .. && npm install --workspace=server && cd netlify/functions && npm install && cd ../.."
   ```

### Solution 3 : Vérifier le routage

Le problème peut venir du routage. Vérifiez dans `netlify.toml` :

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200
```

### Solution 4 : Vérifier les logs détaillés

Les nouveaux logs devraient montrer :
- Le path reçu
- Le path transformé
- Les erreurs éventuelles

## 📝 Checklist de vérification

- [ ] Code poussé sur GitHub ✅
- [ ] Netlify redéploie automatiquement
- [ ] Build réussi (vérifier dans Deploys)
- [ ] Fonction `api` visible dans Functions
- [ ] Variables d'environnement toutes définies
- [ ] Test de `/api/health` fonctionne
- [ ] Logs Netlify consultés pour voir l'erreur exacte

## 🎯 Prochaines étapes

1. **Attendre le redéploiement** (2-3 minutes après le push)
2. **Consulter les logs Netlify** pour voir l'erreur exacte
3. **Tester `/api/health`** pour vérifier que la fonction fonctionne
4. **Tester la connexion** à nouveau

## 💡 Si le problème persiste

1. **Copiez l'erreur exacte** des logs Netlify
2. **Vérifiez** que toutes les dépendances sont installées
3. **Testez localement** avec `netlify dev` si possible
4. **Vérifiez** que `JWT_SECRET` est bien une clé forte (pas `votre_secret_fort`)

## 📚 Fichiers modifiés

- ✅ `netlify/functions/api.js` - Amélioration du routage et logs
- ✅ `netlify/functions/package.json` - Nouveau fichier pour les dépendances
- ✅ `netlify.toml` - Mise à jour de la commande de build
- ✅ `DEBUG_NETLIFY_FUNCTIONS.md` - Guide de débogage

---

**Après le redéploiement, testez à nouveau et consultez les logs Netlify pour voir l'erreur exacte !**


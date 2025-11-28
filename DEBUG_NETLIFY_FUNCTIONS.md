# 🐛 Débogage des erreurs Netlify Functions

## ❌ Erreur 500 lors de la connexion

Si vous obtenez une erreur 500 lors de la tentative de connexion, voici comment diagnostiquer :

### 1. Vérifier les logs Netlify

1. Allez sur **Netlify Dashboard** → Votre site
2. Cliquez sur **Functions** dans le menu
3. Cliquez sur **api** (votre fonction)
4. Regardez les **logs** pour voir l'erreur exacte

### 2. Problèmes courants

#### Problème : Modules non trouvés

**Erreur :** `Cannot find module 'express'` ou similaire

**Solution :** 
- Vérifiez que `netlify/functions/package.json` existe
- Vérifiez que la commande de build installe les dépendances :
  ```bash
  cd netlify/functions && npm install
  ```

#### Problème : Path incorrect

**Erreur :** Route non trouvée (404) ou erreur de routage

**Solution :**
- Vérifiez que `netlify.toml` contient la redirection :
  ```toml
  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/api"
    status = 200
  ```

#### Problème : Variables d'environnement non définies

**Erreur :** `SUPABASE_URL is not defined`

**Solution :**
- Vérifiez que toutes les variables sont définies dans Netlify :
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `USE_SUPABASE=true`
  - `JWT_SECRET`
  - `JWT_EXPIRE=7d`

### 3. Tester la fonction directement

Testez l'endpoint health :
```
https://jayanaqhse.netlify.app/api/health
```

Si cela fonctionne, le problème est dans les routes spécifiques.

### 4. Vérifier le build

Dans Netlify → **Deploys** → Cliquez sur le dernier déploiement → **Functions**

Vous devriez voir :
- ✅ `api` fonction créée
- ✅ Taille > 0

### 5. Solution rapide

Si le problème persiste, essayez de :

1. **Redéployer manuellement** :
   - Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

2. **Vérifier la commande de build** :
   - Assurez-vous que `netlify.toml` contient :
   ```toml
   command = "npm install && cd client && npm install && npm run build && cd .. && npm install --workspace=server && cd netlify/functions && npm install && cd ../.."
   ```

3. **Vérifier les dépendances** :
   - `server/package.json` doit contenir `serverless-http`
   - `netlify/functions/package.json` doit exister

### 6. Logs détaillés

Pour voir plus de logs, ajoutez dans `netlify/functions/api.js` :

```javascript
module.exports.handler = async (event, context) => {
  console.log('📥 Event:', JSON.stringify(event, null, 2));
  console.log('📥 Path:', event.path);
  console.log('📥 Method:', event.httpMethod);
  // ... reste du code
};
```

### 7. Test local

Pour tester localement :

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Démarrer le serveur de développement
netlify dev
```

Cela démarre :
- Frontend sur `http://localhost:8888`
- Functions sur `http://localhost:8888/.netlify/functions/api`

### 8. Contact

Si le problème persiste, vérifiez :
- Les logs Netlify pour l'erreur exacte
- Que toutes les dépendances sont installées
- Que les variables d'environnement sont définies


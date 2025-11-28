# 🔍 Vérifier la Configuration Netlify en Production

## ❌ Erreurs détectées

- **401 Unauthorized** : Le token n'est pas envoyé ou n'est pas valide
- **500 Internal Server Error** : Problème serveur (probablement Supabase non initialisé)

## ✅ Checklist de vérification

### 1. Variables d'environnement dans Netlify

Allez dans **Netlify Dashboard** → **Site `jayanaqhse1`** → **Site configuration** → **Environment variables**

Vérifiez que **TOUTES** ces variables existent :

#### Variables Supabase (OBLIGATOIRES)
- [ ] `SUPABASE_URL` = `https://oerdkjgkmalphmpwoymt.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`
- [ ] `USE_SUPABASE` = `true`

#### Variables JWT (OBLIGATOIRES)
- [ ] `JWT_SECRET` = `71337e65604366508b324cede6a6b47e28083f2e063e9814f75564e666f16ff69a2ccb6c8efb611d25c014e7366e0c75274a3dd736b2191af3615620e7154de6`
- [ ] `JWT_EXPIRE` = `7d`

#### Variable Frontend (OBLIGATOIRE)
- [ ] `REACT_APP_API_URL` = `/api`

### 2. Vérifier les logs Netlify Functions

1. **Netlify Dashboard** → **Functions** → **api**
2. Cliquez sur **Logs** ou **Invocation logs**
3. Cherchez les logs qui commencent par :
   ```
   🔍 Environment check in handler: {
     SUPABASE_URL: 'SET (...)',
     SUPABASE_ANON_KEY: 'SET (XXX chars)',
     ...
   }
   ```

**Si vous voyez `'NOT SET'`**, les variables ne sont pas configurées correctement.

### 3. Vérifier le dernier déploiement

1. **Netlify Dashboard** → **Deploys**
2. Vérifiez que le dernier déploiement est **✅ Published** (vert)
3. Si c'est **❌ Failed** (rouge), cliquez dessus pour voir l'erreur

### 4. Tester l'endpoint health

Ouvrez dans votre navigateur :
```
https://jayanaqhse1.netlify.app/api/health
```

Vous devriez voir :
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase",
  "supabaseConfigured": true
}
```

**Si vous voyez `"database": "postgresql"` ou `"supabaseConfigured": false`**, Supabase n'est pas initialisé.

## 🔧 Solutions

### Solution 1 : Ajouter les variables manquantes

Si des variables manquent :
1. Cliquez sur **"Add environment variable"**
2. Ajoutez la variable avec la bonne valeur
3. **Sauvegardez**
4. **Redéployez** : Deploys → Trigger deploy → Deploy site

### Solution 2 : Vérifier que JWT_SECRET est identique

**⚠️ IMPORTANT** : Le `JWT_SECRET` doit être **identique** entre :
- Le fichier `.env` local (pour le développement)
- Les variables Netlify (pour la production)

Si vous avez changé `JWT_SECRET` dans Netlify, tous les tokens générés localement seront invalides en production.

**Solution** : Utilisez le même `JWT_SECRET` partout :
```
71337e65604366508b324cede6a6b47e28083f2e063e9814f75564e666f16ff69a2ccb6c8efb611d25c014e7366e0c75274a3dd736b2191af3615620e7154de6
```

### Solution 3 : Se reconnecter après configuration

Si vous avez ajouté/modifié des variables :
1. **Redéployez** le site
2. **Attendez 2-3 minutes**
3. **Déconnectez-vous** de l'application
4. **Reconnectez-vous** pour générer un nouveau token avec le bon `JWT_SECRET`

### Solution 4 : Vérifier les logs détaillés

Dans les logs Netlify Functions, vous devriez voir :
```
🔍 Environment check in handler: {
  SUPABASE_URL: 'SET (https://oerdkjgkmalphmpwoymt...)',
  SUPABASE_ANON_KEY: 'SET (XXX chars)',
  USE_SUPABASE: 'true',
  JWT_SECRET: 'SET',
  ...
}
```

Si une variable est `'NOT SET'`, ajoutez-la.

## 📋 Action immédiate

1. **Vérifiez** que toutes les variables sont dans Netlify
2. **Vérifiez** que `JWT_SECRET` est identique partout
3. **Redéployez** le site
4. **Testez** `/api/health` dans le navigateur
5. **Déconnectez-vous et reconnectez-vous** dans l'application

## 🎯 Après correction

Une fois que tout est configuré :
- ✅ `/api/health` retourne `"supabaseConfigured": true`
- ✅ Les logs montrent toutes les variables comme `'SET'`
- ✅ La connexion fonctionne
- ✅ Les requêtes API retournent 200 au lieu de 401/500

---

**Vérifiez d'abord les variables d'environnement dans Netlify, puis redéployez !**


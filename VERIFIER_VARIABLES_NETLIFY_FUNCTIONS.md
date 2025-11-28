# 🔧 Vérifier les Variables d'Environnement pour Netlify Functions

## ❌ Problème détecté

Les logs montrent que les variables d'environnement ne sont **PAS disponibles** dans la fonction Netlify :
- `hasSupabaseUrl: false`
- `useSupabase: false`

## ✅ Solution : Configurer les variables dans Netlify

### Étape 1 : Accéder aux variables d'environnement

1. Allez sur **Netlify Dashboard** → https://app.netlify.com
2. Sélectionnez votre site **jayanaqhse**
3. Cliquez sur **Site configuration** (ou **Site settings**)
4. Cliquez sur **Environment variables** dans le menu de gauche

### Étape 2 : Ajouter les variables REQUISES

**⚠️ IMPORTANT :** Ces variables doivent être configurées pour que les **Netlify Functions** puissent y accéder.

Ajoutez ces variables **UNE PAR UNE** :

#### Variable 1 : SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`
- **Scopes:** Cochez **"All scopes"** ou au minimum **"Functions"**

#### Variable 2 : SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`
- **Scopes:** Cochez **"All scopes"** ou au minimum **"Functions"**

#### Variable 3 : USE_SUPABASE
- **Key:** `USE_SUPABASE`
- **Value:** `true` (sans guillemets)
- **Scopes:** Cochez **"All scopes"** ou au minimum **"Functions"**

#### Variable 4 : JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Votre clé secrète forte (remplacez `votre_secret_fort` par une vraie clé)
- **Scopes:** Cochez **"All scopes"** ou au minimum **"Functions"**

#### Variable 5 : JWT_EXPIRE
- **Key:** `JWT_EXPIRE`
- **Value:** `7d`
- **Scopes:** Cochez **"All scopes"** ou au minimum **"Functions"**

#### Variable 6 : REACT_APP_API_URL (pour le frontend)
- **Key:** `REACT_APP_API_URL`
- **Value:** `/api`
- **Scopes:** Cochez **"All scopes"** ou **"Builds"**

### Étape 3 : Vérifier les scopes

**⚠️ CRITIQUE :** Pour que les variables soient disponibles dans les **Netlify Functions**, vous devez cocher au minimum **"Functions"** dans les scopes.

Quand vous ajoutez une variable, vous verrez des cases à cocher :
- ✅ **All scopes** (recommandé)
- ✅ **Builds** (pour le build du frontend)
- ✅ **Functions** (pour les fonctions serverless) ⚠️ **OBLIGATOIRE**
- ✅ **Deploys** (pour les déploiements)

**Pour les variables Supabase et JWT, cochez au minimum "Functions" !**

### Étape 4 : Redéployer

Après avoir ajouté toutes les variables :

1. Allez dans **Deploys**
2. Cliquez sur **Trigger deploy** → **Deploy site**
3. Attendez 2-3 minutes

### Étape 5 : Vérifier les logs

Après le redéploiement, vérifiez les logs de la fonction :

1. **Functions** → **api**
2. **Logs** ou **Invocation logs**

Vous devriez voir :
```
🔍 Environment check in handler: {
  SUPABASE_URL: 'SET (https://oerdkjgkmalphmpwoymt...)',
  SUPABASE_ANON_KEY: 'SET (XXX chars)',
  USE_SUPABASE: 'true',
  ...
}
```

## 📋 Checklist

- [ ] Variable `SUPABASE_URL` ajoutée avec scope **"Functions"**
- [ ] Variable `SUPABASE_ANON_KEY` ajoutée avec scope **"Functions"**
- [ ] Variable `USE_SUPABASE=true` ajoutée avec scope **"Functions"**
- [ ] Variable `JWT_SECRET` ajoutée avec scope **"Functions"**
- [ ] Variable `JWT_EXPIRE=7d` ajoutée avec scope **"Functions"**
- [ ] Variable `REACT_APP_API_URL=/api` ajoutée
- [ ] Site redéployé
- [ ] Logs vérifiés (variables doivent être "SET")

## 🐛 Si les variables ne sont toujours pas disponibles

1. **Vérifiez les scopes** : Les variables doivent avoir le scope **"Functions"**
2. **Vérifiez l'orthographe** : Les noms doivent être exacts (sensible à la casse)
3. **Redéployez** : Un redéploiement est nécessaire après avoir ajouté des variables
4. **Vérifiez les logs** : Les logs devraient maintenant montrer les variables comme "SET"

## 💡 Note importante

Les variables d'environnement dans Netlify sont séparées par **scope** :
- **Builds** : Disponibles pendant le build (pour `REACT_APP_*`)
- **Functions** : Disponibles dans les fonctions serverless (pour `SUPABASE_*`, `JWT_*`, etc.)
- **Deploys** : Disponibles pendant les déploiements

Pour que vos fonctions puissent accéder aux variables, elles **DOIVENT** avoir le scope **"Functions"** !

---

**Après avoir configuré les variables avec le bon scope et redéployé, testez à nouveau la connexion !**


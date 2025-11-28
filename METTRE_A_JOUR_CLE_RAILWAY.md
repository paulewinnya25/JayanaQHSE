# 🔑 Mettre à Jour la Clé Supabase dans Railway

## 📋 Clé à Utiliser

Copiez cette clé exactement (sans espaces avant/après) :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
```

## ✅ Étapes dans Railway

### 1. Accéder aux Variables

1. **Railway Dashboard** → https://railway.app
2. **Sélectionnez votre projet**
3. **Sélectionnez le service backend** (celui qui contient votre API)
4. **Onglet "Variables"** (en haut ou dans le menu latéral)

### 2. Modifier SUPABASE_ANON_KEY

1. **Cherchez la variable `SUPABASE_ANON_KEY`**
2. **Cliquez dessus pour modifier** (ou créez-la si elle n'existe pas)
3. **Supprimez l'ancienne valeur**
4. **Collez la nouvelle clé** (celle ci-dessus)
5. **Vérifiez qu'il n'y a pas d'espaces** avant ou après
6. **Cliquez sur "Save"** ou appuyez sur Entrée

### 3. Vérifier les Autres Variables

Assurez-vous que ces variables existent et sont correctes :

| Variable | Valeur |
|----------|--------|
| `USE_SUPABASE` | `true` (sans guillemets) |
| `SUPABASE_URL` | `https://oerdkjgkmalphmpwoymt.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo` |
| `JWT_SECRET` | Votre secret JWT (ex: `votre_super_secret_jwt_key`) |
| `JWT_EXPIRE` | `7d` |

### 4. Attendre le Redéploiement

1. **Railway redéploie automatiquement** après modification des variables
2. **Attendez 1-2 minutes**
3. **Vérifiez l'onglet "Logs"** pour voir le redéploiement

## 🧪 Vérification

### 1. Vérifier les Logs Railway

Après le redéploiement, les logs devraient afficher :

```
✅ Using Supabase database
✅ Supabase connected successfully
```

**Si vous voyez encore "Invalid API key" :**
- Vérifiez qu'il n'y a pas d'espaces dans la clé
- Vérifiez que vous avez bien sauvegardé
- Attendez quelques secondes de plus

### 2. Tester le Health Check

Ouvrez dans votre navigateur :
```
https://jayana-qhse-client-production.up.railway.app/api/health
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

### 3. Tester la Connexion

1. **Ouvrez votre site Netlify**
2. **Connectez-vous avec :**
   - Email: `admin@jayana.com`
   - Mot de passe: `admin123`

## ⚠️ Problèmes Courants

### La clé ne fonctionne toujours pas

1. **Vérifiez dans Supabase Dashboard** que la clé est toujours valide
   - https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api
   - Regénérez la clé si nécessaire

2. **Vérifiez qu'il n'y a pas d'espaces** dans Railway
   - La clé doit commencer par `eyJ` et finir par `7Fo`
   - Pas d'espaces avant ou après

3. **Vérifiez que vous avez bien sauvegardé** dans Railway

### Railway ne redéploie pas

1. **Déclenchez un redéploiement manuel** :
   - Railway Dashboard → Votre service → "Deploy" → "Redeploy"

## 📋 Checklist

- [ ] Clé `SUPABASE_ANON_KEY` mise à jour dans Railway
- [ ] Pas d'espaces avant/après la clé
- [ ] Variable `USE_SUPABASE=true` configurée
- [ ] Variable `SUPABASE_URL` correcte
- [ ] Attendu le redéploiement Railway (1-2 min)
- [ ] Vérifié les logs (pas d'erreur "Invalid API key")
- [ ] Testé le health check (`supabaseConfigured: true`)
- [ ] Testé la connexion avec admin@jayana.com


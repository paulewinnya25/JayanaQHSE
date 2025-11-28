# 🔧 Corriger la Clé Supabase dans Railway

## ❌ Problème
```
❌ Supabase connection error: {
  message: 'Invalid API key',
  hint: 'Double check your Supabase `anon` or `service_role` API key.'
}
```

## ✅ Solution

### Étape 1: Récupérer la Bonne Clé Supabase

1. **Allez sur Supabase Dashboard**
   - https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt

2. **Settings** → **API** (ou directement : https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api)

3. **Section "Project API keys"**
   - Cherchez **"anon"** ou **"anon public"** key
   - **COPIEZ cette clé** (elle commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Étape 2: Mettre à Jour la Variable dans Railway

1. **Railway Dashboard** → **Votre service backend** → **Variables**

2. **Trouvez la variable `SUPABASE_ANON_KEY`**

3. **Cliquez pour modifier** ou **ajoutez-la si elle n'existe pas**

4. **Collez la clé que vous avez copiée depuis Supabase**

5. **Sauvegardez** (Railway redéploie automatiquement)

### Étape 3: Vérifier les Autres Variables

Assurez-vous que ces variables sont aussi correctes :

- **USE_SUPABASE** = `true` (sans guillemets)
- **SUPABASE_URL** = `https://oerdkjgkmalphmpwoymt.supabase.co`
- **SUPABASE_ANON_KEY** = La clé que vous venez de copier depuis Supabase

### Étape 4: Attendre le Redéploiement

1. **Railway redéploie automatiquement** après modification des variables
2. **Attendez 1-2 minutes**
3. **Vérifiez les logs Railway** - vous devriez voir :
   ```
   ✅ Using Supabase database
   ✅ Supabase connected successfully
   ```

## 🧪 Test

1. **Testez le health check :**
   ```
   https://jayana-qhse-client-production.up.railway.app/api/health
   ```
   - Vous devriez voir `supabaseConfigured: true`

2. **Testez la connexion :**
   - Email: `admin@jayana.com`
   - Mot de passe: `admin123`

## ⚠️ Important

- La clé **anon** est publique et peut être utilisée côté client
- La clé **service_role** est secrète et ne doit PAS être utilisée côté client
- Pour Railway (backend), utilisez la clé **anon** dans `SUPABASE_ANON_KEY`

## 📋 Checklist

- [ ] Clé Supabase copiée depuis le dashboard Supabase
- [ ] Variable `SUPABASE_ANON_KEY` mise à jour dans Railway
- [ ] Variable `SUPABASE_URL` correcte
- [ ] Variable `USE_SUPABASE=true` configurée
- [ ] Attendu le redéploiement Railway
- [ ] Vérifié les logs (pas d'erreur "Invalid API key")
- [ ] Testé la connexion


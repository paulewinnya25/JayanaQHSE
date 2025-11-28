# 🌐 Variables d'Environnement pour Netlify (Client)

## 📍 Où Configurer

**Netlify Dashboard** → **Votre site** → **Site configuration** → **Environment variables**

## ✅ Variable OBLIGATOIRE

### Variable 1: REACT_APP_API_URL

**Key:** `REACT_APP_API_URL`

**Value:** `https://jayana-qhse-client-production.up.railway.app/api`

⚠️ **IMPORTANT:** 
- Remplacez `jayana-qhse-client-production.up.railway.app` par l'URL réelle de votre backend Railway
- Ajoutez `/api` à la fin de l'URL
- L'URL doit commencer par `https://`

**Exemple correct :**
```
https://jayana-qhse-client-production.up.railway.app/api
```

**Exemples incorrects :**
- ❌ `https://jayana-qhse-client-production.up.railway.app` (manque `/api`)
- ❌ `jayana-qhse-client-production.up.railway.app/api` (manque `https://`)
- ❌ `http://jayana-qhse-client-production.up.railway.app/api` (utilise `http` au lieu de `https`)

## 🟡 Variables Optionnelles (si vous utilisez Supabase côté client)

Si vous voulez utiliser Supabase directement depuis le frontend (pour certaines fonctionnalités), vous pouvez ajouter :

### Variable 2: REACT_APP_SUPABASE_URL (Optionnel)

**Key:** `REACT_APP_SUPABASE_URL`

**Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`

### Variable 3: REACT_APP_SUPABASE_ANON_KEY (Optionnel)

**Key:** `REACT_APP_SUPABASE_ANON_KEY`

**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

⚠️ **Note:** Ces variables Supabase sont optionnelles car votre application utilise le backend pour toutes les opérations. Vous n'en avez besoin que si vous voulez utiliser Supabase directement depuis le frontend.

## 📋 Checklist Netlify

### Variable Obligatoire :
- [ ] `REACT_APP_API_URL` = `https://votre-backend-railway.app/api`

### Variables Optionnelles (si nécessaire) :
- [ ] `REACT_APP_SUPABASE_URL` = `https://oerdkjgkmalphmpwoymt.supabase.co`
- [ ] `REACT_APP_SUPABASE_ANON_KEY` = `...`

## 🎯 Résumé

**Pour que votre application fonctionne, vous avez besoin d'UNE SEULE variable dans Netlify :**

```
REACT_APP_API_URL = https://jayana-qhse-client-production.up.railway.app/api
```

Toutes les autres variables (Supabase, JWT, etc.) sont configurées dans **Railway** (côté serveur), pas dans Netlify.

## 🧪 Vérification

Après avoir ajouté `REACT_APP_API_URL` dans Netlify :

1. **Redéployez votre site Netlify**
2. **Ouvrez la console du navigateur** (F12)
3. **Vous devriez voir :**
   ```
   🔗 API URL configured: https://jayana-qhse-client-production.up.railway.app/api
   ```

Si vous voyez `http://localhost:5000/api`, cela signifie que la variable n'est pas configurée ou que le site n'a pas été redéployé.



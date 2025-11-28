# 🔍 Vérifier les Logs Railway pour Diagnostiquer l'Erreur 500

## 📋 Étapes pour Voir les Logs

### 1. Accéder aux Logs Railway

1. **Allez sur Railway Dashboard**
   - https://railway.app
2. **Sélectionnez votre projet**
3. **Sélectionnez le service backend** (celui qui contient votre API)
4. **Onglet "Logs"** (en haut ou dans le menu)

### 2. Tester la Connexion et Observer les Logs

1. **Gardez l'onglet Logs ouvert**
2. **Ouvrez votre site Netlify** dans un autre onglet
3. **Tentez une connexion** avec :
   - Email: `admin@jayana.com`
   - Mot de passe: `admin123`
4. **Regardez immédiatement les logs Railway** - vous devriez voir des messages détaillés

## 🔍 Ce que Vous Devriez Voir dans les Logs

### Si Supabase est bien détecté :

```
🔐 Login attempt received: { email: 'admin@jayana.com', ... }
🔍 Querying user for login: admin@jayana.com
🔍 Supabase check: { 
  useSupabase: true, 
  hasSupabaseClient: true,
  supabaseUrl: 'SET',
  useSupabaseEnv: 'true'
}
🔍 Querying user with Supabase: admin@jayana.com
✅ User found with Supabase: yes
```

### Si Supabase n'est PAS détecté :

```
🔐 Login attempt received: { email: 'admin@jayana.com', ... }
🔍 Querying user for login: admin@jayana.com
🔍 Supabase check: { 
  useSupabase: false,  ← PROBLÈME ICI
  hasSupabaseClient: false,
  ...
}
⚠️ Using PostgreSQL fallback. Supabase should be configured.
```

## 🐛 Problèmes Possibles et Solutions

### Problème 1: `useSupabase: false`

**Cause:** La variable `USE_SUPABASE` n'est pas correctement lue

**Solution:**
1. Railway Dashboard → Variables
2. Vérifiez que `USE_SUPABASE=true` (sans guillemets)
3. Vérifiez que `SUPABASE_URL` est bien définie
4. Redéployez

### Problème 2: `hasSupabaseClient: false`

**Cause:** Le client Supabase n'est pas initialisé

**Solution:**
1. Vérifiez les logs au démarrage - vous devriez voir :
   ```
   ✅ Using Supabase database
   ✅ Supabase connected successfully
   ```
2. Si vous voyez "Invalid API key", mettez à jour `SUPABASE_ANON_KEY`
3. Si vous voyez une autre erreur, notez-la

### Problème 3: Erreur lors de la requête Supabase

**Exemples d'erreurs:**
- `PGRST116` = Table n'existe pas → Exécutez `SCRIPT_COMPLET_TABLES_ET_ADMIN.sql`
- `Invalid API key` → Mettez à jour `SUPABASE_ANON_KEY` dans Railway
- `relation "users" does not exist` → Table non créée dans Supabase

## 📝 Checklist de Diagnostic

- [ ] Logs Railway ouverts
- [ ] Tentative de connexion effectuée
- [ ] Logs observés pendant la tentative
- [ ] Valeur de `useSupabase` notée
- [ ] Valeur de `hasSupabaseClient` notée
- [ ] Erreurs spécifiques notées

## 🆘 Si Vous Ne Voyez Pas les Nouveaux Logs

Si vous ne voyez pas les logs `🔍 Supabase check:`, cela signifie que le code n'a pas encore été redéployé.

**Vérifiez:**
1. Railway a-t-il redéployé après le push GitHub ?
2. Le commit `137a165` est-il bien déployé ?
3. Déclenchez un redéploiement manuel si nécessaire :
   - Railway Dashboard → Votre service → "Deploy" → "Redeploy"

## 📤 Partagez les Logs

Si le problème persiste, copiez les logs Railway (surtout les lignes avec `🔍 Supabase check:` et les erreurs) pour que je puisse vous aider davantage.


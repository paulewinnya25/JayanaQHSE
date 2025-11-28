# 🔍 Vérifier les Valeurs des Variables Railway

## ❌ Problème

Les variables sont configurées dans Railway, mais les logs montrent :
```
USE_SUPABASE : indéfini
SUPABASE_URL : NON RÉGLÉ
```

## 🔎 Causes Possibles

### 1. Valeurs avec Guillemets en Trop

**Problème:** Les valeurs peuvent avoir des guillemets qui empêchent la lecture correcte.

**Solution:**
1. Railway Dashboard → Service `jayana-qhse-server` → Variables
2. Pour chaque variable, vérifiez la valeur :
   - ❌ `"true"` (avec guillemets)
   - ✅ `true` (sans guillemets)
   - ❌ `"https://oerdkjgkmalphmpwoymt.supabase.co"` (avec guillemets)
   - ✅ `https://oerdkjgkmalphmpwoymt.supabase.co` (sans guillemets)

### 2. Root Directory Incorrect

**Problème:** Le Root Directory n'est pas `server`, donc le code ne trouve pas les fichiers.

**Vérification:**
1. Railway Dashboard → Service `jayana-qhse-server` → Settings
2. **Root Directory** → Doit être : `server`
3. Si ce n'est pas `server`, changez-le

### 3. Variables Non Sauvegardées

**Vérification:**
1. Ouvrez chaque variable dans Railway
2. Vérifiez que la valeur est bien sauvegardée
3. Cliquez sur "Save" si nécessaire

### 4. Redéploiement Non Effectué

**Solution:**
1. Après avoir modifié les variables, Railway devrait redéployer automatiquement
2. Si ce n'est pas le cas, déclenchez un redéploiement manuel :
   - Railway Dashboard → Service → Deployments → "Redeploy"

## ✅ Vérification des Valeurs Exactes

### Variable USE_SUPABASE
- **Doit être:** `true` (sans guillemets, sans espaces)
- **Ne doit PAS être:** `"true"`, `" true "`, `true `, ` true`

### Variable SUPABASE_URL
- **Doit être:** `https://oerdkjgkmalphmpwoymt.supabase.co` (sans guillemets)
- **Ne doit PAS être:** `"https://..."`, ` https://... `, `https://.../`

### Variable SUPABASE_ANON_KEY
- **Doit commencer par:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Ne doit PAS avoir:** de guillemets, d'espaces avant/après

## 🧪 Test Rapide

1. **Modifiez une variable** (par exemple, ajoutez un espace puis enlevez-le)
2. **Sauvegardez**
3. **Railway redéploie automatiquement**
4. **Vérifiez les logs** - vous devriez voir les variables détectées

## 📋 Checklist de Vérification

- [ ] Variable `USE_SUPABASE` = `true` (sans guillemets)
- [ ] Variable `SUPABASE_URL` = `https://oerdkjgkmalphmpwoymt.supabase.co` (sans guillemets)
- [ ] Variable `SUPABASE_ANON_KEY` = la clé complète (sans guillemets, sans espaces)
- [ ] Root Directory = `server` (dans Settings)
- [ ] Toutes les variables sauvegardées
- [ ] Redéploiement effectué
- [ ] Logs vérifiés (variables détectées)

## 🆘 Si le Problème Persiste

1. **Supprimez toutes les variables Supabase**
2. **Redéployez** (pour voir les logs sans variables)
3. **Ajoutez-les une par une** en vérifiant les logs après chaque ajout
4. **Vérifiez qu'il n'y a pas d'espaces ou de guillemets** dans les valeurs



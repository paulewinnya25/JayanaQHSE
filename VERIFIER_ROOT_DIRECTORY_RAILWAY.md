# 🔍 Vérifier le Root Directory dans Railway

## ❌ Problème Possible

Les variables sont configurées, mais si le **Root Directory** n'est pas correct, le code ne peut pas les lire.

## ✅ Vérification du Root Directory

### Étape 1: Accéder aux Settings

1. **Railway Dashboard** → https://railway.app
2. **Votre projet** → **Service `jayana-qhse-server`**
3. **Onglet "Settings"** (ou "Paramètres")

### Étape 2: Vérifier le Root Directory

1. **Cherchez la section "Root Directory"** ou "Répertoire racine"
2. **La valeur doit être :** `server`
   - ✅ Correct : `server`
   - ❌ Incorrect : `.` (point) ou vide ou autre chose

### Étape 3: Modifier si Nécessaire

1. **Si le Root Directory n'est pas `server` :**
   - Cliquez pour modifier
   - Entrez : `server`
   - Sauvegardez

2. **Railway redéploiera automatiquement**

## 🎯 Pourquoi c'est Important

Si le Root Directory est `.` (racine du projet) :
- Railway cherche `index.js` à la racine
- Mais votre `index.js` est dans le dossier `server/`
- Le code ne peut pas charger les fichiers correctement

Si le Root Directory est `server` :
- Railway cherche `index.js` dans `server/`
- Tout fonctionne correctement

## 📋 Checklist

- [ ] Root Directory = `server` (dans Settings du service `jayana-qhse-server`)
- [ ] Si modifié, attendu le redéploiement
- [ ] Vérifié les logs après redéploiement

## 🧪 Test

Après avoir corrigé le Root Directory :

1. **Vérifiez les logs au démarrage**
2. **Vous devriez voir :**
   ```
   🔍 Environment check:
     USE_SUPABASE: true
     SUPABASE_URL: SET
     SUPABASE_ANON_KEY: SET
   ✅ Using Supabase database
   ```



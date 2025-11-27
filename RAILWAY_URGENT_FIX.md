# 🚨 CORRECTION URGENTE - Railway Build Error

## ❌ Problème actuel

Railway exécute `npm ci` depuis la **racine** au lieu du dossier `server/`, ce qui cause l'erreur :
```
npm error Missing: @supabase/supabase-js@2.86.0 from lock file
```

## ✅ SOLUTION EN 2 ÉTAPES (OBLIGATOIRE)

### Étape 1: Configurer le Root Directory dans Railway ⚠️ CRITIQUE

**Dans l'interface Railway :**

1. **Cliquez sur votre service** `jayana-qhse-client` (ou le nom de votre service)

2. **Allez dans l'onglet "Settings"** (en haut, à côté de "Deployments")

3. **Cherchez la section "Source"** ou **"Build & Deploy"**

4. **Trouvez "Root Directory"** ou **"Add Root Directory"**
   - C'est un champ de texte ou un bouton
   - **Si c'est vide ou contient "." → Changez en : `server`**
   - **Si ça n'existe pas → Cliquez sur "Add Root Directory" et tapez : `server`**

5. **Sauvegardez** (cliquez ailleurs ou appuyez sur Entrée)

6. **Railway redéploiera automatiquement**

---

### Étape 2: Vérifier la configuration Build

Dans Settings, vérifiez aussi :

**Build Command:** (peut être vide, Railway utilisera alors `npm install`)
```
npm install
```

**Start Command:** (doit être)
```
npm start
```

---

## 🔍 Pourquoi ça ne marche pas ?

- ❌ Railway exécute `npm ci` depuis la **racine** (monorepo)
- ✅ Il devrait exécuter depuis le dossier **`server/`**
- ✅ Avec Root Directory = `server`, Railway cherchera le `package.json` dans `server/`

---

## 📋 Checklist

- [ ] **Root Directory** configuré sur `server` dans Railway Settings
- [ ] Changements sauvegardés
- [ ] Railway redéploie automatiquement
- [ ] Vérifier l'onglet "Deployments" pour voir le nouveau build
- [ ] Le build devrait réussir ✅

---

## ✅ Fichiers déjà créés et poussés

- ✅ `server/nixpacks.toml` - Force `npm install` au lieu de `npm ci`
- ✅ `railway.json` - Configuration Railway
- ✅ `package-lock.json` (racine) - Synchronisé
- ✅ `server/package-lock.json` - Synchronisé

---

**🎯 L'ÉTAPE CRITIQUE EST DE CONFIGURER Root Directory = `server` DANS RAILWAY SETTINGS !**

Sans ça, Railway continuera à chercher les fichiers à la racine au lieu de `server/`.


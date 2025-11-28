# ⚙️ Vérifier les Settings Railway - Commandes Build/Start

## ❌ Problème Actuel

Railway essaie d'exécuter `npm start --workspace=jayana-qhse-server` alors qu'avec Root Directory = `/server`, il n'y a plus de workspace.

---

## ✅ SOLUTION : Vérifier les Commandes dans Railway Settings

### Dans Railway :

1. **Service** `jayana-qhse-server` → **Onglet "Settings"** (Paramètres)

2. **Cherchez la section "Build & Deploy"** ou **"Deploy"**

3. **Vérifiez les commandes configurées :**

---

## 🔧 Configuration Correcte

### Avec Root Directory = `/server` :

**Build Command :**
- Doit être : `npm install`
- OU laisser vide (Railway utilisera automatiquement)
- ❌ **PAS de** `--workspace=jayana-qhse-server`
- ❌ **PAS de** `cd server`

**Start Command :**
- Doit être : `npm start`
- OU : `node index.js`
- ❌ **PAS de** `--workspace=jayana-qhse-server`
- ❌ **PAS de** `cd server`

---

## 📋 Étapes dans Railway Settings

1. **Onglet "Settings"** → Section **"Build & Deploy"** ou **"Deploy"**

2. **Si vous voyez des commandes avec `--workspace` :**
   - Effacez-les ou remplacez-les
   - Build : `npm install` (ou vide)
   - Start : `npm start` (ou `node index.js`)

3. **Sauvegardez** → Railway redéploiera automatiquement

---

## 🎯 Alternative : Utiliser le Procfile

Railway devrait automatiquement détecter le `Procfile` dans `server/` qui contient :
```
web: node index.js
```

Si le Procfile est détecté, vous pouvez laisser les commandes vides dans Settings.

---

## ✅ Après Correction

1. **Railway redéploiera automatiquement**
2. **Les logs ne montreront plus** `No workspaces found`
3. **Le serveur devrait démarrer correctement**

---

**Allez dans Railway Settings → Build & Deploy et vérifiez/corrigez les commandes !** ⚙️



# 🔧 Corriger les Commandes de Build/Start dans Railway

## ❌ Problème

Railway essaie d'exécuter `npm start --workspace=jayana-qhse-server` alors qu'avec Root Directory = `/server`, il n'y a plus de workspace. Les commandes doivent être exécutées directement.

---

## ✅ SOLUTION : Vérifier les Commandes dans Railway Settings

### Dans Railway :

1. **Allez dans votre service** `jayana-qhse-server`

2. **Onglet "Settings"** (Paramètres)

3. **Cherchez la section "Build & Deploy"** ou **"Deploy"**

4. **Vérifiez les commandes :**

### Build Command :
```
npm install
```
(Doit être vide ou contenir juste `npm install`, PAS de `--workspace`)

### Start Command :
```
npm start
```
OU
```
node index.js
```
(PAS de `--workspace`, pas de `cd server`)

---

## 🔧 Si les Commandes sont Incorrectes

### Dans Railway Settings → Build & Deploy :

1. **Build Command :**
   - Effacez tout
   - Ou mettez : `npm install`
   - **PAS de** `--workspace=jayana-qhse-server`

2. **Start Command :**
   - Mettez : `npm start`
   - OU : `node index.js`
   - **PAS de** `--workspace=jayana-qhse-server`
   - **PAS de** `cd server` (vous êtes déjà dans `/server` grâce au Root Directory)

3. **Sauvegardez** → Railway redéploiera automatiquement

---

## ✅ Configuration Correcte

Avec Root Directory = `/server` :

- **Build Command :** `npm install` (ou vide)
- **Start Command :** `npm start` ou `node index.js`

Sans Root Directory :
- **Build Command :** `cd server && npm install`
- **Start Command :** `cd server && npm start`

---

## 📋 Résumé

**Avec Root Directory = `/server` configuré, Railway est déjà dans le bon dossier.**  
**Les commandes ne doivent PAS contenir `--workspace` ou `cd server`.**

---

**Allez dans Railway Settings → Build & Deploy et vérifiez/corrigez les commandes !** 🔧


# 🔧 Corriger l'Erreur de Déploiement Railway

## ❌ Problème

Railway essaie de déployer depuis la racine du projet, mais votre backend est dans le dossier `server/`.

## ✅ Solution

### Option 1: Configurer le Root Directory dans Railway (RECOMMANDÉ)

1. **Dans Railway:**
   - Cliquez sur votre service
   - Allez dans **"Settings"** (Paramètres)
   - Cherchez **"Source"** ou **"Root Directory"**
   - Changez le **Root Directory** en: `server`
   - Sauvegardez

2. **Redéployez:**
   - Railway redéploiera automatiquement avec le bon dossier

### Option 2: Utiliser le fichier railway.json

Le fichier `railway.json` a été créé à la racine pour indiquer à Railway d'utiliser le dossier `server/`.

Si Railway ne le détecte pas automatiquement:
1. Assurez-vous que le fichier `railway.json` est bien dans le repo GitHub
2. Redéployez dans Railway

### Option 3: Configuration manuelle dans Railway

1. **Dans Settings de votre service Railway:**
   - Cherchez **"Build Command"**
   - Changez en: `cd server && npm install`
   - Cherchez **"Start Command"**
   - Changez en: `cd server && npm start`
   - Sauvegardez

---

## 🔍 Vérifier les logs d'erreur

Pour voir l'erreur exacte:

1. Dans Railway, allez dans l'onglet **"Logs"** ou **"View Logs"**
2. Cherchez les lignes d'erreur (en rouge)
3. Les erreurs communes sont:
   - `Cannot find module` → Railway cherche dans le mauvais dossier
   - `package.json not found` → Root Directory incorrect
   - `npm: command not found` → Problème de build

---

## 📋 Configuration correcte

### Dans Railway Settings:

- **Root Directory:** `server`
- **Build Command:** `npm install` (ou laisser vide)
- **Start Command:** `npm start`

OU

- **Root Directory:** `.` (racine)
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`

---

## ✅ Après correction

1. Railway redéploiera automatiquement
2. Vérifiez les logs pour confirmer le succès
3. L'URL sera générée automatiquement
4. Testez: `https://votre-url.railway.app/api/health`

---

**Allez dans Settings et configurez le Root Directory sur `server` ! 🔧**


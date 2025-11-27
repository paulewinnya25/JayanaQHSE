# 🔧 Corriger l'Erreur de Déploiement Railway - Guide Pas à Pas

## ❌ Erreur actuelle

"There was an error deploying from source"

## ✅ Solution en 3 étapes

### Étape 1: Ouvrir Settings

Dans Railway:
1. Cliquez sur la carte **"jayana-qhse-client"** dans le panneau de gauche
2. Ou si le panneau de droite est ouvert, cliquez sur l'onglet **"Settings"** en haut

### Étape 2: Configurer Root Directory

1. Dans Settings, cherchez la section **"Source"**
2. Trouvez **"Add Root Directory"** ou **"Root Directory"**
3. Cliquez sur **"Add Root Directory"**
4. Tapez: `server`
5. Sauvegardez

### Étape 3: Redéployer

1. Railway redéploiera automatiquement
2. Attendez quelques secondes
3. Vérifiez l'onglet **"Deployments"** pour voir le nouveau déploiement
4. Le statut devrait passer au vert (Success)

---

## 🔍 Voir les logs d'erreur

Pour comprendre l'erreur exacte:

1. **Cliquez sur la notification d'erreur rouge** en bas à droite
   - "There was an error deploying from source"

2. **Ou allez dans l'onglet "Logs"** en haut

3. **Cherchez les erreurs** (lignes en rouge), par exemple:
   - `Cannot find module`
   - `package.json not found`
   - `ENOENT: no such file or directory`

---

## 📋 Configuration alternative

Si "Root Directory" n'existe pas dans Settings:

### Dans Settings → Build & Deploy:

1. **Build Command:**
   ```
   cd server && npm install
   ```

2. **Start Command:**
   ```
   cd server && npm start
   ```

3. **Sauvegardez**

---

## ✅ Après correction

1. Le déploiement devrait réussir (statut vert)
2. L'URL sera générée automatiquement
3. Testez: `https://votre-url.railway.app/api/health`

---

**Allez dans Settings et configurez Root Directory = `server` ! 🚀**


# 🔧 Corriger l'Erreur de Déploiement Railway

## ❌ Problème

L'erreur "Il y a eu une erreur déployée depuis la source" survient généralement parce que Railway essaie de déployer depuis la racine du projet, alors que votre backend est dans le dossier `server/`.

## ✅ Solution: Configurer le Root Directory

### Dans Railway:

1. **Cliquez sur votre service** `jayana-qhse-client`

2. **Allez dans "Settings"** (Paramètres) en bas à gauche

3. **Cherchez la section "Source"** ou **"Build & Deploy"**

4. **Trouvez "Root Directory"** ou **"Working Directory"**

5. **Changez la valeur** en: `server`

6. **Sauvegardez** (cliquez sur "Save" ou attendez l'auto-sauvegarde)

7. **Railway redéploiera automatiquement** avec la bonne configuration

---

## 📋 Configuration alternative si "Root Directory" n'existe pas

Si vous ne trouvez pas "Root Directory", configurez les commandes manuellement:

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

## 🔍 Vérifier les logs d'erreur

Pour voir l'erreur exacte dans Railway:

1. Allez dans l'onglet **"Logs"** ou **"View Logs"**
2. Scroll vers le haut pour voir les erreurs
3. Les erreurs communes:
   - `Cannot find module 'express'` → Root Directory incorrect
   - `package.json not found` → Mauvais dossier
   - `ENOENT: no such file or directory` → Fichiers introuvables

---

## ✅ Après correction

1. Railway redéploiera automatiquement
2. Vérifiez les logs pour voir:
   - `✅ Supabase connected successfully`
   - `🚀 Jayana qhse server running on port 5000`
3. Le déploiement devrait être en vert (Success)
4. L'URL sera générée automatiquement

---

## 📝 Checklist

- [ ] Root Directory configuré sur `server` dans Railway Settings
- [ ] Build Command: `npm install` (dans le dossier server)
- [ ] Start Command: `npm start` (dans le dossier server)
- [ ] Déploiement réussi (statut vert)
- [ ] URL générée dans Networking
- [ ] Test `/api/health` fonctionne

---

**Allez dans Settings et configurez le Root Directory sur `server` ! 🔧**

Une fois configuré, Railway redéploiera automatiquement et le déploiement devrait réussir.


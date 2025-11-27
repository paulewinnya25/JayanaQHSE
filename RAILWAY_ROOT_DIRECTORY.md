# 📁 Configurer le Root Directory dans Railway

## ✅ Action à faire maintenant

Dans l'interface Railway Settings que vous voyez :

1. **Cliquez sur le lien "Add Root Directory"** 
   - Il est en dessous de "Source Repo"
   - Juste à gauche du texte "(used for build and deploy steps. Docs ↗)"

2. **Un champ de saisie apparaîtra**

3. **Tapez:** `server`

4. **Sauvegardez** (cliquez ailleurs ou appuyez sur Entrée)

5. **Railway redéploiera automatiquement** avec la bonne configuration

---

## 📋 Ce que cela fait

En configurant le Root Directory sur `server`, Railway va:
- ✅ Chercher `package.json` dans le dossier `server/`
- ✅ Exécuter `npm install` dans `server/`
- ✅ Lancer `npm start` depuis `server/`
- ✅ Trouver le fichier `index.js` dans `server/`

---

## ✅ Après configuration

1. Railway redéploiera automatiquement
2. Le déploiement devrait réussir (statut vert)
3. L'URL sera générée dans Networking
4. Testez: `https://votre-url.railway.app/api/health`

---

**Cliquez sur "Add Root Directory" et tapez "server" ! 🚀**


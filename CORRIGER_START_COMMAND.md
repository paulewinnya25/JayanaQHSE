# 🔧 Corriger la Commande de Démarrage dans Railway

## ❌ Problème Identifié

Dans Railway Settings → Deploy → "Custom Start Command", la commande est :
```
npm run start --workspace=jayana-qhse-server
```

**Cette commande est incorrecte** car avec Root Directory = `/server`, Railway est déjà dans le bon dossier et il n'y a plus de workspace.

---

## ✅ SOLUTION : Modifier la Commande

### Dans Railway Settings → Deploy :

1. **Trouvez "Custom Start Command"**
   - C'est le champ de texte qui contient actuellement : `npm run start --workspace=jayana-qhse-server`

2. **Remplacez la commande par :**
   ```
   npm start
   ```
   OU
   ```
   node index.js
   ```

3. **Supprimez complètement** `--workspace=jayana-qhse-server`

4. **Sauvegardez** (cliquez ailleurs ou appuyez sur Entrée)

5. **Railway redéploiera automatiquement** avec la bonne commande

---

## ✅ Configuration Correcte

**Custom Start Command doit être :**
- `npm start` ✅
- OU `node index.js` ✅

**Ne doit PAS contenir :**
- ❌ `--workspace=jayana-qhse-server`
- ❌ `cd server`
- ❌ `npm run start` (utilisez `npm start` directement)

---

## 🔄 Après la Modification

1. **Railway redéploiera automatiquement**
2. **Les logs ne montreront plus** `No workspaces found`
3. **Le serveur devrait démarrer correctement**
4. **Vous devriez voir** : `🚀 Jayana qhse server running on port 5000`

---

**Modifiez "Custom Start Command" pour mettre simplement `npm start` !** 🚀



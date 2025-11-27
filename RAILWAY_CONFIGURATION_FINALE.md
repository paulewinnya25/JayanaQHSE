# 🚂 Configuration Railway - Solution Complète

## ❌ Problème actuel

```
npm error Missing: @supabase/supabase-js@2.86.0 from lock file
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync
```

## ✅ Solution en 2 parties

### Partie 1: Configuration dans l'Interface Railway (OBLIGATOIRE)

1. **Dans Railway, allez dans votre service "jayana-qhse-client"**

2. **Onglet Settings → Source**
   - Trouvez **"Root Directory"** ou **"Add Root Directory"**
   - Cliquez et tapez: `server`
   - ✅ C'EST LA CLÉ ! Railway doit savoir que le code est dans `server/`

3. **Si Root Directory n'existe pas:**
   - Allez dans **Settings → Build & Deploy**
   - Configurez:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

### Partie 2: Vérification des fichiers

✅ **Fichiers déjà en place:**
- `railway.json` (à la racine) - mis à jour
- `server/package.json` - contient toutes les dépendances
- `server/package-lock.json` - régénéré avec `npm install`

---

## 🔄 Après configuration

1. **Railway redéploiera automatiquement**
2. **Le build devrait réussir** car:
   - Railway sait que le code est dans `server/`
   - Le `package-lock.json` est synchronisé
   - Les commandes utilisent le bon répertoire

---

## 🎯 Commandes utilisées par Railway (après config)

Avec Root Directory = `server`:
- Railway exécute automatiquement dans `server/`
- Build: `npm install` (dans `server/`)
- Start: `npm start` (dans `server/`)

---

## 📋 Checklist

- [ ] Aller dans Railway → Settings → Root Directory
- [ ] Configurer Root Directory = `server`
- [ ] Attendre le redéploiement automatique
- [ ] Vérifier l'onglet "Deployments" pour voir le statut
- [ ] Quand c'est vert ✅, récupérer l'URL du service
- [ ] Tester: `https://votre-url.railway.app/api/health`
- [ ] Mettre à jour `REACT_APP_API_URL` dans Netlify avec cette URL

---

**L'ÉTAPE CRITIQUE EST DE CONFIGURER Root Directory = `server` DANS RAILWAY !** 🎯


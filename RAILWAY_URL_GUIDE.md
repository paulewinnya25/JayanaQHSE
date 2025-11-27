# 🔗 Trouver l'URL de votre Backend Railway

## 📍 Où trouver l'URL dans Railway

### Méthode 1: Via l'onglet Overview

1. Dans Railway, cliquez sur votre service **"jayana-qhse-client"**
2. Vous devriez voir un onglet **"Overview"** ou **"Vue d'ensemble"**
3. Cherchez une section avec l'URL du service
4. L'URL devrait ressembler à: `https://jayana-qhse-client-production.up.railway.app`

### Méthode 2: Via Settings → Networking

1. Cliquez sur votre service
2. Allez dans **"Settings"** (Paramètres) en bas à gauche
3. Cliquez sur **"Networking"** (Réseautage)
4. Dans **"Public Networking"**, l'URL devrait apparaître

### Méthode 3: Générer le domaine manuellement

Si vous ne voyez pas d'URL:

1. Dans **Settings → Networking**
2. Cliquez sur la boîte **"Le domaine public sera généré"**
3. Ou cherchez un bouton **"Generate Domain"** / **"Générer un domaine"**
4. Railway générera l'URL automatiquement

### Méthode 4: Via l'onglet Deployments

1. Allez dans **"Deployments"** (Déploiements)
2. Cliquez sur le dernier déploiement réussi
3. Dans les détails, vous devriez voir l'URL générée

---

## 🔍 Si vous ne trouvez toujours pas l'URL

### Vérifiez que le service est bien déployé:

1. Allez dans l'onglet **"Deployments"**
2. Vérifiez que le statut est **"Success"** (vert) ou **"Built"**
3. Si c'est encore en cours, attendez la fin du déploiement

### Vérifiez les logs:

1. Dans votre service Railway, cliquez sur **"Logs"** ou **"View Logs"**
2. Cherchez des lignes comme:
   - `🚀 Jayana qhse server running on port 5000`
   - `✅ Supabase connected successfully`
3. Si vous voyez ces messages, le service fonctionne

---

## 📝 Format de l'URL Railway

L'URL Railway suit généralement ce format:
```
https://[nom-du-service]-[environnement].up.railway.app
```

Exemples:
- `https://jayana-qhse-client-production.up.railway.app`
- `https://jayana-qhse-production.up.railway.app`
- `https://jayana-qhse-client-production-xxxx.up.railway.app`

---

## ✅ Une fois l'URL trouvée

1. **Testez l'URL:**
   - Ouvrez: `https://votre-url.railway.app/api/health`
   - Vous devriez voir: `{"status":"OK","message":"Jayana qhse API is running",...}`

2. **Configurez dans Netlify:**
   - Variable: `REACT_APP_API_URL`
   - Valeur: `https://votre-url.railway.app/api`

3. **Redéployez Netlify**

---

## 🆘 Si Railway ne génère pas d'URL

Parfois, il faut:
1. Vérifier que le port est bien exposé (Railway détecte automatiquement le port depuis `PORT`)
2. Attendre que le premier déploiement soit complètement terminé
3. Rafraîchir la page
4. Ou cliquer manuellement pour générer le domaine

---

**Cherchez l'URL dans les onglets Overview, Settings/Networking, ou Deployments ! 🚂**


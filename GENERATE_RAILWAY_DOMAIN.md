# 🌐 Générer le Domaine Public Railway

## 📋 Instructions

Dans l'interface Railway que vous avez ouverte :

### Option 1: Cliquer sur la boîte "Public domain will be generated"

1. **Cliquez sur la boîte violette** qui affiche :
   - 🌐 Globe icon
   - "Public domain will be generated"

2. Railway va générer automatiquement un domaine public

3. Après quelques secondes, vous verrez apparaître une URL, par exemple:
   - `https://jayana-qhse-client-production.up.railway.app`
   - ou similaire

### Option 2: Via le bouton "Generate Domain"

Si vous ne voyez pas la boîte, cherchez un bouton "Generate Domain" ou "Add Domain" dans la section Networking.

---

## ✅ Après la génération

Une fois le domaine généré :

1. **Copiez l'URL complète** (ex: `https://jayana-qhse-client-production.up.railway.app`)

2. **Testez l'URL dans votre navigateur:**
   - Ajoutez `/api/health` à la fin
   - Exemple: `https://votre-url.railway.app/api/health`
   - Vous devriez voir: `{"status":"OK",...}`

3. **Configurez dans Netlify:**
   - Allez dans Netlify → Environment variables
   - Modifiez `REACT_APP_API_URL`
   - Valeur: `https://votre-url-railway.app/api`
   - ⚠️ N'oubliez pas d'ajouter `/api` à la fin !

---

## 🆘 Si le domaine n'apparaît pas

Parfois Railway prend quelques minutes. Vérifiez :
- Les logs de déploiement pour voir si le service démarre
- L'onglet "Deployments" pour voir l'état du déploiement
- Attendez quelques secondes et rafraîchissez la page

Une fois le domaine généré, suivez les étapes ci-dessus ! 🚀


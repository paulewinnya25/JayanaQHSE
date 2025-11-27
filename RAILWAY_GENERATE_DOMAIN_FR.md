# 🌐 Générer le Domaine Public Railway - Instructions

## 📋 Dans l'interface Railway que vous voyez :

### Option 1: Cliquer sur la boîte violette

1. **Cliquez sur la grande boîte violette** qui affiche :
   - 🌐 Icône globe
   - "Le domaine public sera généré"
   - 🗑️ Icône poubelle à droite

2. Railway va générer automatiquement le domaine public

3. Après quelques secondes, l'URL apparaîtra à la place du texte

### Option 2: Vérifier si le service est déployé

Si la boîte ne répond pas, vérifiez d'abord :

1. **Allez dans l'onglet "Déploiements" (Deployments)** en haut
2. Vérifiez que le déploiement est **terminé avec succès** (statut vert)
3. Si le déploiement est encore en cours, attendez qu'il se termine
4. Une fois terminé, revenez dans "Paramètres" (Settings) → "Réseautage" (Networking)
5. Le domaine devrait apparaître automatiquement

---

## ⚠️ Note importante

Vous n'avez **PAS besoin** d'ajouter un proxy TCP pour l'instant. Laissez la section "Ajouter un proxy TCP" telle quelle.

Le proxy TCP est uniquement nécessaire si vous voulez exposer un port spécifique (comme PostgreSQL sur le port 5432), mais pour votre application Express, vous avez besoin d'un **domaine HTTP public**, pas d'un proxy TCP.

---

## ✅ Après que le domaine soit généré

1. **Copiez l'URL** qui apparaîtra (ex: `https://jayana-qhse-client-production.up.railway.app`)

2. **Testez dans votre navigateur:**
   ```
   https://votre-url.railway.app/api/health
   ```

3. **Configurez dans Netlify:**
   - Allez dans Netlify → Environment variables
   - `REACT_APP_API_URL` = `https://votre-url.railway.app/api`

---

**Essayez de cliquer sur la boîte violette ou attendez que le déploiement se termine ! 🚀**


# ⚡ Solution Rapide - URL Railway

## 🎯 Action immédiate

Dans Railway, dans la section "Réseautage" que vous voyez:

1. **Cliquez sur la grande boîte violette** avec:
   - 🌐 Icône globe
   - "Le domaine public sera généré"

2. **Attendez 2-3 secondes**

3. **Une URL devrait apparaître**, par exemple:
   ```
   https://jayana-qhse-client-production.up.railway.app
   ```

4. **Copiez cette URL**

---

## ✅ Ensuite

1. **Testez l'URL:**
   - Ouvrez dans votre navigateur: `https://votre-url.railway.app/api/health`
   - Si ça marche, vous verrez: `{"status":"OK",...}`

2. **Configurez dans Netlify:**
   - Variable: `REACT_APP_API_URL`
   - Valeur: `https://votre-url.railway.app/api`
   - ⚠️ N'oubliez pas `/api` à la fin !

3. **Redéployez Netlify**

---

**C'est aussi simple que ça ! Cliquez sur la boîte violette. 🚀**


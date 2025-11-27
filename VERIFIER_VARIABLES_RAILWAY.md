# ✅ Vérifier les Variables d'Environnement Railway

## 🔧 Corrections effectuées

✅ J'ai corrigé `auth.js` et le middleware pour utiliser Supabase au lieu de PostgreSQL  
✅ Les changements sont poussés sur GitHub  
✅ Railway va redéployer automatiquement  

---

## 🔑 Variables d'environnement REQUISES dans Railway

### Dans Railway → Onglet "Variables" :

Ajoutez ou vérifiez ces variables :

```env
# Supabase (OBLIGATOIRE)
USE_SUPABASE=true
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo

# JWT (OBLIGATOIRE - générez un secret sécurisé)
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_ici
JWT_EXPIRE=7d

# Configuration serveur
PORT=5000
NODE_ENV=production

# Frontend URL (pour CORS)
FRONTEND_URL=https://jayanaqhse.netlify.app
```

---

## 🎯 Comment générer JWT_SECRET

Dans votre terminal local :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ou utilisez ce secret (pour tester) :
```
jayana_qhse_jwt_secret_2024_super_secure_key_change_in_production
```

---

## 📋 Étapes dans Railway

1. **Onglet "Variables"** dans votre service Railway

2. **Vérifiez chaque variable** ci-dessus

3. **Si une variable manque :**
   - Cliquez sur **"New Variable"** ou **"+"**
   - Ajoutez le nom et la valeur
   - Sauvegardez

4. **Railway redéploiera automatiquement**

---

## ✅ Après configuration

1. **Attendez 1-2 minutes** que Railway redéploie

2. **Vérifiez les logs Railway :**
   - Onglet "Logs"
   - Cherchez : `✅ Supabase connected successfully`
   - Cherchez : `🚀 Jayana qhse server running on port 5000`

3. **Testez l'API :**
   ```
   https://jayana-qhse-client-production.up.railway.app/api/health
   ```

4. **Testez le login :**
   - Ouvrez votre site Netlify
   - Essayez de vous connecter avec : `admin@qhse.com` / `admin123`

---

## 🆘 Si ça ne fonctionne toujours pas

### Vérifier les logs Railway :

1. Onglet **"Logs"**
2. Cherchez les erreurs en rouge
3. Erreurs communes :
   - `Missing SUPABASE_URL` → Ajoutez la variable
   - `JWT_SECRET is not defined` → Ajoutez JWT_SECRET
   - `Table users does not exist` → Les tables doivent être créées dans Supabase

---

**Vérifiez d'abord que toutes les variables sont présentes dans Railway !** 🔑


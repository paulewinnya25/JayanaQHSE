# 🔧 Corriger l'Erreur 500 - Variables d'Environnement Railway

## ❌ Problème

L'API répond avec une erreur 500, ce qui indique un problème côté serveur (probablement les variables d'environnement manquantes ou la base de données).

---

## ✅ Solution : Vérifier les Variables d'Environnement dans Railway

### Dans Railway :

1. **Allez dans votre service** `jayana-qhse-client`

2. **Onglet "Variables"** (en haut, à côté de "Déploiements")

3. **Vérifiez que ces variables sont définies :**

#### 🔑 Variables OBLIGATOIRES :

```env
# Configuration Supabase
USE_SUPABASE=true
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo

# JWT Authentication
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
JWT_EXPIRE=7d

# Configuration serveur
PORT=5000
NODE_ENV=production

# Frontend URL (pour CORS)
FRONTEND_URL=https://jayanaqhse.netlify.app
```

#### ⚠️ Variables IMPORTANTES :

- **JWT_SECRET** : Doit être un secret long et aléatoire
- **SUPABASE_ANON_KEY** : La clé que vous avez fournie
- **USE_SUPABASE** : Doit être `true`

---

## 🔍 Si les variables manquent :

1. **Dans Railway** → Onglet "Variables"
2. **Cliquez sur "New Variable"** ou **"+"**
3. **Ajoutez chaque variable manquante**
4. **Sauvegardez** (Railway redéploiera automatiquement)

---

## 🧪 Tester après configuration

1. **Attendez que Railway redéploie** (quelques secondes)
2. **Vérifiez les logs Railway** :
   - Onglet "Logs"
   - Cherchez : `✅ Supabase connected successfully`
3. **Testez l'API** :
   ```
   https://jayana-qhse-client-production.up.railway.app/api/health
   ```

---

**Vérifiez d'abord les variables d'environnement dans Railway !** 🔑


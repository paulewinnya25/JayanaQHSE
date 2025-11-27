# 🚀 Guide Rapide - Configuration Supabase

## ✅ Configuration terminée

Votre projet est maintenant configuré pour utiliser Supabase. Voici ce qui a été fait :

### 1. Installation
- ✅ Package `@supabase/supabase-js` installé
- ✅ Configuration Supabase créée (`server/config/supabase.js`)
- ✅ Adaptateur de base de données créé (`server/config/database.js`)
- ✅ Script SQL d'initialisation créé (`server/supabase-init.sql`)

### 2. Informations de connexion Supabase

- **URL:** `https://oerdkjgkmalphmpwoymt.supabase.co`
- **Anon Key:** Configurée dans le code (peut être exposée publiquement)
- **Service Role Key:** À récupérer depuis le dashboard (gardez-la secrète)

## 📋 Étapes suivantes

### Étape 1: Créer le fichier `.env`

Dans le dossier `server/`, créez un fichier `.env` :

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Activer Supabase
USE_SUPABASE=true

# Configuration Supabase
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo

# Service Role Key (optionnel - récupérez-la depuis le dashboard)
# SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Étape 2: Créer les tables dans Supabase

1. **Ouvrez le SQL Editor de Supabase:**
   - Allez sur: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new

2. **Copiez et exécutez le script SQL:**
   - Ouvrez le fichier: `server/supabase-init.sql`
   - Copiez tout le contenu
   - Collez-le dans le SQL Editor de Supabase
   - Cliquez sur "Run" pour exécuter

3. **Vérifiez que les tables sont créées:**
   - Allez dans "Table Editor" dans le dashboard Supabase
   - Vous devriez voir toutes les tables (users, chantiers, risks, etc.)

### Étape 3: Créer l'utilisateur admin

Après avoir créé les tables, créez l'utilisateur admin :

1. **Via l'API** (recommandé):
   - Démarrez le serveur: `npm run dev`
   - Utilisez l'endpoint `/api/auth/register` pour créer l'admin
   - Ou créez-le directement dans Supabase Table Editor

2. **Mot de passe par défaut:** `admin123` (hashé avec bcrypt)

### Étape 4: Tester la connexion

Démarrez le serveur :

```bash
npm run dev
```

Vous devriez voir :
```
✅ Using Supabase database
✅ Supabase connected successfully
🚀 Jayana qhse server running on port 5000
```

## 🔐 Récupérer la Service Role Key (optionnel)

Si vous avez besoin de la Service Role Key pour les opérations admin :

1. Allez sur: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api
2. Copiez la "service_role" key (⚠️ Gardez-la secrète !)
3. Ajoutez-la dans votre `.env` :
   ```env
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
   ```

## 📚 Liens utiles

- **Dashboard Supabase:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt
- **SQL Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/editor
- **API Settings:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api

## ⚠️ Notes importantes

1. **Row Level Security (RLS):** Les tables ont RLS activé. Pour le développement, vous pouvez temporairement le désactiver ou créer des politiques permissives.

2. **Migration des routes:** Les routes actuelles utilisent des requêtes SQL directes. Elles fonctionneront avec Supabase via l'API REST, mais pour une meilleure performance, vous pouvez les adapter pour utiliser les méthodes Supabase (`.from()`, `.select()`, etc.).

3. **Backup:** N'oubliez pas de configurer les backups automatiques dans Supabase !

## 🆘 Dépannage

### Erreur: "Table does not exist"
- Vérifiez que vous avez bien exécuté le script SQL dans Supabase SQL Editor
- Vérifiez dans Table Editor que les tables sont créées

### Erreur: "Authentication failed"
- Vérifiez que votre SUPABASE_ANON_KEY est correcte dans le `.env`
- Vérifiez que USE_SUPABASE=true dans le `.env`

### Les requêtes ne fonctionnent pas
- Les requêtes SQL directes peuvent nécessiter des ajustements
- Considérez utiliser les méthodes Supabase natives (`.from()`, `.select()`, etc.)

## ✅ Prochaines étapes

1. ✅ Créer le fichier `.env` avec les variables Supabase
2. ✅ Exécuter le script SQL dans Supabase SQL Editor
3. ✅ Créer l'utilisateur admin
4. ✅ Tester la connexion
5. 🔄 (Optionnel) Adapter les routes pour utiliser les méthodes Supabase natives

---

**Votre projet est maintenant prêt à utiliser Supabase ! 🎉**


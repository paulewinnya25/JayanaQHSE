# Configuration Supabase pour Jayana QHSE

## 🔧 Configuration

Votre projet est maintenant configuré pour utiliser Supabase comme base de données.

### Informations de connexion

- **URL Supabase:** `https://oerdkjgkmalphmpwoymt.supabase.co`
- **Anon Key:** Configuré dans le code

## 📝 Étapes de configuration

### 1. Créer le fichier `.env` dans le dossier `server/`

Copiez le fichier `env.example` et créez un `.env` :

```bash
cd server
copy env.example .env
```

### 2. Configurer les variables d'environnement

Ouvrez `server/.env` et ajoutez/modifiez :

```env
# Activer Supabase
USE_SUPABASE=true

# Configuration Supabase
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo

# Optionnel: Service Role Key (pour les opérations admin)
# Récupérez-le depuis: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

### 3. Créer les tables dans Supabase

Vous devez créer les tables dans Supabase. Deux options :

#### Option A: Via le SQL Editor de Supabase (Recommandé)

1. Allez sur: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new
2. Copiez et exécutez le contenu de `server/config/initDatabase.js` converti en SQL Supabase

#### Option B: Via le script d'initialisation

Le script `server/config/initDatabase.js` peut être adapté pour Supabase, mais il est recommandé d'utiliser l'option A.

### 4. Structure des tables

Toutes les tables suivent la même structure que PostgreSQL. Les tables principales sont :

- `users` - Utilisateurs de l'application
- `chantiers` - Chantiers BTP
- `risks` - Gestion des risques
- `inspections` - Inspections
- `incidents` - Incidents et accidents
- `trainings` - Formations
- `non_conformities` - Non-conformités
- `environmental_data` - Données environnementales
- `documents` - Documents QHSE
- `equipment` - Équipements
- `maintenance_records` - Enregistrements de maintenance
- `contractors` - Sous-traitants
- `notifications` - Notifications

### 5. Vérifier la connexion

Démarrez le serveur :

```bash
cd server
npm start
```

Vous devriez voir :
```
✅ Using Supabase database
✅ Supabase connected successfully
```

## 🔐 Sécurité

- **Anon Key:** Peut être exposée côté client (déjà dans le code)
- **Service Role Key:** Ne JAMAIS exposer côté client. Gardez-la secrète dans `.env`

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new)

## ⚠️ Note importante

Les routes API actuelles utilisent des requêtes SQL directes avec PostgreSQL. Pour utiliser pleinement Supabase, les routes devront être adaptées pour utiliser les méthodes Supabase (`.from()`, `.select()`, etc.) au lieu de requêtes SQL brutes.

Cependant, Supabase supporte aussi les requêtes SQL via l'API REST, donc les routes actuelles peuvent fonctionner avec quelques ajustements.

## 🚀 Prochaines étapes

1. ✅ Créer le fichier `.env` avec les variables Supabase
2. ✅ Créer les tables dans Supabase SQL Editor
3. 🔄 Adapter les routes pour utiliser les méthodes Supabase (optionnel)
4. ✅ Tester la connexion et les fonctionnalités


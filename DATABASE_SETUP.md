# 🗄️ Configuration de la Base de Données - Jayana QHSE

## 📋 Vue d'ensemble

Votre application utilise **Supabase** comme base de données. Supabase est une alternative open-source à Firebase qui utilise PostgreSQL sous le capot.

### 🔗 Connexion Supabase

- **URL:** `https://oerdkjgkmalphmpwoymt.supabase.co`
- **Anon Key:** Déjà configurée dans le code
- **Dashboard:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt

---

## 🚀 Étape 1: Créer les tables dans Supabase

### Option A: Via le SQL Editor (RECOMMANDÉ)

1. **Accédez au SQL Editor:**
   - Allez sur: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new
   - Ou: Dashboard → SQL Editor → New Query

2. **Ouvrez le script SQL:**
   - Dans votre projet, ouvrez: `server/supabase-init.sql`
   - Copiez TOUT le contenu du fichier

3. **Exécutez le script:**
   - Collez le contenu dans le SQL Editor de Supabase
   - Cliquez sur "Run" ou "Execute" (ou Ctrl+Enter)
   - Attendez quelques secondes pour la création des tables

4. **Vérifiez les tables:**
   - Allez dans: Dashboard → Table Editor
   - Vous devriez voir toutes les tables créées:
     - ✅ users
     - ✅ chantiers
     - ✅ risks
     - ✅ inspections
     - ✅ incidents
     - ✅ trainings
     - ✅ training_participants
     - ✅ non_conformities
     - ✅ environmental_data
     - ✅ documents
     - ✅ equipment
     - ✅ maintenance_records
     - ✅ contractors
     - ✅ notifications

### Option B: Via le fichier SQL direct

Le fichier `server/supabase-init.sql` contient toutes les commandes SQL nécessaires. Il inclut:

- ✅ Création de toutes les tables
- ✅ Définition des relations (Foreign Keys)
- ✅ Configuration Row Level Security (RLS)
- ✅ Insertion d'un chantier par défaut

---

## 📊 Structure de la base de données

### Tables principales

#### 1. **users** - Utilisateurs
- Gère les utilisateurs de l'application
- Rôles: superviseur_qhse, chef_chantier, sous_traitant, etc.

#### 2. **chantiers** - Chantiers BTP
- Liste des chantiers

#### 3. **risks** - Gestion des risques
- Évaluation et suivi des risques

#### 4. **inspections** - Inspections
- Fiches d'inspection avec photos

#### 5. **incidents** - Incidents et accidents
- Déclaration d'incidents avec enquête

#### 6. **trainings** - Formations
- Plan de formation et sensibilisation

#### 7. **non_conformities** - Non-conformités
- Suivi des NC et actions correctives

#### 8. **environmental_data** - Données environnementales
- Consommations, déchets, etc.

#### 9. **documents** - GED QHSE
- Documents QHSE avec versioning

#### 10. **equipment** - Équipements
- Registre des équipements

#### 11. **maintenance_records** - Maintenance
- Historique des interventions

#### 12. **contractors** - Sous-traitants
- Registre des sous-traitants

#### 13. **notifications** - Notifications
- Système d'alertes

---

## 👤 Étape 2: Créer l'utilisateur admin

Après avoir créé les tables, vous devez créer un utilisateur admin.

### Option A: Via l'interface Supabase

1. Allez dans: Table Editor → `users`
2. Cliquez sur "Insert row"
3. Remplissez:
   - `email`: `admin@qhse.com`
   - `password`: Hash bcrypt de `admin123`
   - `first_name`: `Admin`
   - `last_name`: `QHSE`
   - `role`: `superviseur_qhse`

**⚠️ ATTENTION:** Le mot de passe doit être hashé avec bcrypt. Utilisez l'option B ci-dessous.

### Option B: Via l'API (RECOMMANDÉ)

1. Déployez d'abord votre backend
2. Créez un script temporaire pour créer l'admin:

```javascript
// create-admin.js (à créer temporairement)
const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await pool.query(`
    INSERT INTO users (email, password, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email) DO UPDATE
    SET password = EXCLUDED.password
  `, ['admin@qhse.com', hashedPassword, 'Admin', 'QHSE', 'superviseur_qhse']);
  
  console.log('✅ Admin créé: admin@qhse.com / admin123');
  process.exit(0);
}

createAdmin();
```

3. Exécutez: `node create-admin.js`

### Option C: Via SQL direct dans Supabase

1. Allez dans SQL Editor
2. Exécutez cette requête (remplacez le hash):

```sql
-- Générer le hash bcrypt de 'admin123' d'abord
-- Utilisez: node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"

INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@qhse.com',
  '$2a$10$VotreHashBcryptIci', -- Remplacez par le hash généré
  'Admin',
  'QHSE',
  'superviseur_qhse'
)
ON CONFLICT (email) DO NOTHING;
```

---

## 🔐 Étape 3: Configuration Row Level Security (RLS)

Le script SQL active RLS sur toutes les tables. Pour le développement, vous pouvez temporairement désactiver RLS:

```sql
-- Désactiver RLS temporairement (DÉVELOPPEMENT UNIQUEMENT)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chantiers DISABLE ROW LEVEL SECURITY;
-- ... etc pour toutes les tables
```

**⚠️ Pour la production, configurez des politiques RLS appropriées !**

### Créer des politiques RLS basiques

Exemple pour permettre l'accès à tous (développement):

```sql
-- Policy pour users - tous peuvent lire
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

-- Policy pour insert - tous peuvent créer
CREATE POLICY "Enable insert for all users" ON users
  FOR INSERT WITH CHECK (true);

-- Répétez pour les autres tables selon vos besoins
```

---

## ✅ Vérification

### 1. Vérifier que les tables existent

Dans Supabase Table Editor, vous devriez voir toutes les tables listées.

### 2. Vérifier la connexion depuis le backend

Après avoir déployé le backend, vérifiez les logs:

```
✅ Supabase connected successfully
```

### 3. Tester un endpoint

```
GET https://votre-api-url.com/api/health
```

Devrait retourner:
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase"
}
```

---

## 🔧 Configuration des variables d'environnement

Assurez-vous que ces variables sont configurées dans votre backend déployé:

```env
USE_SUPABASE=true
SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo
```

Pour les opérations admin, ajoutez aussi (optionnel):
```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

Récupérez la Service Role Key depuis:
https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api

---

## 📝 Checklist de configuration

- [ ] Tables créées dans Supabase (via SQL Editor)
- [ ] Utilisateur admin créé
- [ ] Variables d'environnement configurées dans le backend
- [ ] Backend déployé et connecté à Supabase
- [ ] Test de connexion réussi (`/api/health`)
- [ ] Test de connexion admin (login avec admin@qhse.com)

---

## 🆘 Dépannage

### Les tables n'apparaissent pas

1. Vérifiez que le script SQL a bien été exécuté
2. Vérifiez les logs dans Supabase SQL Editor
3. Vérifiez que vous êtes dans le bon projet Supabase

### Erreur de connexion Supabase

1. Vérifiez que `USE_SUPABASE=true` dans les variables d'environnement
2. Vérifiez que `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont corrects
3. Vérifiez les logs du backend

### Erreur "Table does not exist"

1. Exécutez le script `supabase-init.sql` dans Supabase SQL Editor
2. Vérifiez que toutes les tables sont créées dans Table Editor

---

## 📚 Ressources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt
- **SQL Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/editor
- **API Settings:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/settings/api

---

**Une fois les tables créées et l'admin configuré, votre base de données sera prête ! 🎉**


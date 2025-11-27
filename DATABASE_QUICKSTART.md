# 🗄️ Configuration Rapide de la Base de Données

## ✅ En 3 étapes simples

### Étape 1: Créer les tables dans Supabase

1. **Ouvrez le SQL Editor de Supabase:**
   🔗 https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new

2. **Copiez le script SQL:**
   - Ouvrez le fichier: `server/supabase-init.sql`
   - Sélectionnez TOUT le contenu (Ctrl+A)
   - Copiez (Ctrl+C)

3. **Exécutez dans Supabase:**
   - Collez dans le SQL Editor (Ctrl+V)
   - Cliquez sur **"Run"** (ou Ctrl+Enter)
   - ✅ Attendez la confirmation de création

4. **Vérifiez les tables:**
   - Allez dans: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/editor
   - Vous devriez voir 13 tables créées ✅

---

### Étape 2: Créer l'utilisateur admin

1. **Dans le SQL Editor de Supabase:**
   🔗 https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new

2. **Exécutez le script:**
   - Ouvrez: `CREATE_ADMIN_READY.sql`
   - Copiez-collez dans SQL Editor
   - Cliquez sur **"Run"**

3. **Vérifiez:**
   - Le script affiche l'utilisateur créé
   - Email: `admin@qhse.com`
   - Mot de passe: `admin123`

---

### Étape 3: Désactiver temporairement RLS (pour le développement)

Pour que l'application fonctionne immédiatement, désactivez RLS temporairement:

1. **Dans le SQL Editor, exécutez:**

```sql
-- Désactiver RLS temporairement (DÉVELOPPEMENT UNIQUEMENT)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chantiers DISABLE ROW LEVEL SECURITY;
ALTER TABLE risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainings DISABLE ROW LEVEL SECURITY;
ALTER TABLE training_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformities DISABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

⚠️ **Note:** Réactivez RLS en production avec des politiques appropriées !

---

## 📋 Checklist

- [ ] Tables créées (13 tables visibles dans Table Editor)
- [ ] Utilisateur admin créé (visible dans Table Editor → users)
- [ ] RLS désactivé temporairement (pour développement)
- [ ] Backend configuré avec variables Supabase
- [ ] Test de connexion réussi

---

## 🔍 Vérification

### 1. Vérifier les tables

Allez dans Table Editor: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/editor

Vous devriez voir:
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

### 2. Vérifier l'admin

Dans Table Editor → `users`:
- Cliquez sur la table `users`
- Vous devriez voir une ligne avec:
  - Email: `admin@qhse.com`
  - Role: `superviseur_qhse`

### 3. Tester la connexion

Une fois le backend déployé, testez:
```
GET https://votre-api-url.com/api/health
```

Réponse attendue:
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase"
}
```

---

## 📚 Liens rapides

- **SQL Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/editor
- **Dashboard:** https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt

---

## ✅ C'est tout !

Votre base de données est maintenant prête à être utilisée ! 🎉

Prochaines étapes:
1. Déployez le backend (voir `DEPLOY_BACKEND.md`)
2. Configurez les variables dans Netlify
3. Testez l'application !


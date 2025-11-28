# 🔧 Résoudre l'Erreur 500 lors de la Connexion

## ❌ Problème
Erreur 500 lors de la tentative de connexion sur Netlify/Railway.

## 🔍 Diagnostic

### Étape 1: Vérifier les Logs Railway

1. **Allez sur Railway Dashboard**
2. **Sélectionnez votre service backend**
3. **Onglet "Logs"**
4. **Cherchez les erreurs lors d'une tentative de connexion**

**Erreurs possibles :**
- `❌ Supabase client is null` → Variables d'environnement manquantes
- `❌ Supabase queryUser error: PGRST116` → Table `users` n'existe pas
- `❌ Error querying user with Supabase` → Problème de connexion Supabase

### Étape 2: Vérifier les Variables d'Environnement Railway

**Variables OBLIGATOIRES à vérifier dans Railway :**

1. **USE_SUPABASE**
   - Value: `true` (sans guillemets)

2. **SUPABASE_URL**
   - Value: `https://oerdkjgkmalphmpwoymt.supabase.co`

3. **SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImV4cCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`

4. **JWT_SECRET**
   - Value: Une clé secrète (ex: `votre_super_secret_jwt_key_change_in_production`)

5. **JWT_EXPIRE**
   - Value: `7d`

### Étape 3: Vérifier que la Table `users` Existe dans Supabase

1. **Allez sur Supabase Dashboard**
   - https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt

2. **Table Editor** → Vérifiez que la table `users` existe

3. **Si la table n'existe pas :**
   - Allez dans **SQL Editor**
   - Exécutez le script `CREER_TABLES_SUPABASE_MAINTENANT.sql` ou `server/supabase-init.sql`

### Étape 4: Vérifier qu'un Utilisateur Existe

1. **Dans Supabase Dashboard** → **Table Editor** → **users**
2. **Vérifiez qu'il y a au moins un utilisateur**
3. **Si aucun utilisateur :**
   - Créez un utilisateur via le SQL Editor (voir `CREATE_ADMIN_READY.sql`)

## ✅ Solutions

### Solution 1: Créer la Table `users` dans Supabase

**Si la table n'existe pas :**

1. **Ouvrez Supabase SQL Editor**
2. **Copiez et exécutez ce script :**

```sql
-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  chantier_id INTEGER,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre la lecture/écriture (à ajuster selon vos besoins)
CREATE POLICY "Enable all operations for authenticated users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. **Cliquez sur "Run"**

### Solution 2: Créer un Utilisateur Admin

**Après avoir créé la table, créez un utilisateur :**

1. **Dans Supabase SQL Editor, exécutez :**

```sql
-- Note: Le mot de passe doit être hashé avec bcrypt
-- Pour tester, vous pouvez utiliser un mot de passe déjà hashé
-- Ou créer l'utilisateur via l'API /register

-- Exemple avec mot de passe hashé (mot de passe: "admin123")
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@jayana.com',
  '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq',
  'Admin',
  'User',
  'admin'
);
```

**⚠️ IMPORTANT:** Pour créer un utilisateur avec un mot de passe réel, utilisez l'endpoint `/api/auth/register` ou hashé le mot de passe avec bcrypt.

### Solution 3: Vérifier les Variables Railway

1. **Railway Dashboard** → **Votre service** → **Variables**
2. **Vérifiez que toutes les variables sont présentes :**
   - ✅ `USE_SUPABASE=true`
   - ✅ `SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co`
   - ✅ `SUPABASE_ANON_KEY=...`
   - ✅ `JWT_SECRET=...`
   - ✅ `JWT_EXPIRE=7d`

3. **Si une variable manque, ajoutez-la**

4. **Redéployez le service** (Railway redéploie automatiquement après modification des variables)

### Solution 4: Tester l'Endpoint Health

**Testez que le backend fonctionne :**

```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Vous devriez voir :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase",
  "supabaseConfigured": true
}
```

**Si `supabaseConfigured: false` :**
- ❌ Le client Supabase n'est pas initialisé
- ✅ Vérifiez les variables d'environnement Railway

## 🧪 Test Complet

### 1. Test Health Check
```
GET https://jayana-qhse-client-production.up.railway.app/api/health
```

### 2. Test Login (avec un utilisateur existant)
```
POST https://jayana-qhse-client-production.up.railway.app/api/auth/login
Content-Type: application/json

{
  "email": "admin@jayana.com",
  "password": "votre_mot_de_passe"
}
```

## 📋 Checklist de Vérification

- [ ] Table `users` existe dans Supabase
- [ ] Au moins un utilisateur existe dans la table `users`
- [ ] Variables d'environnement Railway configurées (USE_SUPABASE, SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] JWT_SECRET configuré dans Railway
- [ ] Health check retourne `supabaseConfigured: true`
- [ ] Logs Railway ne montrent pas d'erreurs Supabase

## 🆘 Si le Problème Persiste

1. **Vérifiez les logs Railway en temps réel** pendant une tentative de connexion
2. **Copiez les erreurs exactes** des logs
3. **Vérifiez que Supabase est accessible** depuis Railway
4. **Testez avec curl ou Postman** pour voir l'erreur exacte


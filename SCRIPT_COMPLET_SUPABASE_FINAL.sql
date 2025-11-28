-- =============================================
-- SCRIPT COMPLET POUR CONFIGURER SUPABASE
-- Exécutez ce script dans Supabase SQL Editor
-- =============================================

-- 1. Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  chantier_id INTEGER,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer toutes les policies existantes
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', r.policyname);
    END LOOP;
END $$;

-- 4. Créer les nouvelles policies permissives (développement)
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- 5. Créer l'utilisateur admin (password: admin123)
-- Hash bcrypt: $2a$10$4eoOVCkbPTo9i8yR26u6RuMAgzHvrNOmVJbAO46nfs/mADPBCNhqa
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@qhse.com',
  '$2a$10$4eoOVCkbPTo9i8yR26u6RuMAgzHvrNOmVJbAO46nfs/mADPBCNhqa',
  'Admin',
  'QHSE',
  'superviseur_qhse'
)
ON CONFLICT (email) DO UPDATE
SET 
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role;

-- 6. Vérifier que tout est créé
SELECT 
  'Users table exists' as status,
  COUNT(*) as user_count
FROM users;

SELECT 
  'Admin user exists' as status,
  COUNT(*) as admin_count
FROM users 
WHERE email = 'admin@qhse.com';

-- Vous devriez voir 1 utilisateur au total, dont 1 admin



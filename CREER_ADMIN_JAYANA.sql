-- Script pour créer l'utilisateur admin avec l'email admin@jayana.com
-- EXÉCUTEZ CE SCRIPT DANS SUPABASE SQL EDITOR
-- 
-- URL SQL Editor: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new

-- ⚠️ IMPORTANT: Assurez-vous que la table users existe avant d'exécuter ce script
-- Si la table n'existe pas, exécutez d'abord CREER_TABLES_SUPABASE_MAINTENANT.sql

-- Créer l'utilisateur admin avec l'email admin@jayana.com
-- Email: admin@jayana.com
-- Mot de passe: admin123
-- Hash bcrypt: $2a$10$4eoOVCkbPTo9i8yR26u6RuMAgzHvrNOmVJbAO46nfs/mADPBCNhqa

INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@jayana.com',
  '$2a$10$4eoOVCkbPTo9i8yR26u6RuMAgzHvrNOmVJbAO46nfs/mADPBCNhqa', -- Hash de "admin123"
  'Admin',
  'Jayana',
  'superviseur_qhse'
)
ON CONFLICT (email) DO UPDATE
SET 
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role;

-- Vérifier que l'utilisateur a été créé
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE email = 'admin@jayana.com';

-- Vous devriez voir une ligne avec l'utilisateur admin


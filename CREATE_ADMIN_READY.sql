-- Script SQL pour créer l'utilisateur admin dans Supabase
-- EXÉCUTEZ CE SCRIPT DANS SUPABASE SQL EDITOR APRÈS AVOIR CRÉÉ LES TABLES
-- 
-- URL SQL Editor: https://supabase.com/dashboard/project/oerdkjgkmalphmpwoymt/sql/new

-- Créer l'utilisateur admin
-- Email: admin@qhse.com
-- Mot de passe: admin123
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

-- Vérifier que l'utilisateur a été créé
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE email = 'admin@qhse.com';

-- Vous devriez voir une ligne avec l'utilisateur admin


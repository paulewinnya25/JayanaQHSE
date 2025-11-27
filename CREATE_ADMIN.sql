-- Script SQL pour créer l'utilisateur admin dans Supabase
-- Exécutez ce script dans Supabase SQL Editor APRÈS avoir créé les tables

-- IMPORTANT: Le mot de passe doit être hashé avec bcrypt
-- Pour générer le hash, utilisez votre backend ou exécutez:
-- node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"

-- Option 1: Si vous avez déjà le hash bcrypt, remplacez-le ci-dessous
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@qhse.com',
  '$2a$10$rqJQNqJQNqJQNqJQNqJQN.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- REMPLACEZ par le hash bcrypt de 'admin123'
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

-- Option 2: Utiliser une fonction Supabase pour hasher (si disponible)
-- Note: Cette méthode nécessite que la fonction soit créée dans Supabase

-- Vérifier que l'utilisateur a été créé
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE email = 'admin@qhse.com';


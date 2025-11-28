-- Script pour créer un utilisateur de test dans Supabase
-- ⚠️ IMPORTANT: Ce script doit être exécuté dans Supabase SQL Editor
-- ⚠️ Le mot de passe sera hashé avec bcrypt côté application

-- Option 1: Créer un utilisateur via l'API (RECOMMANDÉ)
-- Utilisez l'endpoint POST /api/auth/register avec ces données:
-- {
--   "email": "admin@jayana.com",
--   "password": "admin123",
--   "first_name": "Admin",
--   "last_name": "User",
--   "role": "admin"
-- }

-- Option 2: Créer directement dans Supabase (nécessite de hasher le mot de passe)
-- Pour hasher un mot de passe, vous pouvez utiliser Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);
-- console.log(hash);

-- Exemple avec un hash pré-calculé (mot de passe: "admin123")
-- ⚠️ Remplacez le hash ci-dessous par un hash généré avec votre propre mot de passe

INSERT INTO users (email, password, first_name, last_name, role, chantier_id)
VALUES (
  'admin@jayana.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Hash de "admin123"
  'Admin',
  'User',
  'admin',
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- Vérifier que l'utilisateur a été créé
SELECT id, email, first_name, last_name, role FROM users WHERE email = 'admin@jayana.com';


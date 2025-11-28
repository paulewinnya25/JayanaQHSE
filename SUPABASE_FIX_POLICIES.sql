-- =============================================
-- Script pour corriger les policies Supabase
-- Exécutez ce script dans Supabase SQL Editor
-- =============================================

-- Supprimer toutes les policies existantes pour la table users
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', r.policyname);
    END LOOP;
END $$;

-- Créer les nouvelles policies avec des noms simples
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- Vérifier que les policies ont été créées
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'users';



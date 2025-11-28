# 🔧 Corriger les Policies Supabase - Solution Simple

## ❌ Erreur Rencontrée

```
ERROR: 42601: unterminated quoted identifier at or near ""Admins
```

Cette erreur est causée par les guillemets dans les noms de policies avec espaces.

---

## ✅ SOLUTION : Supprimer et Recréer les Policies

J'ai créé deux solutions :

### Solution 1 : Script Rapide (Recommandé)

Exécutez ce script dans Supabase SQL Editor :

```sql
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
```

**Ce script supprime automatiquement TOUTES les policies existantes et les recrée avec des noms simples.**

---

### Solution 2 : Utiliser le Fichier

Le fichier `SUPABASE_FIX_POLICIES.sql` contient le script complet. Copiez-collez-le dans Supabase SQL Editor.

---

## 📋 Étapes dans Supabase

1. **Allez dans Supabase Dashboard**
   - https://supabase.com/dashboard
   - Projet : oerdkjgkmalphmpwoymt

2. **SQL Editor** → **New query**

3. **Copiez-collez le script ci-dessus**

4. **Cliquez sur "Run"** ou `Ctrl+Enter`

5. **Vérifiez le résultat** - vous devriez voir :
   - 4 policies créées : `users_select`, `users_insert`, `users_update`, `users_delete`

---

## ✅ Après l'Exécution

Les policies seront :
- ✅ Supprimées (toutes les anciennes)
- ✅ Recréées avec des noms simples (sans espaces)
- ✅ Configurées pour permettre toutes les opérations (développement)

**Plus d'erreur de syntaxe !** 🎉

---

**Exécutez le script dans Supabase SQL Editor maintenant !** ✅



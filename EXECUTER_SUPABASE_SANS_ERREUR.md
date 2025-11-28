# 🔧 Exécuter le Script Supabase Sans Erreur

## ❌ Erreur Rencontrée

```
ERROR: 42710: policy "Users can view all users" for table "users" already exists
```

Cette erreur survient parce que les policies RLS existent déjà dans Supabase.

---

## ✅ SOLUTION : Script Corrigé

J'ai corrigé le fichier `server/supabase-init.sql` pour supprimer les policies existantes avant de les recréer.

### Option 1 : Utiliser le script corrigé

1. **Ouvrez Supabase** → SQL Editor

2. **Exécutez cette commande d'abord** pour supprimer les policies existantes :
   ```sql
   -- Supprimer les policies existantes
   DROP POLICY IF EXISTS "Users can view all users" ON users;
   DROP POLICY IF EXISTS "Admins can insert users" ON users;
   DROP POLICY IF EXISTS "Admins can update users" ON users;
   ```

3. **Ensuite, exécutez le reste du script** `server/supabase-init.sql`

---

### Option 2 : Exécuter le script complet corrigé

Le fichier `server/supabase-init.sql` a été corrigé pour inclure automatiquement les `DROP POLICY IF EXISTS` avant de créer les policies.

**Exécutez le script complet dans Supabase SQL Editor.**

---

## 📋 Pour Exécuter le Script

### Dans Supabase :

1. **Allez dans Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Sélectionnez votre projet** (oerdkjgkmalphmpwoymt)

3. **Cliquez sur "SQL Editor"** dans le menu de gauche

4. **Cliquez sur "New query"**

5. **Copiez le contenu de** `server/supabase-init.sql`

6. **Collez-le dans l'éditeur SQL**

7. **Cliquez sur "Run"** ou appuyez sur `Ctrl+Enter`

---

## ✅ Après l'Exécution

Le script va :
- ✅ Créer toutes les tables si elles n'existent pas
- ✅ Activer RLS (Row Level Security)
- ✅ Supprimer les policies existantes
- ✅ Recréer les policies correctement

**Plus d'erreur de policy déjà existante !** 🎉

---

**Le script est corrigé, vous pouvez l'exécuter maintenant !** ✅



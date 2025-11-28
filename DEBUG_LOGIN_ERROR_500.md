# 🔍 Déboguer l'Erreur 500 lors du Login

## ❌ Erreur Actuelle

```
POST https://jayana-qhse-client-production.up.railway.app/api/auth/login 500 (Internal Server Error)
```

Le serveur répond mais renvoie une erreur 500, ce qui signifie une erreur côté serveur.

---

## 🔍 Étapes de Débogage

### 1. Vérifier les Logs Railway

**Dans Railway :**

1. **Onglet "Logs"** de votre service `jayana-qhse-server`
2. **Cherchez les erreurs récentes** lors d'une tentative de login
3. **Copiez l'erreur complète** - elle devrait indiquer la cause exacte

**Erreurs communes possibles :**
- `relation "users" does not exist` → Les tables n'existent pas dans Supabase
- `no rows returned` → L'utilisateur n'existe pas
- `permission denied` → Les policies RLS bloquent l'accès
- `column does not exist` → La structure de la table est incorrecte

---

### 2. Vérifier que les Tables Existent dans Supabase

**Dans Supabase Dashboard :**

1. **Table Editor** → Vérifiez que la table `users` existe
2. Si elle n'existe pas → Exécutez le script `server/supabase-init.sql`

---

### 3. Vérifier que l'Utilisateur Admin Existe

**Dans Supabase :**

1. **Table Editor** → Table `users`
2. **Vérifiez qu'il y a un utilisateur** avec :
   - Email : `admin@qhse.com`
   - Password : doit être hashé avec bcrypt

**Si l'utilisateur n'existe pas :**
- Exécutez le script `CREATE_ADMIN_READY.sql` dans Supabase SQL Editor

---

### 4. Vérifier les Policies RLS

**Dans Supabase SQL Editor, exécutez :**

```sql
-- Vérifier les policies existantes
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'users';
```

**Si aucune policy ou policies trop restrictives :**
- Exécutez le script `SUPABASE_FIX_POLICIES.sql`

---

## 🔧 Solutions Rapides

### Solution 1 : Créer les Tables et l'Admin

1. **Exécutez dans Supabase SQL Editor :**
   - `server/supabase-init.sql` (crée les tables)
   - `SUPABASE_FIX_POLICIES.sql` (configure les policies)
   - `CREATE_ADMIN_READY.sql` (crée l'utilisateur admin)

### Solution 2 : Désactiver RLS Temporairement (DÉVELOPPEMENT)

**Dans Supabase SQL Editor :**

```sql
-- Désactiver RLS pour le développement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

⚠️ **ATTENTION : Ne faites ça que pour le développement !**

---

## 📋 Checklist

- [ ] Les logs Railway montrent quelle erreur exacte ?
- [ ] La table `users` existe dans Supabase ?
- [ ] L'utilisateur `admin@qhse.com` existe dans la table `users` ?
- [ ] Les policies RLS sont configurées correctement ?
- [ ] Le mot de passe de l'utilisateur est hashé avec bcrypt ?

---

**Regardez les logs Railway et dites-moi quelle erreur vous voyez !** 🔍




# 🔍 Résoudre l'Erreur 500 lors du Login

## ❌ Problème Actuel

- ✅ URL API correctement configurée : `https://jayana-qhse-client-production.up.railway.app/api`
- ❌ Erreur 500 lors du login : `POST /api/auth/login 500 (Internal Server Error)`

---

## 🔍 Étapes de Diagnostic

### Étape 1 : Vérifier les Logs Railway (PRIORITAIRE)

**Dans Railway :**

1. **Onglet "Logs"** de votre service `jayana-qhse-server`
2. **Tentez une connexion** depuis Netlify
3. **Cherchez les erreurs récentes** lors du login

**Logs à chercher :**
- `🔍 Querying user with Supabase: admin@qhse.com`
- `❌ Supabase queryUser error: ...`
- `❌ Error querying user with Supabase: ...`
- Ou toute autre erreur en rouge

**Copiez l'erreur complète** et partagez-la avec moi.

---

### Étape 2 : Vérifier que les Tables Existent dans Supabase

**Dans Supabase Dashboard :**

1. **Table Editor** → Vérifiez que la table `users` existe
2. **Si elle n'existe pas** → Exécutez ces scripts dans Supabase SQL Editor :
   - `server/supabase-init.sql` (crée les tables)
   - `SUPABASE_FIX_POLICIES.sql` (configure les policies)

---

### Étape 3 : Vérifier que l'Utilisateur Admin Existe

**Dans Supabase :**

1. **Table Editor** → Table `users`
2. **Vérifiez qu'il y a un utilisateur** avec email `admin@qhse.com`
3. **Si l'utilisateur n'existe pas** → Exécutez `CREATE_ADMIN_READY.sql` dans Supabase SQL Editor

---

### Étape 4 : Vérifier les Policies RLS

**Dans Supabase SQL Editor, exécutez :**

```sql
-- Vérifier les policies existantes
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'users';
```

**Si aucune policy ou policies trop restrictives :**
- Exécutez `SUPABASE_FIX_POLICIES.sql`

---

## 🔧 Solutions Rapides

### Solution 1 : Exécuter les Scripts Supabase (si pas encore fait)

**Dans Supabase SQL Editor, exécutez dans l'ordre :**

1. **`server/supabase-init.sql`** → Crée les tables
2. **`SUPABASE_FIX_POLICIES.sql`** → Configure les policies RLS
3. **`CREATE_ADMIN_READY.sql`** → Crée l'utilisateur admin

---

### Solution 2 : Vérifier les Logs Railway

**Dans Railway → Logs, lors d'une tentative de login, vous devriez voir :**

**Si tout va bien :**
- `🔍 Querying user with Supabase: admin@qhse.com`
- `✅ User found with Supabase: yes` (ou `no` si l'utilisateur n'existe pas)

**Si problème :**
- `❌ Supabase queryUser error: ...` → Vérifiez les tables et policies
- `ECONNREFUSED ::1:5432` → Le code utilise encore PostgreSQL
- Autre erreur → Partagez l'erreur complète

---

## 📋 Checklist

- [ ] Les logs Railway montrent quelle erreur exacte ?
- [ ] La table `users` existe dans Supabase ?
- [ ] L'utilisateur `admin@qhse.com` existe dans la table `users` ?
- [ ] Les policies RLS sont configurées ?
- [ ] Les scripts Supabase ont été exécutés ?

---

## 🎯 Action Immédiate

1. **Regardez les logs Railway** lors d'une tentative de login
2. **Copiez l'erreur complète**
3. **Vérifiez dans Supabase** que les tables et l'utilisateur existent
4. **Partagez les informations** avec moi

---

**Regardez les logs Railway et vérifiez Supabase. Dites-moi ce que vous voyez !** 🔍



# 📋 Script Complet pour Configurer Supabase

## 📝 Scripts à Exécuter dans Supabase SQL Editor (dans l'ordre)

### 1. Créer les Tables

**Fichier :** `server/supabase-init.sql`

Copiez-collez tout le contenu dans Supabase SQL Editor et exécutez.

---

### 2. Configurer les Policies RLS

**Fichier :** `SUPABASE_FIX_POLICIES.sql`

Exécutez ce script pour configurer les policies.

---

### 3. Créer l'Utilisateur Admin

**Fichier :** `CREATE_ADMIN_READY.sql`

Exécutez ce script pour créer l'utilisateur admin :
- Email : `admin@qhse.com`
- Mot de passe : `admin123`

---

## ✅ Après avoir Exécuté les 3 Scripts

1. **Vérifiez dans Supabase Table Editor** :
   - Table `users` existe
   - Utilisateur `admin@qhse.com` existe

2. **Testez la connexion** :
   - Ouvrez votre site Netlify
   - Connectez-vous avec `admin@qhse.com` / `admin123`

---

**Exécutez ces 3 scripts dans Supabase SQL Editor maintenant !** ✅



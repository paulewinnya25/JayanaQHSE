# 🔍 Résoudre l'Erreur 500 lors du Login

## ❌ Problème

Erreur 500 lors du login : `POST /api/auth/login 500 (Internal Server Error)`

---

## 🔍 Diagnostic

### 1. Vérifier les Logs Railway (PRIORITAIRE)

**Pendant que vous tentez de vous connecter :**

1. **Ouvrez Railway → Logs** (onglet "Logs")
2. **Tentez une connexion** depuis Netlify
3. **Regardez les logs en temps réel**

**Vous devriez voir :**
- `📥 POST /api/auth/login`
- `🔐 Login attempt received: admin@qhse.com`
- `🔍 Querying user for login: admin@qhse.com`

**Ou des erreurs comme :**
- `❌ Supabase queryUser error: ...`
- `relation "users" does not exist` → Les tables n'existent pas
- `no rows returned` → L'utilisateur n'existe pas
- `permission denied` → Problème de policies RLS

**Copiez l'erreur complète** des logs Railway et partagez-la avec moi.

---

## 🔧 Solution : Créer les Tables dans Supabase

**Si les tables n'existent pas, vous verrez l'erreur dans les logs Railway.**

### Dans Supabase SQL Editor :

1. **Ouvrez Supabase Dashboard** → SQL Editor
2. **Copiez le contenu de** `SCRIPT_COMPLET_SUPABASE_FINAL.sql`
3. **Collez dans Supabase SQL Editor**
4. **Exécutez** → Les tables et l'utilisateur seront créés

---

## 📋 Checklist

- [ ] Script SQL exécuté dans Supabase
- [ ] Table `users` existe dans Supabase Table Editor
- [ ] Utilisateur `admin@qhse.com` existe
- [ ] Logs Railway consultés lors du login
- [ ] Erreur spécifique identifiée dans les logs

---

## 🎯 Action Immédiate

1. **Regardez les logs Railway** pendant que vous tentez de vous connecter
2. **Copiez l'erreur complète**
3. **Exécutez le script SQL** dans Supabase si les tables n'existent pas
4. **Partagez les logs** avec moi

---

**Regardez les logs Railway maintenant pendant une tentative de login !** 🔍




# 🧪 Tester Après Redéploiement

## ✅ Corrections Appliquées

J'ai forcé `getDatabaseType()` à retourner 'supabase' quand Supabase est configuré.

---

## 🔄 Attendre le Redéploiement

Railway va redéployer automatiquement. **Attendez 1-2 minutes**.

---

## 🧪 Tests à Effectuer

### Test 1 : Health Check

**Ouvrez dans votre navigateur :**
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Vous devriez maintenant voir :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase",
  "supabaseConfigured": true,
  "environment": {
    "USE_SUPABASE": "true",
    "SUPABASE_URL": "SET"
  }
}
```

✅ **Si vous voyez `"database": "supabase"` → C'est bon !**

---

### Test 2 : Vérifier les Logs Railway

**Dans Railway → Logs, lors d'un appel à `/api/health` :**

Vous devriez voir :
- `🏥 Health check:` avec les détails

---

### Test 3 : Créer les Tables dans Supabase

**Si `/api/health` retourne `"database": "supabase"` :**

1. **Dans Supabase SQL Editor**, exécutez `SCRIPT_COMPLET_SUPABASE_FINAL.sql`
2. Cela créera :
   - La table `users`
   - Les policies RLS
   - L'utilisateur admin

---

### Test 4 : Tester le Login

**Après avoir créé les tables et l'utilisateur :**

1. **Ouvrez** https://jayanaqhseapp.netlify.app/login
2. **Connectez-vous avec :**
   - Email : `admin@qhse.com`
   - Mot de passe : `admin123`

---

## 📋 Checklist

- [ ] Attendu le redéploiement (1-2 minutes)
- [ ] Testé `/api/health` → `"database": "supabase"`
- [ ] Exécuté `SCRIPT_COMPLET_SUPABASE_FINAL.sql` dans Supabase
- [ ] Testé le login sur Netlify

---

**Attendez le redéploiement et testez `/api/health` à nouveau !** 🚀



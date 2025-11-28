# 🔍 Déboguer le Health Check

## ❌ Problème

L'endpoint `/api/health` retourne toujours `"database":"postgresql"` même si Supabase est configuré.

---

## 🔍 Diagnostic

### 1. Vérifier les Logs Railway lors d'un Health Check

**Faites ceci :**

1. **Ouvrez** `https://jayana-qhse-client-production.up.railway.app/api/health` dans votre navigateur
2. **En même temps, regardez les logs Railway** → Onglet "Logs"
3. **Cherchez le log :** `🏥 Health check:` avec les détails

**Le log devrait montrer :**
- `dbType:` → doit être `supabase`
- `hasSupabase:` → doit être `true`
- `supabaseClientAvailable:` → doit être `true`

**Si vous voyez :**
- `hasSupabase: false` → Le client Supabase n'est pas disponible
- `supabaseClientAvailable: false` → Problème d'initialisation

---

### 2. Vérifier la Réponse Complète

**L'endpoint `/api/health` devrait maintenant retourner :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase",
  "supabaseConfigured": true,
  "environment": {
    "USE_SUPABASE": "true",
    "SUPABASE_URL": "SET",
    "SUPABASE_ANON_KEY": "SET"
  }
}
```

**Copiez la réponse complète** et partagez-la avec moi.

---

### 3. Vérifier les Variables d'Environnement

**Dans Railway → Variables, vérifiez :**

- `USE_SUPABASE` = `true` (sans guillemets)
- `SUPABASE_URL` = `https://oerdkjgkmalphmpwoymt.supabase.co`
- `SUPABASE_ANON_KEY` = (la clé complète)

---

## 🔧 Solution Alternative : Ignorer le Health Check

**Le plus important est que le LOGIN fonctionne !**

Même si le health check dit "postgresql", si :
- ✅ Les logs montrent `✅ Using Supabase database`
- ✅ Supabase est initialisé
- ✅ Le login utilise Supabase (pas d'erreur PostgreSQL)

**Alors tout fonctionne correctement !**

---

## 📋 Action Immédiate

1. **Ouvrez** `/api/health` dans votre navigateur
2. **Regardez les logs Railway** en même temps
3. **Copiez :**
   - La réponse JSON complète de `/api/health`
   - Les logs Railway avec `🏥 Health check:`

**Partagez ces informations avec moi !** 🔍




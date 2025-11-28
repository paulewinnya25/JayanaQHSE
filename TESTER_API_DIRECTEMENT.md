# 🧪 Tester l'API Directement

## 🔍 Test 1 : Health Check

**Ouvrez dans votre navigateur :**
```
https://jayana-qhse-client-production.up.railway.app/api/health
```

**Résultat attendu :**
```json
{
  "status": "OK",
  "message": "Jayana qhse API is running",
  "database": "supabase"
}
```

**Si ça fonctionne →** Le serveur fonctionne ! ✅

**Si ça ne fonctionne pas →** Le serveur ne démarre pas, vérifiez les logs Railway.

---

## 🔍 Test 2 : Test de Login Direct (avec curl ou Postman)

**Si vous avez curl installé :**

```bash
curl -X POST https://jayana-qhse-client-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qhse.com","password":"admin123"}'
```

**Ou utilisez Postman :**
- Method : `POST`
- URL : `https://jayana-qhse-client-production.up.railway.app/api/auth/login`
- Headers : `Content-Type: application/json`
- Body (raw JSON) :
  ```json
  {
    "email": "admin@qhse.com",
    "password": "admin123"
  }
  ```

**Résultat attendu :**
```json
{
  "token": "...",
  "user": {
    "id": 1,
    "email": "admin@qhse.com",
    ...
  }
}
```

---

## 🔍 Test 3 : Vérifier les Logs Railway

**Pendant que vous testez :**

1. **Ouvrez Railway → Logs**
2. **Regardez en temps réel**
3. **Vous devriez voir :**
   - `📥 POST /api/auth/login`
   - `🔐 Login attempt received: ...`
   - `🔍 Querying user for login: ...`

---

**Testez `/api/health` d'abord pour vérifier que le serveur fonctionne !** 🚀




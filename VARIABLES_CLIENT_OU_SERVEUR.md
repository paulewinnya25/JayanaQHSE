# 📍 Où Configurer les Variables d'Environnement

## 🎯 Réponse Rapide

**Les variables que je vous ai données sont pour le SERVEUR (Railway - Backend) !**

---

## 🔴 SERVEUR (Railway - Backend)

### Où : Railway → Votre service `jayana-qhse-server` → Onglet "Variables"

### Variables à ajouter dans Railway :

1. `USE_SUPABASE=true`
2. `SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co`
3. `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (la longue clé)
4. `JWT_SECRET=jayana_qhse_jwt_secret_2024_super_secure_key_change_in_production`
5. `JWT_EXPIRE=7d`
6. `PORT=5000`
7. `NODE_ENV=production`
8. `FRONTEND_URL=https://jayanaqhse.netlify.app`

**Ces variables sont utilisées par le backend pour :**
- Se connecter à Supabase
- Générer les tokens JWT
- Configurer le serveur

---

## 🟢 CLIENT (Netlify - Frontend)

### Où : Netlify → Votre site → Site settings → Environment variables

### Variable déjà configurée :

- `REACT_APP_API_URL` = `https://jayana-qhse-client-production.up.railway.app/api`

**Cette variable est utilisée par le frontend pour :**
- Appeler l'API backend
- Envoyer les requêtes HTTP

---

## 📋 Résumé

| Variable | Où ? | Pourquoi ? |
|----------|------|------------|
| `USE_SUPABASE`, `SUPABASE_URL`, etc. | **Railway (Serveur)** | Backend se connecte à Supabase |
| `JWT_SECRET`, `JWT_EXPIRE` | **Railway (Serveur)** | Backend génère les tokens |
| `REACT_APP_API_URL` | **Netlify (Client)** | Frontend appelle l'API |

---

## ✅ Action Immédiate

**Allez dans Railway → `jayana-qhse-server` → Onglet "Variables"**  
**Ajoutez les 8 variables listées ci-dessus !**

---

**Les variables sont pour le SERVEUR (Railway) ! 🚀**


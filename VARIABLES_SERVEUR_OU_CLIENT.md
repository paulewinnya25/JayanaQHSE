# 📍 Variables d'Environnement - Serveur ou Client ?

## 🎯 Réponse Rapide

**Les variables Supabase doivent être configurées CÔTÉ SERVEUR (Railway), PAS côté client (Netlify).**

## 🔴 Variables CÔTÉ SERVEUR (Railway)

Ces variables sont utilisées par le **backend** qui tourne sur Railway :

### Variables OBLIGATOIRES dans Railway :

1. **USE_SUPABASE**
   - **Key:** `USE_SUPABASE`
   - **Value:** `true`
   - **Où:** Railway Dashboard → Votre service backend → Variables

2. **SUPABASE_URL**
   - **Key:** `SUPABASE_URL`
   - **Value:** `https://oerdkjgkmalphmpwoymt.supabase.co`
   - **Où:** Railway Dashboard → Votre service backend → Variables

3. **SUPABASE_ANON_KEY**
   - **Key:** `SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmRramdrbWFscGhtcHdveW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjUzMDcsImVpxcCI6MjA3OTc0MTMwN30.vJfjjWR3c3dDoPmpKtUJppV4cuuBTx51pZl-2jhI7Fo`
   - **Où:** Railway Dashboard → Votre service backend → Variables

4. **JWT_SECRET**
   - **Key:** `JWT_SECRET`
   - **Value:** `votre_super_secret_jwt_key`
   - **Où:** Railway Dashboard → Votre service backend → Variables

5. **JWT_EXPIRE**
   - **Key:** `JWT_EXPIRE`
   - **Value:** `7d`
   - **Où:** Railway Dashboard → Votre service backend → Variables

## 🟢 Variables CÔTÉ CLIENT (Netlify)

Ces variables sont utilisées par le **frontend React** qui tourne sur Netlify :

### Variable OBLIGATOIRE dans Netlify :

1. **REACT_APP_API_URL**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://jayana-qhse-client-production.up.railway.app/api`
   - **Où:** Netlify Dashboard → Votre site → Environment variables

## 📊 Tableau Récapitulatif

| Variable | Où ? | Pourquoi ? |
|----------|------|------------|
| `USE_SUPABASE` | **Railway** | Le backend utilise Supabase pour la base de données |
| `SUPABASE_URL` | **Railway** | Le backend se connecte à Supabase |
| `SUPABASE_ANON_KEY` | **Railway** | Le backend s'authentifie auprès de Supabase |
| `JWT_SECRET` | **Railway** | Le backend génère les tokens JWT |
| `JWT_EXPIRE` | **Railway** | Durée de validité des tokens |
| `REACT_APP_API_URL` | **Netlify** | Le frontend sait où envoyer les requêtes API |

## 🚨 Problème Actuel

D'après les logs, les variables **ne sont PAS configurées dans Railway** :

```
USE_SUPABASE : indéfini
SUPABASE_URL : NON RÉGLÉ
SUPABASE_ANON_KEY : NON RÉGLÉ
```

## ✅ Solution

**Configurez les variables dans Railway (côté serveur) :**

1. **Railway Dashboard** → https://railway.app
2. **Votre projet** → **Service backend**
3. **Variables** (onglet en haut)
4. **Ajoutez les 5 variables** listées ci-dessus
5. **Railway redéploie automatiquement**

## 📋 Checklist

### Railway (Backend) :
- [ ] `USE_SUPABASE=true`
- [ ] `SUPABASE_URL=https://oerdkjgkmalphmpwoymt.supabase.co`
- [ ] `SUPABASE_ANON_KEY=...`
- [ ] `JWT_SECRET=...`
- [ ] `JWT_EXPIRE=7d`

### Netlify (Frontend) :
- [ ] `REACT_APP_API_URL=https://jayana-qhse-client-production.up.railway.app/api`

## 🎯 Résumé

- **Railway = Backend = Variables Supabase + JWT**
- **Netlify = Frontend = Variable API URL uniquement**

Les variables Supabase doivent être dans **Railway**, pas dans Netlify !



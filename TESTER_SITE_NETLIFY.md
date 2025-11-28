# 🧪 Tester le Site Netlify

## 🌐 Votre Site

**URL :** https://jayanaqhseapp.netlify.app/login

---

## 📋 Tests à Effectuer

### Test 1 : Vérifier que le Site Charge

1. **Ouvrez** https://jayanaqhseapp.netlify.app/login
2. **Vérifiez que la page de connexion s'affiche**

---

### Test 2 : Vérifier l'URL de l'API

1. **Ouvrez la console du navigateur** (F12)
2. **Regardez les logs** au chargement de la page
3. **Vous devriez voir :** `🔗 API URL configured: https://jayana-qhse-client-production.up.railway.app/api`

**Si vous voyez une autre URL ou une erreur →** Vérifiez `REACT_APP_API_URL` dans Netlify

---

### Test 3 : Tester la Connexion

**Dans Netlify :**
- Email : `admin@qhse.com`
- Mot de passe : `admin123`

**Dans la console (F12), regardez :**
- Si la connexion réussit
- Les erreurs éventuelles

---

### Test 4 : Vérifier les Erreurs

**Si vous voyez des erreurs dans la console :**

1. **Copiez l'erreur complète**
2. **Vérifiez :**
   - L'URL de l'API dans les logs
   - Les erreurs réseau
   - Les erreurs 500

---

## 🔧 Configuration Netlify à Vérifier

### Variable d'Environnement Requise

**Dans Netlify → Environment variables :**
- **Variable :** `REACT_APP_API_URL`
- **Valeur :** `https://jayana-qhse-client-production.up.railway.app/api`

---

## ✅ Si Tout Fonctionne

1. ✅ Le site charge
2. ✅ La connexion fonctionne
3. ✅ Vous êtes redirigé vers le dashboard

**Alors tout est connecté et fonctionnel ! 🎉**

---

**Ouvrez votre site et testez la connexion ! Dites-moi ce que vous voyez.** 🚀




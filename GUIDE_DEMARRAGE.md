# Guide de Démarrage Rapide - Jayana qhse

## 🚀 Démarrage en 5 minutes

### 1. Prérequis
- Node.js installé (v14+)
- PostgreSQL installé et démarré
- npm ou yarn

### 2. Installation

```bash
# Cloner ou naviguer dans le projet
cd "projet AYAH"

# Installer toutes les dépendances
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. Configuration de la base de données

```sql
-- Se connecter à PostgreSQL et créer la base
CREATE DATABASE qhse_db;
```

### 4. Configuration de l'environnement

```bash
# Dans le dossier server, créer un fichier .env
cd server
copy env.example .env
# (ou sur Linux/Mac: cp env.example .env)

# Modifier les paramètres dans .env si nécessaire
# Par défaut:
# DB_NAME=qhse_db
# DB_USER=postgres
# DB_PASSWORD=postgres
```

### 5. Démarrage

```bash
# Depuis la racine du projet
npm run dev

# Ou séparément:
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

### 6. Accès à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Compte par défaut**:
  - Email: `admin@qhse.com`
  - Mot de passe: `admin123`

## 📝 Premiers pas

1. Se connecter avec le compte admin
2. Explorer le tableau de bord
3. Créer un premier risque, inspection ou incident
4. Consulter les différents modules

## 🔧 Dépannage

### Erreur de connexion à la base de données
- Vérifier que PostgreSQL est démarré
- Vérifier les paramètres dans `server/.env`
- Vérifier que la base `qhse_db` existe

### Erreur "Module not found"
- Exécuter `npm install` dans chaque dossier (root, server, client)

### Port déjà utilisé
- Modifier le PORT dans `server/.env` (backend)
- Ou modifier le port dans `client/package.json` (frontend)

## 📚 Documentation complète

Voir le fichier `README.md` pour la documentation complète.






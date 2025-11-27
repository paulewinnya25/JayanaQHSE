# Jayana QHSE - Application de Gestion QHSE pour Chantiers BTP

Application web complète de gestion QHSE (Qualité, Hygiène, Sécurité, Environnement) destinée aux chantiers de BTP. Cette application permet le suivi des activités QHSE, la gestion des risques et incidents, le reporting automatique et la collaboration entre les différents intervenants.

## 🚀 Fonctionnalités

### Modules Principaux

- ✅ **Tableau de bord global** - Vue synthétique avec KPIs en temps réel
- ✅ **Gestion des risques** - Registre des dangers, évaluation et suivi
- ✅ **Contrôles et inspections** - Fiches d'inspection personnalisables avec photos
- ✅ **Incidents et accidents** - Déclaration numérique avec enquête automatisée
- ✅ **Formations et sensibilisation** - Gestion du plan de formation et habilitations
- ✅ **Non-conformités** - Workflow de validation et suivi des actions correctives
- ✅ **Suivi environnemental** - Gestion des déchets et consommations
- ✅ **Maintenance** - Registre des équipements et échéances
- ✅ **Gestion des sous-traitants** - Registre et habilitations
- ✅ **Gestion documentaire (GED)** - Stockage, versioning et validation
- ✅ **Reporting et statistiques** - Rapports automatiques avec graphiques

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/paulewinnya25/JayanaQHSE.git
cd JayanaQHSE
```

### 2. Installer les dépendances

```bash
# Installer toutes les dépendances (client + server)
npm install
```

### 3. Configuration de la base de données

Créer la base de données PostgreSQL :

```sql
CREATE DATABASE qhse_db;
```

### 4. Configuration de l'environnement

Copier le fichier d'exemple et configurer les variables :

```bash
cd server
copy env.example .env
# (ou sur Linux/Mac: cp env.example .env)
```

Modifier les paramètres dans `server/.env` :

```env
DB_NAME=qhse_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
PORT=5000
JWT_SECRET=votre_secret_jwt
```

### 5. Initialiser la base de données

La base de données s'initialise automatiquement au premier démarrage du serveur.

## 🚀 Démarrage

### Démarrage en mode développement

Depuis la racine du projet :

```bash
npm run dev
```

Cette commande démarre simultanément :
- Le serveur backend sur `http://localhost:5000`
- Le client frontend sur `http://localhost:3000`

### Démarrage séparé

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 🔐 Compte par défaut

- **Email:** `admin@qhse.com`
- **Mot de passe:** `admin123`

## 📁 Structure du projet

```
JayanaQHSE/
├── client/                 # Application React frontend
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Contextes React (Auth, etc.)
│   │   └── utils/         # Utilitaires
│   └── public/
├── server/                 # API Node.js/Express backend
│   ├── config/            # Configuration (DB, etc.)
│   ├── routes/            # Routes API
│   ├── middleware/        # Middlewares (auth, etc.)
│   └── index.js           # Point d'entrée
└── package.json           # Configuration monorepo
```

## 🔧 Technologies utilisées

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Recharts (graphiques)
- React Toastify

### Backend
- Node.js
- Express
- PostgreSQL
- JWT (authentification)
- bcryptjs (hashage des mots de passe)
- dotenv (variables d'environnement)

## 📊 Architecture

- **Architecture:** Monorepo avec workspaces npm
- **Base de données:** PostgreSQL avec schéma relationnel
- **Authentification:** JWT avec rôles utilisateurs
- **API:** RESTful avec Express

## 👥 Rôles utilisateurs

- **Superviseur QHSE** - Accès complet à tous les modules
- **Chef de chantier** - Accès aux risques, inspections, non-conformités
- **Sous-traitant** - Déclaration d'incidents, suivi formations
- **Direction** - Consultation des rapports consolidés
- **Agent de maintenance** - Accès au module maintenance

## 📝 Documentation

Voir `GUIDE_DEMARRAGE.md` pour un guide de démarrage rapide.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est privé.

## 👨‍💻 Auteur

**paulewinnya25**

## 🔗 Liens

- [Repository GitHub](https://github.com/paulewinnya25/JayanaQHSE)

---

**Note:** Assurez-vous de configurer correctement les variables d'environnement avant de démarrer l'application, notamment les identifiants de la base de données.


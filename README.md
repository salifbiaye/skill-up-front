# Skill-Up Frontend

![Skill-Up Logo](https://img.shields.io/badge/Skill--Up-Frontend-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-61dafb)

Frontend de l'application Skill-Up, une plateforme de développement personnel permettant de gérer objectifs, tâches et notes d'apprentissage avec intégration IA.

## ✨ Fonctionnalités

- **Gestion de notes** avec support Markdown et export PDF
- **Gestion d'objectifs personnels** avec suivi de progression
- **Gestion de tâches** liées aux objectifs
- **Chat IA** pour l'assistance et l'apprentissage
- **Profil utilisateur** avec statistiques et suivi de progression
- **Thèmes personnalisables** pour l'export PDF
- **Interface responsive** adaptée à tous les appareils

## 📸 Captures d'écran

### Page d'accueil

![Landing Page](public/screenshots/landing-page.png)
*Page d'accueil de l'application SkillUp*

### Tableau de bord

![Dashboard](public/screenshots/dashboard.png)
*Tableau de bord utilisateur avec suivi des objectifs et tâches*

### Chat IA

![AI Chat](public/screenshots/ai-chat.png)
*Interface de chat IA pour l'assistance à l'apprentissage*

## 💻 Architecture

Application Next.js organisée en modules fonctionnels :

```
src/
├── components/    # Composants réutilisables
├── features/      # Modules fonctionnels
│   ├── ai-chat/     # Assistant IA
│   ├── auth/        # Authentification
│   ├── notes/       # Notes
│   ├── objectives/  # Objectifs
│   ├── profile/     # Profil utilisateur
│   └── tasks/       # Tâches
├── services/      # Services API
├── stores/        # Gestion d'état (Zustand)
├── types/         # Types TypeScript
├── utils/         # Utilitaires
└── app/           # Routes Next.js
```

## 🤖 Services principaux

L'application frontend est construite avec les technologies suivantes :

1. **Interface utilisateur** : Application Next.js moderne et responsive
2. **Gestion d'état** : Zustand pour une gestion d'état efficace et réactive
3. **Services API** : Communication avec l'API via des services dédiés

## 🔧 Technologies

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Zustand (gestion d'état)
- Sonner (notifications)
- React PDF
- Docker

## 📚 API Principales

- **Auth** : `/api/auth/login`, `/api/auth/register`
- **Objectifs** : `/api/goals`
- **Tâches** : `/api/tasks`
- **Notes** : `/api/notes`
- **Profil** : `/api/profile`
- **Chat** : `/api/chat-sessions`

## 📖 Documentation

Consultez la [documentation complète de l'API](docs/api-documentation.md) pour plus d'informations sur :
- Les endpoints disponibles
- Les méthodes HTTP supportées
- Les formats de requêtes et de réponses

### Points clés de l'API

- **URL de base** : `http://backend:8080/api` ou la valeur de `NEXT_PUBLIC_API_URL`
- **Authentification** : JWT via l'en-tête `Authorization: Bearer {token}`

## 🔍 Prérequis

- Node.js 18+
- npm ou yarn
- Git

## 🚀 Développement

### Installation et démarrage

```bash
# Cloner le dépôt
git clone https://github.com/salifbiaye/skill-up-front.git
cd skillup

# run le docker-compose.yml
docker compose up -d
```

L'application sera accessible à l'adresse : http://localhost:3000

> **Note** : Assurez-vous que tous les ports nécessaires (3000 pour le frontend, 8080 pour le backend) sont disponibles sur votre machine.


> **Note** : Pour les détails sur le déploiement en production et la conteneurisation, consultez le [rapport DevOps](docs/rapport-devops.md).


## 📖 Documentation

Consultez la [documentation complète](docs/index.md) pour plus d'informations sur :
- [Rapport Frontend](docs/rapport-frontend.md)
- [Configuration DevOps](docs/rapport-devops.md) par Salif Biaye
- [Rapport Workflow](docs/rapport-workflow.md)
- [Documentation API](docs/api-documentation.md)

## 👥 Équipe

Projet réalisé par :
- **Youssoupha Mbaye** - Lead Frontend
- **Tening Sene** - Développeuse Frontend
- **Salif Biaye** - DevOps

## Conclusion

Skill-Up Frontend offre une interface utilisateur moderne, intuitive et réactive pour la gestion de l'apprentissage et du développement personnel. Grâce à son architecture modulaire et ses fonctionnalités avancées, l'application permet aux utilisateurs de gérer efficacement leurs objectifs, tâches et notes.

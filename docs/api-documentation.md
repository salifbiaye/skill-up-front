# Documentation API SkillUp

Ce document présente l'ensemble des API utilisées dans l'application SkillUp, leurs endpoints, méthodes HTTP, paramètres et descriptions.

## URL de base

```
http://backend:8080/api
```

Ou l'URL spécifiée dans la variable d'environnement `NEXT_PUBLIC_API_URL`.

## Authentification

Toutes les requêtes authentifiées nécessitent un token JWT dans l'en-tête `Authorization` au format:

```
Authorization: Bearer {token}
```

## Endpoints API

### Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/auth/login` | POST | Authentifie un utilisateur et retourne un token JWT |
| `/auth/register` | POST | Inscrit un nouvel utilisateur |
| `/auth/refresh-token` | POST | Rafraîchit un token JWT expiré |

#### Détails des requêtes

##### POST /auth/login
**Corps de la requête:**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse"
}
```

**Réponse:**
```json
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "user_id",
    "email": "utilisateur@exemple.com",
    "name": "Nom Utilisateur"
  }
}
```

##### POST /auth/register
**Corps de la requête:**
```json
{
  "email": "nouvel.utilisateur@exemple.com",
  "password": "motdepasse",
  "name": "Nom Complet"
}
```

**Réponse:**
```json
{
  "id": "user_id",
  "email": "nouvel.utilisateur@exemple.com",
  "name": "Nom Complet"
}
```

### Notes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/notes` | GET | Récupère toutes les notes de l'utilisateur |
| `/notes` | POST | Crée une nouvelle note |
| `/notes/{id}` | GET | Récupère une note spécifique |
| `/notes/{id}` | PUT | Met à jour une note existante |
| `/notes/{id}` | DELETE | Supprime une note |
| `/notes/{id}/ai-summary` | GET | Génère un résumé IA d'une note |

### Objectifs (Goals)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/goals` | GET | Récupère tous les objectifs de l'utilisateur |
| `/goals` | POST | Crée un nouvel objectif |
| `/goals/{id}` | GET | Récupère un objectif spécifique |
| `/goals/{id}` | PUT | Met à jour un objectif existant |
| `/goals/{id}` | DELETE | Supprime un objectif |
| `/goals/{id}/progress` | GET | Récupère la progression d'un objectif |
| `/goals/{id}/status` | GET | Récupère le statut d'un objectif |

### Tâches (Tasks)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/tasks` | GET | Récupère toutes les tâches de l'utilisateur |
| `/tasks` | POST | Crée une nouvelle tâche |
| `/tasks/{id}` | GET | Récupère une tâche spécifique |
| `/tasks/{id}` | PUT | Met à jour une tâche existante |
| `/tasks/{id}` | DELETE | Supprime une tâche |
| `/tasks/{id}/status` | GET | Récupère le statut d'une tâche |
| `/tasks/{id}/status` | PUT | Met à jour le statut d'une tâche |

### Sessions de Chat IA

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/chat-sessions` | GET | Récupère toutes les sessions de chat |
| `/chat-sessions` | POST | Crée une nouvelle session de chat |
| `/chat-sessions/{id}` | GET | Récupère une session de chat spécifique |
| `/chat-sessions/{id}` | PUT | Met à jour une session de chat |
| `/chat-sessions/{id}` | DELETE | Supprime une session de chat |
| `/chat-sessions/{id}/messages` | GET | Récupère les messages d'une session de chat |
| `/chat-sessions/{id}/messages` | POST | Ajoute un message à une session de chat |
| `/chat-sessions/{id}/ai-response` | POST | Génère une réponse IA à un message utilisateur |

#### Détails des requêtes pour les sessions de chat

##### POST /chat-sessions
**Corps de la requête:**
```json
{
  "title": "Nouvelle session",
  "initialMessage": "Bonjour, comment puis-je vous aider ?"
}
```

##### POST /chat-sessions/{id}/messages
**Corps de la requête:**
```json
{
  "content": "Contenu du message",
  "role": "user",
  "type": "text",
  "metadata": {
    "noteId": "id_de_la_note",
    "noteTitle": "Titre de la note",
    "noteContent": "Contenu de la note"
  }
}
```

**Réponse:**
```json
{
  "id": "message_id",
  "sessionId": "session_id",
  "content": "Contenu du message",
  "role": "user",
  "timestamp": "2025-05-28T11:04:30Z",
  "type": "text",
  "metadata": {
    "noteId": "id_de_la_note",
    "noteTitle": "Titre de la note",
    "noteContent": "Contenu de la note"
  }
}
```

### Profil Utilisateur

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/profile` | GET | Récupère le profil de l'utilisateur |
| `/profile` | PUT | Met à jour le profil de l'utilisateur |
| `/profile/change-password` | POST | Change le mot de passe de l'utilisateur |
| `/profile/achievements` | GET | Récupère les réalisations de l'utilisateur |

## Codes de statut HTTP

| Code | Description |
|------|-------------|
| 200 | OK - La requête a réussi |
| 201 | Created - La ressource a été créée |
| 400 | Bad Request - La requête est invalide |
| 401 | Unauthorized - Authentification requise |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

## Gestion des erreurs

Toutes les réponses d'erreur suivent le format:

```json
{
  "message": "Description de l'erreur",
  "status": 400,
  "timestamp": "2025-05-28T11:04:30Z"
}
```

# API Endpoints pour SkillUp

Ce document décrit tous les endpoints API nécessaires pour l'application SkillUp, avec les formats JSON requis pour les requêtes et les réponses.

## Table des matières

- [Authentification](#authentification)
- [Notes](#notes)
- [Objectifs](#objectifs)
- [Tâches](#tâches)
- [Chat IA](#chat-ia)
- [Profil](#profil)

## Authentification

### Connexion

- **URL** : `/auth/login`
- **Méthode** : `POST`
- **Authentification requise** : Non

**Corps de la requête** :

```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123"
}
```

**Réponse réussie** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "utilisateur@exemple.com",
    "name": "Jean Dupont"
  }
}
```

**Codes de réponse** :
- `200 OK` : Connexion réussie
- `401 Unauthorized` : Identifiants invalides
- `500 Internal Server Error` : Erreur serveur

### Inscription

- **URL** : `/auth/register`
- **Méthode** : `POST`
- **Authentification requise** : Non

**Corps de la requête** :

```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123",
  "name": "Jean Dupont"
}
```

**Réponse réussie** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "utilisateur@exemple.com",
    "name": "Jean Dupont"
  }
}
```

**Codes de réponse** :
- `201 Created` : Inscription réussie
- `400 Bad Request` : Données invalides ou email déjà utilisé
- `500 Internal Server Error` : Erreur serveur

### Rafraîchissement du token

- **URL** : `/auth/refresh-token`
- **Méthode** : `POST`
- **Authentification requise** : Oui (via le token de rafraîchissement)

**Corps de la requête** :

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse réussie** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Codes de réponse** :
- `200 OK` : Token rafraîchi avec succès
- `401 Unauthorized` : Token de rafraîchissement invalide ou expiré
- `500 Internal Server Error` : Erreur serveur

## Notes

### Récupérer toutes les notes

- **URL** : `/notes`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Introduction à React",
    "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur...",
    "tags": ["react", "javascript", "frontend"],
    "createdAt": "2025-05-20T14:30:00Z",
    "updatedAt": "2025-05-21T10:15:00Z",
    "hasAiSummary": false,
    "relatedObjective": "Apprendre React"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "title": "Hooks React",
    "content": "Les hooks sont une fonctionnalité introduite dans React 16.8...",
    "tags": ["react", "hooks", "frontend"],
    "createdAt": "2025-05-21T09:45:00Z",
    "updatedAt": "2025-05-21T09:45:00Z",
    "hasAiSummary": true,
    "relatedObjective": "Apprendre React"
  }
]
```

### Créer une note

- **URL** : `/notes`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "title": "Introduction à React",
  "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur...",
  "tags": ["react", "javascript", "frontend"],
  "relatedObjective": "Apprendre React"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Introduction à React",
  "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur...",
  "tags": ["react", "javascript", "frontend"],
  "createdAt": "2025-05-22T15:30:00Z",
  "updatedAt": "2025-05-22T15:30:00Z",
  "hasAiSummary": false,
  "relatedObjective": "Apprendre React"
}
```

### Mettre à jour une note

- **URL** : `/notes/{id}`
- **Méthode** : `PUT`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Introduction à React (mis à jour)",
  "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur modernes...",
  "tags": ["react", "javascript", "frontend", "ui"],
  "relatedObjective": "Apprendre React"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Introduction à React (mis à jour)",
  "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur modernes...",
  "tags": ["react", "javascript", "frontend", "ui"],
  "createdAt": "2025-05-20T14:30:00Z",
  "updatedAt": "2025-05-22T16:45:00Z",
  "hasAiSummary": false,
  "relatedObjective": "Apprendre React"
}
```

### Supprimer une note

- **URL** : `/notes/{id}`
- **Méthode** : `DELETE`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "message": "Note supprimée avec succès"
}
```

### Générer un résumé IA

- **URL** : `/notes/{id}/ai-summary`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Introduction à React",
  "content": "React est une bibliothèque JavaScript pour construire des interfaces utilisateur...",
  "tags": ["react", "javascript", "frontend"],
  "createdAt": "2025-05-20T14:30:00Z",
  "updatedAt": "2025-05-22T17:00:00Z",
  "hasAiSummary": true,
  "aiSummary": "React est une bibliothèque JavaScript développée par Facebook pour créer des interfaces utilisateur interactives et réutilisables.",
  "relatedObjective": "Apprendre React"
}
```

## Objectifs

### Récupérer tous les objectifs

- **URL** : `/objectives`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Apprendre React",
    "description": "Maîtriser les concepts fondamentaux de React",
    "dueDate": "2025-06-30T23:59:59Z",
    "progress": 60,
    "status": "in-progress",
    "createdAt": "2025-05-01T10:00:00Z",
    "updatedAt": "2025-05-20T15:30:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "title": "Apprendre TypeScript",
    "description": "Comprendre les bases de TypeScript et l'intégrer à React",
    "dueDate": "2025-07-15T23:59:59Z",
    "progress": 30,
    "status": "in-progress",
    "createdAt": "2025-05-10T14:00:00Z",
    "updatedAt": "2025-05-18T09:15:00Z"
  }
]
```

### Créer un objectif

- **URL** : `/objectives`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "title": "Apprendre React",
  "description": "Maîtriser les concepts fondamentaux de React",
  "dueDate": "2025-06-30T23:59:59Z"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Apprendre React",
  "description": "Maîtriser les concepts fondamentaux de React",
  "dueDate": "2025-06-30T23:59:59Z",
  "progress": 0,
  "status": "not-started",
  "createdAt": "2025-05-22T17:30:00Z",
  "updatedAt": "2025-05-22T17:30:00Z"
}
```

### Mettre à jour un objectif

- **URL** : `/objectives/{id}`
- **Méthode** : `PUT`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Maîtriser React",
  "description": "Maîtriser les concepts fondamentaux et avancés de React",
  "dueDate": "2025-07-15T23:59:59Z",
  "progress": 65,
  "status": "in-progress"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Maîtriser React",
  "description": "Maîtriser les concepts fondamentaux et avancés de React",
  "dueDate": "2025-07-15T23:59:59Z",
  "progress": 65,
  "status": "in-progress",
  "createdAt": "2025-05-01T10:00:00Z",
  "updatedAt": "2025-05-22T17:45:00Z"
}
```

### Supprimer un objectif

- **URL** : `/objectives/{id}`
- **Méthode** : `DELETE`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "message": "Objectif supprimé avec succès"
}
```

### Mettre à jour la progression d'un objectif

- **URL** : `/objectives/{id}/progress`
- **Méthode** : `PATCH`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "progress": 75
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "progress": 75,
  "updatedAt": "2025-05-22T18:00:00Z"
}
```

### Mettre à jour le statut d'un objectif

- **URL** : `/objectives/{id}/status`
- **Méthode** : `PATCH`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "status": "completed"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "updatedAt": "2025-05-22T18:15:00Z"
}
```

## Tâches

### Récupérer toutes les tâches

- **URL** : `/tasks`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Apprendre les hooks React",
    "description": "Comprendre useState, useEffect, useContext, etc.",
    "dueDate": "2025-05-25T23:59:59Z",
    "status": "in-progress",
    "priority": "high",
    "objectiveId": "123e4567-e89b-12d3-a456-426614174000",
    "objectiveTitle": "Apprendre React",
    "createdAt": "2025-05-15T10:00:00Z",
    "updatedAt": "2025-05-20T15:30:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "title": "Créer un projet React",
    "description": "Mettre en pratique les connaissances avec un petit projet",
    "dueDate": "2025-06-05T23:59:59Z",
    "status": "todo",
    "priority": "medium",
    "objectiveId": "123e4567-e89b-12d3-a456-426614174000",
    "objectiveTitle": "Apprendre React",
    "createdAt": "2025-05-15T11:30:00Z",
    "updatedAt": "2025-05-15T11:30:00Z"
  }
]
```

### Créer une tâche

- **URL** : `/tasks`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "title": "Apprendre les hooks React",
  "description": "Comprendre useState, useEffect, useContext, etc.",
  "dueDate": "2025-05-25T23:59:59Z",
  "priority": "high",
  "objectiveId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Apprendre les hooks React",
  "description": "Comprendre useState, useEffect, useContext, etc.",
  "dueDate": "2025-05-25T23:59:59Z",
  "status": "todo",
  "priority": "high",
  "objectiveId": "123e4567-e89b-12d3-a456-426614174000",
  "objectiveTitle": "Apprendre React",
  "createdAt": "2025-05-22T18:30:00Z",
  "updatedAt": "2025-05-22T18:30:00Z"
}
```

### Mettre à jour une tâche

- **URL** : `/tasks/{id}`
- **Méthode** : `PUT`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Maîtriser les hooks React",
  "description": "Comprendre et pratiquer useState, useEffect, useContext, etc.",
  "dueDate": "2025-05-28T23:59:59Z",
  "status": "in-progress",
  "priority": "high",
  "objectiveId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Maîtriser les hooks React",
  "description": "Comprendre et pratiquer useState, useEffect, useContext, etc.",
  "dueDate": "2025-05-28T23:59:59Z",
  "status": "in-progress",
  "priority": "high",
  "objectiveId": "123e4567-e89b-12d3-a456-426614174000",
  "objectiveTitle": "Apprendre React",
  "createdAt": "2025-05-15T10:00:00Z",
  "updatedAt": "2025-05-22T18:45:00Z"
}
```

### Supprimer une tâche

- **URL** : `/tasks/{id}`
- **Méthode** : `DELETE`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "message": "Tâche supprimée avec succès"
}
```

### Mettre à jour le statut d'une tâche

- **URL** : `/tasks/{id}/status`
- **Méthode** : `PATCH`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "status": "completed"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "updatedAt": "2025-05-22T19:00:00Z"
}
```

## Chat IA

### Récupérer toutes les sessions de chat

- **URL** : `/chat-sessions`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Aide avec React Hooks",
    "createdAt": "2025-05-20T14:30:00Z",
    "updatedAt": "2025-05-21T10:15:00Z",
    "messages": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "content": "Comment fonctionne useEffect ?",
        "role": "user",
        "timestamp": "2025-05-20T14:30:00Z"
      },
      {
        "id": "223e4567-e89b-12d3-a456-426614174002",
        "content": "useEffect est un hook React qui vous permet d'effectuer des effets de bord dans vos composants fonctionnels...",
        "role": "assistant",
        "timestamp": "2025-05-20T14:30:05Z"
      }
    ]
  },
  {
    "id": "323e4567-e89b-12d3-a456-426614174003",
    "title": "Questions sur TypeScript",
    "createdAt": "2025-05-21T09:45:00Z",
    "updatedAt": "2025-05-21T10:00:00Z",
    "messages": [
      {
        "id": "423e4567-e89b-12d3-a456-426614174004",
        "content": "Quelle est la différence entre interface et type en TypeScript ?",
        "role": "user",
        "timestamp": "2025-05-21T09:45:00Z"
      },
      {
        "id": "523e4567-e89b-12d3-a456-426614174005",
        "content": "En TypeScript, les interfaces et les types sont tous deux utilisés pour définir des formes d'objets, mais ils ont quelques différences clés...",
        "role": "assistant",
        "timestamp": "2025-05-21T09:45:05Z"
      }
    ]
  }
]
```

### Créer une session de chat

- **URL** : `/chat-sessions`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "title": "Aide avec React Hooks"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Aide avec React Hooks",
  "createdAt": "2025-05-22T19:15:00Z",
  "updatedAt": "2025-05-22T19:15:00Z",
  "messages": []
}
```

### Supprimer une session de chat

- **URL** : `/chat-sessions/{id}`
- **Méthode** : `DELETE`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "message": "Session de chat supprimée avec succès"
}
```

### Envoyer un message

- **URL** : `/chat-sessions/{id}/messages`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "content": "Comment fonctionne useEffect ?"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Comment fonctionne useEffect ?",
  "role": "user",
  "timestamp": "2025-05-22T19:30:00Z"
}
```

### Obtenir la réponse de l'IA

- **URL** : `/chat-sessions/{id}/ai-response`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "messageId": "123e4567-e89b-12d3-a456-426614174001"
}
```

**Réponse réussie** :

```json
{
  "id": "223e4567-e89b-12d3-a456-426614174002",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "useEffect est un hook React qui vous permet d'effectuer des effets de bord dans vos composants fonctionnels...",
  "role": "assistant",
  "timestamp": "2025-05-22T19:30:05Z"
}
```

## Profil

### Récupérer le profil utilisateur

- **URL** : `/profile`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "utilisateur@exemple.com",
  "name": "Jean Dupont",
  "avatar": "https://exemple.com/avatars/jean.jpg",
  "createdAt": "2025-04-15T10:00:00Z",
  "updatedAt": "2025-05-10T14:30:00Z",
  "stats": {
    "notesCount": 15,
    "objectivesCount": 5,
    "completedObjectivesCount": 2,
    "tasksCount": 25,
    "completedTasksCount": 18
  }
}
```

### Mettre à jour le profil utilisateur

- **URL** : `/profile`
- **Méthode** : `PUT`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "name": "Jean Martin",
  "avatar": "https://exemple.com/avatars/jean_new.jpg"
}
```

**Réponse réussie** :

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "utilisateur@exemple.com",
  "name": "Jean Martin",
  "avatar": "https://exemple.com/avatars/jean_new.jpg",
  "createdAt": "2025-04-15T10:00:00Z",
  "updatedAt": "2025-05-22T20:00:00Z"
}
```

### Changer le mot de passe

- **URL** : `/profile/change-password`
- **Méthode** : `POST`
- **Authentification requise** : Oui

**Corps de la requête** :

```json
{
  "currentPassword": "ancienMotDePasse123",
  "newPassword": "nouveauMotDePasse456"
}
```

**Réponse réussie** :

```json
{
  "message": "Mot de passe modifié avec succès"
}
```

**Codes de réponse** :
- `200 OK` : Mot de passe modifié avec succès
- `400 Bad Request` : Mot de passe actuel incorrect ou nouveau mot de passe invalide
- `500 Internal Server Error` : Erreur serveur

### Récupérer les réalisations

- **URL** : `/profile/achievements`
- **Méthode** : `GET`
- **Authentification requise** : Oui

**Réponse réussie** :

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Premier pas",
    "description": "Créer votre premier objectif",
    "icon": "target",
    "unlockedAt": "2025-04-16T14:30:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "title": "Organisé",
    "description": "Créer 10 tâches",
    "icon": "list-check",
    "unlockedAt": "2025-04-20T09:15:00Z"
  },
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "title": "Studieux",
    "description": "Créer 5 notes",
    "icon": "book",
    "unlockedAt": "2025-04-25T16:45:00Z"
  }
]
```

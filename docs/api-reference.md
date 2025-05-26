# Documentation des API SkillUp

Ce document décrit toutes les API nécessaires pour le fonctionnement de l'application SkillUp, avec leurs entrées et sorties.

## Table des matières

- [API Profil](#api-profil)
  - [Récupérer le profil](#récupérer-le-profil)
  - [Mettre à jour le profil](#mettre-à-jour-le-profil)
  - [Récupérer les préférences](#récupérer-les-préférences)
  - [Mettre à jour les préférences](#mettre-à-jour-les-préférences)
  - [Changer le mot de passe](#changer-le-mot-de-passe)
  - [Télécharger un avatar](#télécharger-un-avatar)
  - [Récupérer les statistiques](#récupérer-les-statistiques)
- [API Achievements](#api-achievements)
  - [Récupérer tous les achievements](#récupérer-tous-les-achievements)
  - [Récupérer un achievement](#récupérer-un-achievement)

## API Profil

### Récupérer le profil

Récupère le profil de l'utilisateur connecté.

**URL** : `/api/profile`

**Méthode** : `GET`

**Authentification** : Requise (token dans les cookies)

**Réponse de succès** :

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "role": "string",
  "skills": ["string"],
  "joinedAt": "string",
  "preferences": {
    "theme": "light | dark | system",
    "notifications": boolean,
    "emailNotifications": boolean,
    "language": "string"
  }
}
```

### Mettre à jour le profil

Met à jour le profil de l'utilisateur connecté.

**URL** : `/api/profile`

**Méthode** : `PUT`

**Authentification** : Requise (token dans les cookies)

**Corps de la requête** :

```json
{
  "name": "string",
  "bio": "string",
  "avatar": "string",
  "skills": ["string"]
}
```

**Réponse de succès** :

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "role": "string",
  "skills": ["string"],
  "joinedAt": "string",
  "preferences": {
    "theme": "light | dark | system",
    "notifications": boolean,
    "emailNotifications": boolean,
    "language": "string"
  }
}
```

### Récupérer les préférences

Récupère les préférences de l'utilisateur connecté.

**URL** : `/api/profile/preferences`

**Méthode** : `GET`

**Authentification** : Requise (token dans les cookies)

**Réponse de succès** :

```json
{
  "theme": "light | dark | system",
  "notifications": boolean,
  "emailNotifications": boolean,
  "language": "string"
}
```

### Mettre à jour les préférences

Met à jour les préférences de l'utilisateur connecté.

**URL** : `/api/profile/preferences`

**Méthode** : `PUT`

**Authentification** : Requise (token dans les cookies)

**Corps de la requête** :

```json
{
  "theme": "light | dark | system",
  "notifications": boolean,
  "emailNotifications": boolean,
  "language": "string"
}
```

**Réponse de succès** :

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "role": "string",
  "skills": ["string"],
  "joinedAt": "string",
  "preferences": {
    "theme": "light | dark | system",
    "notifications": boolean,
    "emailNotifications": boolean,
    "language": "string"
  }
}
```

### Changer le mot de passe

Change le mot de passe de l'utilisateur connecté.

**URL** : `/api/profile/password`

**Méthode** : `POST`

**Authentification** : Requise (token dans les cookies)

**Corps de la requête** :

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Réponse de succès** :

```json
{
  "success": true
}
```

### Télécharger un avatar

Télécharge une nouvelle image de profil pour l'utilisateur connecté.

**URL** : `/api/profile/avatar`

**Méthode** : `POST`

**Authentification** : Requise (token dans les cookies)

**Corps de la requête** : `FormData` avec un champ `avatar` contenant l'image

**Réponse de succès** :

```json
{
  "avatarUrl": "string"
}
```

### Récupérer les statistiques

Récupère les statistiques de l'utilisateur connecté.

**URL** : `/api/profile/stats`

**Méthode** : `GET`

**Authentification** : Requise (token dans les cookies)

**Réponse de succès** :

```json
{
  "totalObjectives": number,
  "completedObjectives": number,
  "inProgressObjectives": number,
  "totalTasks": number,
  "completedTasks": number,
  "inProgressTasks": number,
  "overdueTasks": number,
  "totalNotes": number,
  "notesWithAiSummary": number,
  "joinedDays": number,
  "lastUpdated": "string"
}
```


## API Achievements

### Récupérer tous les achievements

Récupère tous les achievements de l'utilisateur connecté.

**URL** : `/api/achievements`

**Méthode** : `GET`

**Authentification** : Requise (token dans les cookies)

**Réponse de succès** :

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "icon": "string",
    "unlocked": boolean,
    "date": "string",
    "progress": number,
    "total": number
  }
]
```

### Récupérer un achievement

Récupère un achievement spécifique de l'utilisateur connecté.

**URL** : `/api/achievements/:id`

**Méthode** : `GET`

**Authentification** : Requise (token dans les cookies)

**Réponse de succès** :

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "icon": "string",
  "unlocked": boolean,
  "date": "string",
  "progress": number,
  "total": number
}
```

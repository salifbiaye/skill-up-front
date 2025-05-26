# SkillUp - Application de Développement Personnel

Application de gestion de notes, objectifs et développement personnel avec export PDF et intégration IA.

## Architecture

L'application est composée de trois services principaux :

1. **Frontend** : Application Next.js avec interface utilisateur moderne
2. **Backend** : API REST pour la gestion des données
3. **Base de données** : PostgreSQL pour le stockage persistant

## Fonctionnalités

- Gestion de notes avec support Markdown
- Export PDF avec différents thèmes
- Gestion d'objectifs personnels
- Chat IA pour l'assistance
- Profil utilisateur et suivi de progression

## Prérequis

- Docker et Docker Compose
- Git

## Déploiement avec Docker

### Configuration rapide avec Docker Compose

Le projet inclut un fichier `docker-compose.yml` qui permet de déployer l'ensemble de l'application (frontend, backend et base de données) en une seule commande :

```bash
# Cloner le dépôt (si ce n'est pas déjà fait)
git clone https://github.com/votre-organisation/skillup.git
cd skillup

# Démarrer tous les services
docker-compose up -d
```

L'application sera accessible à l'adresse : http://localhost:3000

### Configuration manuelle des services

Si vous préférez configurer chaque service séparément, suivez ces étapes :

#### 1. Base de données PostgreSQL

```bash
docker run -d \
  --name skillup-db \
  -e POSTGRES_DB=skillup \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### 2. Backend

```bash
# Assurez-vous d'avoir l'image du backend
docker run -d \
  --name skillup-backend \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/skillup \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  -p 8080:8080 \
  skillup-backend:latest
```

#### 3. Frontend

```bash
# Construire l'image du frontend
docker build -t skillup-frontend .

# Exécuter le conteneur frontend
docker run -d \
  --name skillup-frontend \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  -p 3000:3000 \
  skillup-frontend
```

### Variables d'environnement

#### Frontend (Next.js)

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:8080/api` |

#### Backend

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SPRING_DATASOURCE_URL` | URL de connexion à la base de données | `jdbc:postgresql://localhost:5432/skillup` |
| `SPRING_DATASOURCE_USERNAME` | Nom d'utilisateur de la base de données | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe de la base de données | `postgres` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Mode de mise à jour du schéma de la base de données | `update` |

### Optimisations du Dockerfile

Le Dockerfile du frontend utilise une approche multi-étapes pour optimiser la taille de l'image finale :

1. **Étape de construction** : Installe les dépendances et compile l'application
2. **Étape de production** : Utilise uniquement les fichiers nécessaires pour l'exécution

Autres optimisations :
- Utilisation d'Alpine Linux pour réduire la taille de l'image
- Exécution en tant qu'utilisateur non-root pour améliorer la sécurité
- Désactivation de la télémétrie Next.js
- Mise en cache des dépendances npm

## Dépannage

### Problèmes de connexion au backend

Si le frontend ne parvient pas à se connecter au backend :

1. Vérifiez que le service backend est en cours d'exécution :
   ```bash
   docker ps | grep skillup-backend
   ```

2. Vérifiez les journaux du backend pour identifier les erreurs :
   ```bash
   docker logs skillup-backend
   ```

3. Assurez-vous que la variable d'environnement `NEXT_PUBLIC_API_URL` est correctement configurée dans le conteneur frontend :
   ```bash
   docker exec skillup-frontend env | grep NEXT_PUBLIC_API_URL
   ```

### Problèmes de base de données

1. Vérifiez que le conteneur PostgreSQL est en cours d'exécution :
   ```bash
   docker ps | grep skillup-db
   ```

2. Vérifiez les journaux de la base de données :
   ```bash
   docker logs skillup-db
   ```

3. Connectez-vous à la base de données pour vérifier son état :
   ```bash
   docker exec -it skillup-db psql -U postgres -d skillup
   ```

## Maintenance

### Sauvegardes de la base de données

Pour créer une sauvegarde de la base de données :

```bash
docker exec -t skillup-db pg_dump -U postgres -d skillup > backup_$(date +%Y%m%d_%H%M%S).sql
```

Pour restaurer une sauvegarde :

```bash
cat backup_file.sql | docker exec -i skillup-db psql -U postgres -d skillup
```

### Mise à jour des conteneurs

Pour mettre à jour les conteneurs avec les dernières versions :

```bash
# Arrêter les conteneurs
docker-compose down

# Reconstruire et redémarrer
docker-compose up -d --build
```

## Fonctionnalités d'export PDF

L'application inclut un service d'export PDF modulaire qui permet de convertir les notes en fichiers PDF avec différents thèmes. Cette fonctionnalité est entièrement intégrée dans le conteneur frontend et ne nécessite pas de configuration supplémentaire.

Les services modulaires d'export PDF comprennent :
- **PdfThemeService** : Gestion des thèmes et styles
- **PdfMarkdownService** : Traitement du formatage Markdown
- **PdfCodeBlockService** : Rendu des blocs de code
- **PdfUtilsService** : Utilitaires pour le traitement des emojis et la génération de noms de fichiers

## Conclusion

Cette configuration Docker permet de déployer rapidement l'application SkillUp avec tous ses composants. Pour toute question ou problème, veuillez consulter la documentation ou ouvrir une issue sur le dépôt GitHub du projet.

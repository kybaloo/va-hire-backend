# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### À venir

- Nouvelles fonctionnalités en développement

## [1.0.3] - 2025-06-30

### ✅ Corrections

- **Auth0**: Correction de l'erreur 401 Unauthorized sur `/auth/auth0-callback`
- **Auth0**: Configuration corrigée avec `AUTH0_AUDIENCE` approprié
- **Auth0**: Middleware amélioré avec meilleure gestion d'erreurs

### ✨ Nouveautés

- **Debug**: Ajout d'outils de débogage Auth0
- **Tests**: Endpoint `/api/auth/test-auth0` pour validation des tokens
- **Config**: Endpoint `/api/auth/auth0-config` pour vérifier la configuration
- **Scripts**: Script `test-auth0.js` pour diagnostiquer les problèmes

### 🔧 Améliorations

- **JWT**: Validation JWT améliorée avec support JWKS
- **Logs**: Logs détaillés pour le debugging Auth0
- **Documentation**: Guide de configuration Auth0 complet

## [1.0.2] - 2025-06-30

### 🔧 Améliorations

- Mise à jour de la documentation
- Optimisations mineures

## [1.0.1] - 2025-06-30

### ✅ Corrections

- Corrections de bugs mineurs
- Améliorations de stabilité

## [1.0.0] - 2025-06-30

### 🚀 Version initiale

- **API**: API backend complète pour VaHire
- **Auth**: Système d'authentification avec JWT et Auth0
- **Users**: Gestion des utilisateurs (user, professional, recruiter, admin)
- **Projects**: Système de gestion de projets
- **Payments**: Intégration Stripe pour les paiements
- **Upload**: Système d'upload avec Cloudinary
- **Notifications**: Système de notifications
- **Reviews**: Système d'avis et commentaires
- **Conversations**: Messagerie en temps réel avec Socket.io
- **Courses**: Système de cours et formations

### 📋 Fonctionnalités principales

- **REST API** complète avec documentation Swagger
- **Authentification** multi-méthodes (email/password, Auth0, social login)
- **Base de données** MongoDB avec Mongoose
- **Sécurité** avec rate limiting, validation des données
- **Logs** structurés avec Morgan
- **Tests** configurés avec Jest
- **Docker** support avec Dockerfile
- **CI/CD** avec GitHub Actions

---

### Types de changements

- **🚀 Nouveautés** : pour les nouvelles fonctionnalités
- **✅ Corrections** : pour les corrections de bugs
- **🔧 Améliorations** : pour les changements dans les fonctionnalités existantes
- **⚠️ Déprécié** : pour les fonctionnalités bientôt supprimées
- **❌ Supprimé** : pour les fonctionnalités supprimées
- **🔒 Sécurité** : pour les corrections de sécurité

[Non publié]: https://github.com/yourusername/va-hire-backend/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/yourusername/va-hire-backend/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/yourusername/va-hire-backend/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/yourusername/va-hire-backend/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/yourusername/va-hire-backend/releases/tag/v1.0.0

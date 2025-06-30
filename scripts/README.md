# Scripts de Gestion des Versions

Ce dossier contient les scripts automatisés pour la gestion des versions du projet va-hire-backend.

## 📁 Scripts disponibles

### `update-version.js`

Met à jour la version dans `package.json` et `config/version.js`.

```bash
# Usage manuel
node scripts/update-version.js 1.2.3 "Note 1" "Note 2"

# Usage automatique
node scripts/update-version.js auto "Fix bug" --type=patch
node scripts/update-version.js auto "New feature" --type=minor
node scripts/update-version.js auto "Breaking change" --type=major
```

### `create-github-release.js`

Crée une release complète avec tag Git et push automatique.

```bash
# Release automatique
node scripts/create-github-release.js patch "Bug fix"
node scripts/create-github-release.js minor "New API endpoint"
node scripts/create-github-release.js major "Database migration"

# Avec message par défaut
node scripts/create-github-release.js patch
```

### `test-auth0.js`

Teste la configuration Auth0 et valide les tokens.

```bash
# Test avec token
node scripts/test-auth0.js YOUR_AUTH0_TOKEN

# Vérification de la configuration seulement
node scripts/test-auth0.js
```

## 🚀 Scripts NPM

Utilisez ces commandes depuis la racine du projet :

```bash
# Mise à jour de version seulement
npm run version:patch   # 1.0.0 → 1.0.1
npm run version:minor   # 1.0.0 → 1.1.0
npm run version:major   # 1.0.0 → 2.0.0

# Release complète (version + git + GitHub)
npm run release:patch   # Correction de bug
npm run release:minor   # Nouvelle fonctionnalité
npm run release:major   # Changement majeur

# Utilitaires Git
npm run git:status      # git status
npm run git:log         # git log --oneline -10
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Auth0 (pour test-auth0.js)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Serveur
PORT=5000
NODE_ENV=development
```

### Fichiers générés

- `config/version.js` - Configuration centralisée de la version
- `CHANGELOG.md` - Historique des versions (manuel)
- Tags Git automatiques (vX.Y.Z)

## 📋 Workflow recommandé

1. **Développement** : Commitez vos changements normalement
2. **Tests** : Vérifiez que tout fonctionne
3. **Release** : Utilisez `npm run release:patch|minor|major`
4. **GitHub** : La release sera créée automatiquement

## 🚨 Prérequis

- Node.js installé
- Git configuré avec permissions push
- Repository GitHub configuré
- Variables d'environnement configurées (pour Auth0)

## 🔍 Debug

En cas de problème :

```bash
# Vérifier la version actuelle
node -p "require('./package.json').version"

# Vérifier la configuration
node -p "require('./config/version.js')"

# Tester la configuration Auth0
node scripts/test-auth0.js

# Voir le statut Git
npm run git:status
```

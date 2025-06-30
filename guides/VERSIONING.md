# Guide de Gestion des Versions - VaHire Backend

Ce guide explique comment utiliser le système de versioning automatisé pour le projet va-hire-backend.

## 📋 Vue d'ensemble

Le projet utilise le **Semantic Versioning (SemVer)** avec des outils automatisés pour:

- Incrémenter les versions
- Créer des tags Git
- Générer des releases GitHub
- Maintenir un CHANGELOG

## 🚀 Commandes rapides

### Releases automatiques (recommandé)

```bash
# Patch release (1.0.0 → 1.0.1) - pour les corrections de bugs
npm run release:patch

# Minor release (1.0.0 → 1.1.0) - pour les nouvelles fonctionnalités
npm run release:minor

# Major release (1.0.0 → 2.0.0) - pour les changements incompatibles
npm run release:major

# Release personnalisée avec message
node scripts/create-github-release.js patch "Fix Auth0 configuration"
```

### Mise à jour de version uniquement

```bash
# Incrémenter seulement la version (sans git)
npm run version:patch
npm run version:minor
npm run version:major

# Ou avec un message personnalisé
node scripts/update-version.js auto "Fix critical bug" --type=patch
```

### Commandes Git manuelles

```bash
# Voir le statut
npm run git:status

# Voir les derniers commits
npm run git:log

# Créer un tag manuellement
npm run tag:create && npm run tag:push
```

## 🛠️ Workflow recommandé

### 1. Développement normal

```bash
# Travaillez sur vos fonctionnalités
git add .
git commit -m "feat: add new feature"
git push
```

### 2. Prêt pour une release

```bash
# Pour une correction de bug
npm run release:patch

# Pour une nouvelle fonctionnalité
npm run release:minor

# Pour un changement majeur
npm run release:major
```

### 3. Via GitHub Actions (Interface web)

1. Allez sur votre repository GitHub
2. Cliquez sur "Actions"
3. Sélectionnez "Version and Release"
4. Cliquez "Run workflow"
5. Choisissez le type de version et ajoutez des notes

## 📁 Structure des fichiers

```
├── .github/workflows/
│   ├── release.yml          # Auto-création des releases lors des tags
│   └── version-release.yml  # Workflow manuel pour releases
├── scripts/
│   ├── update-version.js           # Script de mise à jour de version
│   ├── create-github-release.js    # Script de release automatique
│   └── test-auth0.js               # Test de configuration Auth0
├── config/
│   └── version.js           # Configuration centralisée de la version
├── CHANGELOG.md             # Historique des versions
└── package.json             # Version npm + scripts
```

## 🔧 Configuration des workflows GitHub

### Workflow automatique (recommandé)

Déclenché automatiquement lors du push d'un tag:

```bash
git tag v1.0.4
git push origin v1.0.4
```

### Workflow manuel

Accessible via l'interface GitHub Actions avec options:

- Type de version (patch/minor/major)
- Notes de release personnalisées

## 📝 Format des versions

### Semantic Versioning (SemVer)

- **PATCH** (1.0.0 → 1.0.1): Corrections de bugs
- **MINOR** (1.0.0 → 1.1.0): Nouvelles fonctionnalités compatibles
- **MAJOR** (1.0.0 → 2.0.0): Changements incompatibles

### Exemples pratiques

```bash
# Correction d'un bug Auth0
npm run release:patch

# Ajout d'une nouvelle API
npm run release:minor

# Changement de structure de base de données
npm run release:major
```

## 📚 Documentation automatique

### CHANGELOG.md

Mis à jour automatiquement avec:

- Date de release
- Type de changements
- Description des modifications
- Liens vers les comparaisons GitHub

### Version.js

Fichier central contenant:

```javascript
{
  number: '1.0.3',
  formatted: 'v1.0.3',
  notes: ['Fix Auth0 configuration', 'Enhanced middleware'],
  description: 'API documentation for VaHire backend...'
}
```

## 🔍 Debug et test

### Vérifier la configuration

```bash
# Voir la version actuelle
node -p "require('./package.json').version"

# Tester la configuration Auth0
node scripts/test-auth0.js YOUR_TOKEN

# Voir la configuration de version
node -p "require('./config/version.js')"
```

### Logs et statut

```bash
# Statut Git
npm run git:status

# Historique des commits
npm run git:log

# Liste des tags
git tag -l
```

## 🚨 Dépannage

### Erreur lors du push

```bash
# Vérifiez les permissions
git remote -v

# Authentifiez-vous si nécessaire
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Tag déjà existant

```bash
# Supprimer un tag local
git tag -d v1.0.3

# Supprimer un tag distant
git push origin :refs/tags/v1.0.3
```

### Workflow GitHub Actions non déclenché

- Vérifiez que le tag commence par 'v' (ex: v1.0.3)
- Assurez-vous que le fichier workflow est dans `.github/workflows/`
- Vérifiez les permissions GitHub Actions dans les paramètres du repo

## 📋 Checklist avant release

- [ ] Tests passent (`npm test`)
- [ ] Code committé et pushé
- [ ] CHANGELOG.md à jour
- [ ] Version appropriée choisie (patch/minor/major)
- [ ] Notes de release préparées
- [ ] Permissions GitHub configurées

## 🎯 Exemples d'utilisation

### Scenario 1: Correction rapide

```bash
# Fix d'un bug urgent
git add .
git commit -m "fix: correct Auth0 validation error"
npm run release:patch
```

### Scenario 2: Nouvelle fonctionnalité

```bash
# Nouvelle API ajoutée
git add .
git commit -m "feat: add payment processing API"
npm run release:minor
```

### Scenario 3: Release majeure

```bash
# Changement d'architecture
git add .
git commit -m "feat!: migrate to new database schema"
npm run release:major
```

---

**💡 Tip**: Utilisez toujours les scripts npm pour une cohérence maximale et éviter les erreurs manuelles.

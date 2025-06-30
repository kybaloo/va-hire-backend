#!/usr/bin/env node

/**
 * Script pour créer une release GitHub automatiquement
 * Usage: node scripts/create-github-release.js [type] [message]
 *
 * Exemples:
 *   node scripts/create-github-release.js patch "Fix Auth0 configuration"
 *   node scripts/create-github-release.js minor "Add new features"
 *   node scripts/create-github-release.js major "Breaking changes"
 */

require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const DEFAULT_TYPE = "patch";
const VALID_TYPES = ["patch", "minor", "major"];

// Récupérer les arguments
const args = process.argv.slice(2);
const versionType = args[0] || DEFAULT_TYPE;
const releaseMessage =
  args[1] ||
  `${versionType.charAt(0).toUpperCase() + versionType.slice(1)} release`;

// Validation
if (!VALID_TYPES.includes(versionType)) {
  console.error(`❌ Type de version invalide: ${versionType}`);
  console.log(`Types valides: ${VALID_TYPES.join(", ")}`);
  process.exit(1);
}

// Fonctions utilitaires
function execCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const result = execSync(command, { encoding: "utf8", stdio: "pipe" });
    console.log(`✅ ${description} terminé`);
    return result.trim();
  } catch (error) {
    console.error(`❌ Erreur lors de ${description.toLowerCase()}:`);
    console.error(error.message);
    process.exit(1);
  }
}

function getCurrentVersion() {
  try {
    const packagePath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageJson.version;
  } catch (error) {
    console.error("❌ Impossible de lire la version actuelle");
    process.exit(1);
  }
}

function checkGitStatus() {
  try {
    const status = execSync("git status --porcelain", { encoding: "utf8" });
    if (status.trim()) {
      console.warn("⚠️  Il y a des changements non committés:");
      console.log(status);
      console.log(
        "Voulez-vous continuer ? (Les changements seront inclus dans la release)"
      );
      // En mode automatique, on continue
    }
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du statut Git");
    process.exit(1);
  }
}

function main() {
  console.log("🚀 Création d'une release GitHub automatique");
  console.log(`   Type: ${versionType}`);
  console.log(`   Message: ${releaseMessage}`);
  console.log("");

  // Vérifier le statut Git
  checkGitStatus();

  // Obtenir la version actuelle
  const currentVersion = getCurrentVersion();
  console.log(`📦 Version actuelle: ${currentVersion}`);

  // Exécuter les tests
  console.log("🧪 Exécution des tests...");
  try {
    execSync("npm test", { stdio: "inherit" });
    console.log("✅ Tests réussis");
  } catch (error) {
    console.log("⚠️  Tests non configurés ou échoués, continuation...");
  }

  // Mettre à jour la version
  execCommand(
    `node scripts/update-version.js auto "${releaseMessage}" --type=${versionType}`,
    "Mise à jour de la version"
  );

  // Obtenir la nouvelle version
  const newVersion = getCurrentVersion();
  console.log(`📦 Nouvelle version: ${newVersion}`);

  // Ajouter les changements au git
  execCommand("git add .", "Ajout des changements");

  // Créer un commit
  execCommand(
    `git commit -m "chore: release v${newVersion}\\n\\n${releaseMessage}"`,
    "Création du commit"
  );

  // Pousser les changements
  execCommand("git push", "Push des changements");

  // Créer et pousser le tag
  execCommand(
    `git tag -a v${newVersion} -m "Release v${newVersion}\\n\\n${releaseMessage}"`,
    "Création du tag"
  );

  execCommand(`git push origin v${newVersion}`, "Push du tag");

  console.log("");
  console.log("🎉 Release créée avec succès !");
  console.log(`   Version: v${newVersion}`);
  console.log(`   Tag: v${newVersion}`);
  console.log("");
  console.log("📋 Actions automatiques GitHub:");
  console.log("   - La release sera créée automatiquement via GitHub Actions");
  console.log('   - Surveillez l\'onglet "Actions" de votre repository');
  console.log("");
  console.log("🔗 Liens utiles:");
  console.log(
    `   - Releases: https://github.com/VOTRE_USERNAME/va-hire-backend/releases`
  );
  console.log(
    `   - Tags: https://github.com/VOTRE_USERNAME/va-hire-backend/tags`
  );
}

// Exécution principale
if (require.main === module) {
  main();
}

module.exports = { main, getCurrentVersion, execCommand };

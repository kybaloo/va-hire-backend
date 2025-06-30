/**
 * Script pour mettre à jour la version de l'API
 *
 * Usage:
 *   node scripts/update-version.js <nouvelle-version> "<note-1>" "<note-2>" ...
 *   node scripts/update-version.js auto "<note>" --type=patch|minor|major
 *
 * Exemple:
 *   node scripts/update-version.js 1.0.3 "Correction du bug XYZ" "Amélioration de la performance"
 *   node scripts/update-version.js auto "Fix Auth0 configuration" --type=patch
 */

const fs = require("fs");
const path = require("path");

// Fonction pour incrémenter automatiquement la version
function incrementVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

// Fonction pour obtenir la version actuelle
function getCurrentVersion() {
  try {
    const packagePath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return packageJson.version;
  } catch (error) {
    console.warn(
      "Impossible de lire package.json, utilisation de 1.0.0 par défaut"
    );
    return "1.0.0";
  }
}

// Fonction pour mettre à jour package.json
function updatePackageJson(newVersion) {
  try {
    const packagePath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
    console.log(`📦 package.json mis à jour vers ${newVersion}`);
  } catch (error) {
    console.error(
      `❌ Erreur lors de la mise à jour de package.json: ${error.message}`
    );
  }
}

// Récupérer les arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Erreur: Veuillez spécifier un numéro de version.");
  console.log(
    'Usage: node scripts/update-version.js <nouvelle-version> "<note-1>" "<note-2>" ...'
  );
  console.log(
    '   ou: node scripts/update-version.js auto "<note>" --type=patch|minor|major'
  );
  process.exit(1);
}

let newVersion = args[0];
let releaseNotes = [];
let versionType = "patch";

// Parser les arguments
if (newVersion === "auto") {
  // Mode automatique
  const typeArg = args.find((arg) => arg.startsWith("--type="));
  if (typeArg) {
    versionType = typeArg.split("=")[1];
    if (!["patch", "minor", "major"].includes(versionType)) {
      console.error("Erreur: Le type doit être patch, minor ou major");
      process.exit(1);
    }
  }

  // Récupérer les notes (exclure les arguments --type)
  releaseNotes = args.slice(1).filter((arg) => !arg.startsWith("--"));

  // Calculer la nouvelle version
  const currentVersion = getCurrentVersion();
  newVersion = incrementVersion(currentVersion, versionType);
  console.log(
    `🔄 Version automatique: ${currentVersion} → ${newVersion} (${versionType})`
  );
} else {
  // Mode manuel
  releaseNotes = args.slice(1).filter((arg) => !arg.startsWith("--"));
}

if (releaseNotes.length === 0) {
  releaseNotes.push(
    `${
      versionType === "major"
        ? "Major"
        : versionType === "minor"
        ? "Minor"
        : "Patch"
    } release ${newVersion}`
  );
}

// Valider le format de la version (semver)
if (!/^\d+\.\d+\.\d+(-[\w\.\-]+)?$/.test(newVersion)) {
  console.error(
    "Erreur: Le format de version doit être X.Y.Z ou X.Y.Z-suffix (semver)."
  );
  process.exit(1);
}

// Chemin vers le fichier de version
const versionFilePath = path.join(__dirname, "..", "config", "version.js");

// Générer une description automatique si aucune n'est fournie
let description = `API documentation for VaHire backend. Version ${newVersion}`;
if (releaseNotes.length > 0) {
  description += ` includes: ${releaseNotes.join(", ")}.`;
}

// Créer le contenu du nouveau fichier
const content = `/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 * Dernière mise à jour: ${new Date().toISOString()}
 */

const VERSION = {
  number: '${newVersion}',
  get formatted() {
    return \`v\${this.number}\`;
  },
  notes: [
${releaseNotes.map((note) => `    '${note.replace(/'/g, "\\'")}'`).join(",\n")}
  ],
  description: '${description.replace(/'/g, "\\'")}'
};

module.exports = VERSION;`;

// Écrire le nouveau fichier
try {
  // Mettre à jour package.json aussi
  updatePackageJson(newVersion);

  // Mettre à jour le fichier de version
  fs.writeFileSync(versionFilePath, content);
  console.log(`✅ Version mise à jour avec succès vers ${newVersion}`);

  if (releaseNotes.length > 0) {
    console.log("Notes de version:");
    releaseNotes.forEach((note) => console.log(` - ${note}`));
  }

  console.log("Redémarrez le serveur pour appliquer les changements.");
} catch (error) {
  console.error(
    `❌ Erreur lors de la mise à jour du fichier: ${error.message}`
  );
  process.exit(1);
}

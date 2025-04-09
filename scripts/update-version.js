/**
 * Script pour mettre à jour la version de l'API
 * 
 * Usage:
 *   node scripts/update-version.js <nouvelle-version> "<note-1>" "<note-2>" ...
 * 
 * Exemple:
 *   node scripts/update-version.js 1.0.3 "Correction du bug XYZ" "Amélioration de la performance"
 */

const fs = require('fs');
const path = require('path');

// Récupérer les arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Erreur: Veuillez spécifier un numéro de version.');
  console.log('Usage: node scripts/update-version.js <nouvelle-version> "<note-1>" "<note-2>" ...');
  process.exit(1);
}

const newVersion = args[0];
const releaseNotes = args.slice(1);

if (releaseNotes.length === 0) {
  console.warn('Attention: Aucune note de version spécifiée.');
}

// Valider le format de la version (semver)
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('Erreur: Le format de version doit être X.Y.Z (semver).');
  process.exit(1);
}

// Chemin vers le fichier de version
const versionFilePath = path.join(__dirname, '..', 'config', 'version.js');

// Générer une description automatique si aucune n'est fournie
let description = `API documentation for VaHire backend. Version ${newVersion}`;
if (releaseNotes.length > 0) {
  description += ` includes: ${releaseNotes.join(', ')}.`;
}

// Créer le contenu du nouveau fichier
const content = `/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 */

const VERSION = {
  number: '${newVersion}',
  get formatted() {
    return \`v\${this.number}\`;
  },
  releaseNotes: [
${releaseNotes.map(note => `    '${note.replace(/'/g, "\\'")}'`).join(',\n')}
  ],
  description: '${description.replace(/'/g, "\\'")}'
};

module.exports = VERSION;`;

// Écrire le nouveau fichier
try {
  fs.writeFileSync(versionFilePath, content);
  console.log(`✅ Version mise à jour avec succès vers ${newVersion}`);
  
  if (releaseNotes.length > 0) {
    console.log('\nNotes de version:');
    releaseNotes.forEach(note => console.log(` - ${note}`));
  }
  
  console.log('\nRedémarrez le serveur pour appliquer les changements.');
} catch (error) {
  console.error(`❌ Erreur lors de la mise à jour du fichier: ${error.message}`);
  process.exit(1);
} 
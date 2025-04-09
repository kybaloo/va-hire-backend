/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 */

const VERSION = {
  number: '1.0.2',
  get formatted() {
    return `v${this.number}`;
  },
  releaseNotes: [
    'Ajout du champ `passwordConfirm` à la documentation de la route d\'inscription',
    'Correction de la référence manquante au schéma `Message`',
    'Déplacement du fichier swagger.js dans le dossier config'
  ],
  description: 'API documentation for VaHire backend. Version 1.0.2 fixes two major bugs: added passwordConfirm field to register endpoint and fixed missing Message schema definition. Also improved code organization.'
};

module.exports = VERSION; 
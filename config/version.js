/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 * Dernière mise à jour: 2025-06-30T15:26:07.685Z
 */

const VERSION = {
  number: '1.0.4',
  get formatted() {
    return `v${this.number}`;
  },
  notes: [
    'Patch release'
  ],
  description: 'API documentation for VaHire backend. Version 1.0.4 includes: Patch release.'
};

module.exports = VERSION;
/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 * Dernière mise à jour: 2025-07-02T17:07:09.851Z
 */

const VERSION = {
  number: '1.1.0',
  get formatted() {
    return `v${this.number}`;
  },
  notes: [
    'Minor release 1.1.0'
  ],
  description: 'API documentation for VaHire backend. Version 1.1.0 includes: Minor release 1.1.0.'
};

module.exports = VERSION;
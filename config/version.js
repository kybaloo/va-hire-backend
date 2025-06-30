/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 * Dernière mise à jour: 2025-06-30T15:06:16.869Z
 */

const VERSION = {
  number: '1.0.3',
  get formatted() {
    return `v${this.number}`;
  },
  notes: [
    'Setup complete versioning system'
  ],
  description: 'API documentation for VaHire backend. Version 1.0.3 includes: Setup complete versioning system.'
};

module.exports = VERSION;
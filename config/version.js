/**
 * Configuration centralisée de la version de l'API
 * Pour mettre à jour la version, modifier uniquement ce fichier
 * Dernière mise à jour: 2025-07-02T17:12:09.379Z
 */

const VERSION = {
  number: '1.2.0',
  get formatted() {
    return `v${this.number}`;
  },
  notes: [
    'Consolidation de l\'authentification - Support hybride Auth0 et JWT traditionnel'
  ],
  description: 'API documentation for VaHire backend. Version 1.2.0 includes: Consolidation de l\'authentification - Support hybride Auth0 et JWT traditionnel.'
};

module.exports = VERSION;
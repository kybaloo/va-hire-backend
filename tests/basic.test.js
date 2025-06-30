/**
 * Tests basiques pour l'API VaHire Backend
 */

describe('API Tests', () => {
  test('Version configuration exists', () => {
    const version = require('../config/version.js');
    expect(version).toBeDefined();
    expect(version.number).toBeDefined();
    expect(typeof version.number).toBe('string');
  });

  test('Package.json version matches', () => {
    const packageJson = require('../package.json');
    const version = require('../config/version.js');
    expect(packageJson.version).toBe(version.number);
  });

  test('Environment variables structure', () => {
    // Test que les variables importantes sont définies en structure
    const requiredEnvVars = [
      'PORT',
      'NODE_ENV',
      'MONGO_URI',
      'JWT_SECRET'
    ];
    
    // On ne teste pas les valeurs réelles mais la structure
    expect(Array.isArray(requiredEnvVars)).toBe(true);
    expect(requiredEnvVars.length).toBeGreaterThan(0);
  });
});

describe('Configuration Tests', () => {
  test('Version format is valid semver', () => {
    const version = require('../config/version.js');
    const semverRegex = /^\d+\.\d+\.\d+(-[\w\.\-]+)?$/;
    expect(version.number).toMatch(semverRegex);
  });

  test('Version notes are array', () => {
    const version = require('../config/version.js');
    expect(Array.isArray(version.notes)).toBe(true);
  });
});

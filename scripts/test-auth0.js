#!/usr/bin/env node

/**
 * Script de test pour la configuration Auth0
 * Usage: node test-auth0.js [token]
 */

require("dotenv").config();
const axios = require("axios");

const TEST_URL = `http://localhost:${
  process.env.PORT || 5000
}/api/auth/test-auth0`;

async function testAuth0Config(token) {
  console.log("🔧 Configuration Auth0 actuelle:");
  console.log(`   Domain: ${process.env.AUTH0_DOMAIN}`);
  console.log(`   Audience: ${process.env.AUTH0_AUDIENCE}`);
  console.log(`   Client ID: ${process.env.AUTH0_CLIENT_ID}`);
  console.log(
    `   Client Secret: ${
      process.env.AUTH0_CLIENT_SECRET ? "✅ Configuré" : "❌ Non configuré"
    }`
  );
  console.log("");

  if (!token) {
    console.log("❌ Aucun token fourni");
    console.log("Usage: node test-auth0.js YOUR_AUTH0_TOKEN");
    process.exit(1);
  }

  try {
    console.log("🧪 Test de validation du token Auth0...");

    const response = await axios.get(TEST_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Token valide !");
    console.log("📋 Données du token:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Erreur de validation du token:");

    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(
        `   Message: ${error.response.data?.message || "Erreur inconnue"}`
      );

      if (error.response.data?.details) {
        console.log(`   Détails: ${error.response.data.details}`);
      }
    } else if (error.request) {
      console.log("   Impossible de joindre le serveur");
      console.log("   Vérifiez que le serveur backend est démarré");
    } else {
      console.log(`   Erreur: ${error.message}`);
    }
  }
}

// Configuration checks
function checkConfiguration() {
  const required = ["AUTH0_DOMAIN", "AUTH0_AUDIENCE", "AUTH0_CLIENT_ID"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.log("❌ Variables d'environnement manquantes:");
    missing.forEach((key) => console.log(`   - ${key}`));
    return false;
  }

  // Check if values look like defaults
  const defaultValues = {
    AUTH0_CLIENT_ID: "your-auth0-client-id",
    AUTH0_CLIENT_SECRET: "your-auth0-client-secret",
    AUTH0_AUDIENCE: "Ypqfam85ZdQR1sQsMpNMz2qE1yk0ONMv", // This looks like a client ID, not an audience
  };

  const needsUpdate = Object.entries(defaultValues).filter(
    ([key, defaultValue]) => process.env[key] === defaultValue
  );

  if (needsUpdate.length > 0) {
    console.log("⚠️  Variables avec des valeurs par défaut à mettre à jour:");
    needsUpdate.forEach(([key]) => console.log(`   - ${key}`));
    console.log("");
  }

  return true;
}

// Main execution
const token = process.argv[2];

if (!checkConfiguration()) {
  console.log(
    "Veuillez configurer correctement vos variables d'environnement Auth0"
  );
  process.exit(1);
}

testAuth0Config(token);

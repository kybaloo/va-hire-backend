const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VaHire API Documentation",
      version: "1.0.0",
      description:
        "API documentation for VaHire - Virtual Assistant Hiring Platform",
      contact: {
        name: "API Support",
        email: "support@vahire.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.vahire.com",
        description: "Production server",
      },
      {
        url: "https://va-hire-backend.onrender.com/",
        description: "Preproduction server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

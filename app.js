require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const redoc = require("redoc-express");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middlewares/errorHandler");
const {
  apiLimiter,
  authLimiter,
  uploadLimiter,
} = require("./middlewares/rateLimiter");
const { accessLogger, errorLogger } = require("./middlewares/logger");
const healthRoutes = require("./routes/health");
const VERSION = require("./config/version");
// Import unified authentication middleware
const { authenticate, handleJwtError } = require("./middlewares/auth");

const app = express();
mongoose.set("strictQuery", false);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(accessLogger);
app.use(errorLogger);
app.use(apiLimiter);

// API Documentation with Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: `VaHire API Documentation ${VERSION.formatted}`,
    customfavIcon: "/favicon.ico",
  })
);

// ReDoc Documentation
app.get("/docs", (req, res, next) => {
  // Construire le HTML complet
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>VaHire API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
          }
          #redoc-container {
            margin: 0;
          }
          code {
            background-color: #f1f1f1;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div id="redoc-container"></div>
        <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
        <script>
          Redoc.init(
            '/swagger.json',
            {
              hideDownloadButton: false,
              disableSearch: false,
            },
            document.getElementById('redoc-container')
          )
        </script>
      </body>
    </html>`;

  res.send(html);
});

// Endpoint to serve the OpenAPI specification as JSON for ReDoc
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Basic route
app.get("/", (req, res) => {
  res.send("Va-Hire Backend is running");
});

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const recommendationRoutes = require("./routes/recommendation");
const paymentRoutes = require("./routes/payments");
const uploadRoutes = require("./routes/upload");
const reviewRoutes = require("./routes/review");
const notificationRoutes = require("./routes/notification");
const courseRoutes = require("./routes/course");
const conversationRoutes = require("./routes/conversation");
const adminRoutes = require("./routes/admin");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// For Stripe webhook - we need raw body for signature verification
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Routes calls with rate limiting
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadLimiter, uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/conversations", authenticate, conversationRoutes);
app.use("/api/admin", adminRoutes);

// Health check route (no rate limiting)
app.use("/health", healthRoutes);

// JWT error handling middleware (must be after routes that use checkJwt)
app.use(handleJwtError);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;

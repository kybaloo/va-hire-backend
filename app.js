require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const redoc = require('redoc-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middlewares/rateLimiter');
const { accessLogger, errorLogger } = require('./middlewares/logger');
const healthRoutes = require('./routes/health');
const VERSION = require('./config/version');

const app = express();
mongoose.set('strictQuery', false);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(accessLogger);
app.use(errorLogger);
app.use(apiLimiter);

// API Documentation with Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: `VaHire API Documentation ${VERSION.formatted}`,
  customfavIcon: "/favicon.ico"
}));

// ReDoc Documentation
app.get('/docs', (req, res, next) => {
  // Formater les notes de version avec les balises HTML
  const releaseNotesList = VERSION.releaseNotes.map(note => {
    // Remplacer les marqueurs de code par des balises HTML
    const formattedNote = note.replace(/`([^`]+)`/g, '<code>$1</code>');
    return `<li>✅ ${formattedNote}</li>`;
  }).join('\n            ');
  
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
          #header {
            background-color: #1e88e5;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          #header h1 {
            margin: 0;
            font-size: 24px;
          }
          #download-link {
            background-color: white;
            color: #1e88e5;
            padding: 8px 15px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            margin-left: 15px;
          }
          #download-link:hover {
            background-color: #f0f0f0;
          }
          #redoc-container {
            margin: 0;
          }
          #release-notes {
            background-color: #f8f9fa;
            padding: 15px 20px;
            margin: 0;
            border-bottom: 1px solid #e0e0e0;
          }
          #release-notes h2 {
            color: #1e88e5;
            font-size: 18px;
            margin-top: 0;
          }
          #release-notes ul {
            margin-bottom: 0;
          }
          #release-notes li {
            margin-bottom: 5px;
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
        <div id="header">
          <h1>VaHire API Documentation v${VERSION.number}</h1>
          <a id="download-link" href="/swagger.json" download="swagger.json">Télécharger swagger.json</a>
        </div>
        <div id="release-notes">
          <h2>Notes de version - v${VERSION.number}</h2>
          <ul>
            ${releaseNotesList}
          </ul>
        </div>
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
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Middleware Auth0
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  });

// Basic route
app.get('/', (req, res) => {
    res.send('Va-Hire Backend is running');
  });

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const recommendationRoutes = require('./routes/recommendation');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const courseRoutes = require('./routes/course');
const conversationRoutes = require('./routes/conversation');
const adminRoutes = require('./routes/admin');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Test
// app.use((req, res, next) => {
//     res.status(200).json((message) => {message: 'Server connected'});
//     next();
// });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// For Stripe webhook - we need raw body for signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Routes calls with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', checkJwt, userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/conversations', checkJwt, conversationRoutes);
app.use('/api/admin', checkJwt, adminRoutes);

// Health check route (no rate limiting)
app.use('/health', healthRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;

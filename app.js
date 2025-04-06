require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const redoc = require('redoc-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middlewares/rateLimiter');
const { accessLogger, errorLogger } = require('./middlewares/logger');
const healthRoutes = require('./routes/health');

const app = express();
mongoose.set('strictQuery', false);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(accessLogger);
app.use(errorLogger);
app.use(apiLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "VaHire API Documentation",
  customfavIcon: "/favicon.ico"
}));

// ReDoc Documentation
app.get('/docs', redoc({
  title: 'VaHire API Documentation',
  spec: swaggerSpecs,
  theme: {
    primaryColor: '#1e88e5',
    typography: {
      fontSize: '16px',
      fontFamily: 'Roboto, sans-serif',
    },
    sidebar: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
    },
  },
}));

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

/**
 * Production environment configuration
 * This file contains settings that should only be applied in production
 */

module.exports = {
  // Security settings
  security: {
    // Set to true in production for enhanced security
    useHelmet: true,
    // Rate limiting options
    rateLimit: {
      // Reduce limits for production
      api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // 100 requests per window
      },
      auth: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5 // 5 login attempts per hour
      }
    },
    // CORS settings
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization']
    }
  },
  
  // Database settings
  database: {
    // MongoDB connection options optimized for production
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // Don't build indexes in production
      poolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }
  },
  
  // Logging configuration
  logging: {
    // In production, only log errors by default
    level: 'error',
    // Disable request body logging in production to prevent sensitive data exposure
    hideRequestBody: true
  },
  
  // File uploads
  uploads: {
    // Maximum allowed file sizes in production (in bytes)
    maxSize: {
      image: 5 * 1024 * 1024, // 5MB for images
      resume: 10 * 1024 * 1024, // 10MB for resumes
      general: 50 * 1024 * 1024 // 50MB for general files
    }
  },
  
  // Caching settings
  cache: {
    enabled: true,
    // Set TTL (time to live) for different types of data
    ttl: {
      projects: 60 * 5, // 5 minutes
      users: 60 * 10, // 10 minutes
      courses: 60 * 30 // 30 minutes
    }
  },
  
  // Error handling
  errors: {
    // In production, don't expose stack traces to clients
    exposeStack: false
  }
}; 
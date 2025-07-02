const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const User = require('../models/User');

// Auth0 JWT verification configuration
const auth0Config = {
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    handleSigningKeyError: (err, cb) => {
      console.error("Auth0 JWKS Error:", err);
      cb(err);
    },
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring(req) {
    // Try to get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    }
    // Try to get token from query parameter as fallback
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
};

// Legacy Auth0 middleware (for backward compatibility)
const checkJwt = expressJwt(auth0Config);

// Error handler for JWT middleware
const handleJwtError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.error("Auth0 JWT Error:", {
      message: err.message,
      code: err.code,
      status: err.status,
      headers: req.headers.authorization ? "Bearer token present" : "No Bearer token",
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    });

    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  next(err);
};

// Utility functions
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  if (req.query.token) {
    return req.query.token;
  }
  return null;
};

const isAuth0Token = (decodedToken) => {
  if (!decodedToken) return false;
  const { header, payload } = decodedToken;
  return header.alg === 'RS256' && 
         payload.iss && 
         payload.iss.includes(process.env.AUTH0_DOMAIN);
};

const handleAuthError = (error, tokenType, req, res) => {
  console.error(`${tokenType} token verification failed:`, error.message);
  return res.status(401).json({ 
    error: "Unauthorized", 
    message: `Invalid or expired ${tokenType} token`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Verify Auth0 token using existing middleware
const verifyAuth0Token = async (req, res) => {
  return new Promise((resolve, reject) => {
    checkJwt(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Verify traditional JWT token
const verifyTraditionalToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { decoded, user };
};

/**
 * Main authentication middleware that supports both Auth0 and traditional JWT
 * This replaces all previous auth middlewares (checkJwt, authMiddleware, hybridAuth)
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({ 
        error: "Unauthorized", 
        message: "No token provided" 
      });
    }

    // Decode token to determine its type
    const decodedToken = jwt.decode(token, { complete: true });
    
    if (!decodedToken) {
      return res.status(401).json({ 
        error: "Unauthorized", 
        message: "Invalid token format" 
      });
    }

    try {
      if (isAuth0Token(decodedToken)) {
        // Handle Auth0 token
        await verifyAuth0Token(req, res);
        
        // Set standardized user info
        req.user = {
          id: req.auth.sub,
          auth0Id: req.auth.sub,
          email: req.auth.email,
          authType: 'auth0'
        };
      } else {
        // Handle traditional JWT token
        const { decoded, user } = await verifyTraditionalToken(token);
        
        // Set user info for traditional JWT
        req.userId = decoded.userId;
        req.user = {
          id: user._id,
          userId: user._id,
          email: user.email,
          role: user.role,
          authType: 'traditional'
        };

        // For compatibility with Auth0 routes
        req.auth = { sub: user._id.toString() };
      }
      
      next();
    } catch (error) {
      const tokenType = isAuth0Token(decodedToken) ? 'Auth0' : 'Traditional';
      return handleAuthError(error, tokenType, req, res);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: "Server Error", 
      message: "Authentication processing failed" 
    });
  }
};

/**
 * Middleware to populate user data from database
 * Should be used after authenticate() middleware
 */
const populateUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    // Use unified approach to find user based on auth type
    const findUserQuery = req.user.authType === 'auth0' 
      ? { auth0Id: req.user.auth0Id }
      : { _id: req.user.userId };

    const user = await User.findOne(findUserQuery);
    
    if (user) {
      req.dbUser = user;
    }

    next();
  } catch (error) {
    console.error('Error fetching user data:', error);
    next();
  }
};

/**
 * Middleware to check if user has admin privileges
 * Requires populateUser() middleware to be used first
 */
const requireAdmin = (req, res, next) => {
  try {
    const user = req.dbUser;
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied: Administrator privileges required' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking admin status', 
      error: error.message 
    });
  }
};

/**
 * Combined middleware for authenticated routes
 * Combines authenticate + populateUser for convenience
 */
const authenticateAndPopulate = [authenticate, populateUser];

/**
 * Combined middleware for admin routes
 * Combines authenticate + populateUser + requireAdmin
 */
const authenticateAdmin = [authenticate, populateUser, requireAdmin];

module.exports = {
  // Main middlewares
  authenticate,
  populateUser,
  requireAdmin,
  
  // Combined middlewares
  authenticateAndPopulate,
  authenticateAdmin,
  
  // Legacy exports (for backward compatibility)
  checkJwt,
  handleJwtError,
  
  // Aliases for better naming
  auth: authenticate,
  withUser: authenticateAndPopulate,
  adminOnly: authenticateAdmin
};

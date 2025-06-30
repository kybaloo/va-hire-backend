const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Auth0 middleware with enhanced error handling
const checkJwt = jwt({
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
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    // Try to get token from query parameter as fallback
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});

// Error handler for JWT middleware
const handleJwtError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.error("Auth0 JWT Error:", {
      message: err.message,
      code: err.code,
      status: err.status,
      headers: req.headers.authorization
        ? "Bearer token present"
        : "No Bearer token",
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

module.exports = { checkJwt, handleJwtError };

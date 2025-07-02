/**
 * Middleware de debug pour Auth0
 * Capture les informations détaillées sur les requêtes d'authentification
 */

const debugAuth0 = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [AUTH0 DEBUG] Requête d'authentification:", {
      method: req.method,
      url: req.url,
      headers: {
        authorization: req.headers.authorization
          ? `Bearer ${req.headers.authorization.substring(7, 20)}...`
          : "Non fourni",
        "content-type": req.headers["content-type"],
        origin: req.headers.origin,
        referer: req.headers.referer,
      },
      query: req.query,
      body: req.method === "POST" ? req.body : undefined,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

const logAuth0Success = (req, res, next) => {
  if (process.env.NODE_ENV === "development" && req.auth) {
    console.log("✅ [AUTH0 SUCCESS] Token validé:", {
      sub: req.auth.sub,
      email: req.auth.email,
      aud: req.auth.aud,
      iss: req.auth.iss,
      exp: new Date(req.auth.exp * 1000).toISOString(),
    });
  }
  next();
};

module.exports = {
  debugAuth0,
  logAuth0Success,
};

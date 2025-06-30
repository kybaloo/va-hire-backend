const express = require("express");
const {
  register,
  login,
  socialRegister,
  completeProfile,
  handleAuth0Login,
} = require("../controllers/authController");
const { checkJwt, handleJwtError } = require("../middleware/auth"); // For Auth0 authentication
const { debugAuth0, logAuth0Success } = require("../middleware/debugAuth0");
const User = require("../models/User");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - passwordConfirm
 *               - firstname
 *               - lastname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the password (must match password)
 *               firstname:
 *                 type: string
 *                 description: User's first name
 *               lastname:
 *                 type: string
 *                 description: User's last name
 *               role:
 *                 type: string
 *                 enum: [user, professional, recruiter]
 *                 description: User's role (optional, defaults to user)
 *               title:
 *                 type: string
 *                 description: User's professional title (optional)
 *               receiveEmails:
 *                 type: boolean
 *                 description: Whether the user wants to receive emails (optional)
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/social-register:
 *   post:
 *     summary: Register or login with social media
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - token
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google, facebook, github]
 *                 description: Social media provider
 *               token:
 *                 type: string
 *                 description: OAuth token from social provider
 *     responses:
 *       200:
 *         description: Social login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *       400:
 *         description: Invalid social login data
 */
router.post("/social-register", socialRegister);

/**
 * @swagger
 * /api/auth/auth0-callback:
 *   get:
 *     summary: Handle Auth0 login callback and user creation/update
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       This endpoint handles authentication callbacks from Auth0, including social logins like Google and LinkedIn.
 *       It requires a valid Auth0 JWT token in the Authorization header.
 *       The endpoint creates a new user if one doesn't exist or updates an existing user's profile with Auth0 data.
 *     responses:
 *       200:
 *         description: Successfully processed Auth0 login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     isProfileComplete:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - Invalid Auth0 token
 *       500:
 *         description: Server error
 */
router.get(
  "/auth0-callback",
  debugAuth0,
  checkJwt,
  logAuth0Success,
  handleAuth0Login
);

/**
 * @swagger
 * /api/auth/complete-profile:
 *   post:
 *     summary: Complete user profile after registration
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User's skills
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     description:
 *                       type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     field:
 *                       type: string
 *                     year:
 *                       type: string
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid profile data
 */
router.post(
  "/complete-profile",
  debugAuth0,
  checkJwt,
  logAuth0Success,
  completeProfile
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the profile information for the authenticated user
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     profile:
 *                       type: object
 *                     isProfileComplete:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 */
router.get("/profile", checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const user = await User.findOne({ auth0Id: userId }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileImage: user.profileImage,
        profile: user.profile,
        socialProviders: user.socialProviders.map((p) => p.provider),
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/test-auth0:
 *   get:
 *     summary: Test Auth0 configuration and token validation
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Auth0 token is valid
 *       401:
 *         description: Invalid or missing token
 */
router.get("/test-auth0", debugAuth0, checkJwt, logAuth0Success, (req, res) => {
  res.status(200).json({
    message: "Auth0 token is valid",
    user: {
      sub: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      aud: req.auth.aud,
      iss: req.auth.iss,
      exp: req.auth.exp,
    },
  });
});

/**
 * @swagger
 * /api/auth/auth0-config:
 *   get:
 *     summary: Get Auth0 configuration metadata (for debugging)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Auth0 configuration metadata
 */
router.get("/auth0-config", (req, res) => {
  res.status(200).json({
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    algorithms: ["RS256"],
    clientSecretConfigured: !!process.env.AUTH0_CLIENT_SECRET,
  });
});

// Error handler for JWT middleware
router.use(handleJwtError);

module.exports = router;

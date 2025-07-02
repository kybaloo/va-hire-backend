# Authentication Middleware Documentation

## Overview

This application now uses a **unified authentication system** that supports both Auth0 and traditional JWT authentication seamlessly. The system has been consolidated into a single middleware located at `middlewares/auth.js`.

## Architecture

### Unified Middleware: `middlewares/auth.js`

The authentication system provides several middleware functions:

#### Core Middlewares

1. **`authenticate`** - Main authentication middleware
   - Supports both Auth0 (RS256) and traditional JWT (HS256) tokens
   - Automatically detects token type and applies appropriate verification
   - Sets `req.user` with standardized user information

2. **`populateUser`** - Database user population
   - Fetches complete user data from database
   - Sets `req.dbUser` with full user object
   - Should be used after `authenticate`

3. **`requireAdmin`** - Admin authorization check
   - Verifies user has admin privileges
   - Requires `populateUser` to be used first
   - Returns 403 for non-admin users

#### Convenience Middlewares

4. **`authenticateAndPopulate`** - Combined auth + user population
   - Equivalent to `[authenticate, populateUser]`
   - Most common use case for protected routes

5. **`authenticateAdmin`** - Complete admin middleware chain
   - Equivalent to `[authenticate, populateUser, requireAdmin]`
   - Use for admin-only routes

#### Aliases

6. **`auth`** - Alias for `authenticate`
7. **`withUser`** - Alias for `authenticateAndPopulate`
8. **`adminOnly`** - Alias for `authenticateAdmin`

## Usage Examples

### Basic Authentication
```javascript
const { authenticate } = require('../middlewares/auth');

router.get('/protected', authenticate, (req, res) => {
  // req.user contains standardized user info
  res.json({ user: req.user });
});
```

### With User Data
```javascript
const { withUser } = require('../middlewares/auth');

router.get('/profile', withUser, (req, res) => {
  // req.dbUser contains full user object from database
  res.json({ user: req.dbUser });
});
```

### Admin Only
```javascript
const { adminOnly } = require('../middlewares/auth');

router.get('/admin-data', adminOnly, (req, res) => {
  // Only admin users can access this
  res.json({ data: 'sensitive admin data' });
});
```

### Route-Level vs App-Level

#### App-Level Authentication
```javascript
// In app.js - applies to all routes under this path
app.use('/api/users', authenticate, userRoutes);
```

#### Route-Level Authentication
```javascript
// In routes - applies to specific routes
router.get('/profile', withUser, controller.getProfile);
router.put('/profile', withUser, controller.updateProfile);
```

## Token Types Supported

### 1. Auth0 Tokens (RS256)
- **Format**: JWT signed with RS256 algorithm
- **Verification**: Uses Auth0's JWKS endpoint
- **Identification**: `iss` claim contains Auth0 domain
- **User Lookup**: By `auth0Id` field in database

### 2. Traditional JWT (HS256)
- **Format**: JWT signed with application's JWT_SECRET
- **Verification**: Uses local secret key
- **Identification**: Algorithm is HS256
- **User Lookup**: By `_id` field in database

## Request Object Properties

After authentication, the following properties are available:

### `req.user` (Set by `authenticate`)
```javascript
{
  id: "user_id",
  email: "user@example.com",
  authType: "auth0" | "traditional",
  // Auth0 specific
  auth0Id: "auth0|123456",
  // Traditional JWT specific  
  userId: ObjectId("..."),
  role: "user|admin|professional|recruiter"
}
```

### `req.dbUser` (Set by `populateUser`)
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  firstname: "John",
  lastname: "Doe",
  role: "user",
  auth0Id: "auth0|123456", // if Auth0 user
  profile: { /* user profile data */ },
  // ... all other user fields from database
}
```

### `req.auth` (Compatibility)
```javascript
{
  sub: "user_id_string" // For Auth0 compatibility
}
```

## Migration from Old System

### Before (Multiple Middlewares)
```javascript
// Old system had multiple auth middlewares
const { checkJwt } = require('../middleware/auth');
const authMiddleware = require('../middlewares/authMiddleware');
const { hybridAuth, getUserData } = require('../middleware/hybridAuth');

// Different middlewares for different auth types
router.get('/route1', checkJwt, handler1);
router.get('/route2', authMiddleware, handler2);
router.get('/route3', hybridAuth, getUserData, handler3);
```

### After (Unified System)
```javascript
// New unified system
const { authenticate, withUser, adminOnly } = require('../middlewares/auth');

// Same middleware works for all auth types
router.get('/route1', authenticate, handler1);
router.get('/route2', authenticate, handler2);
router.get('/route3', withUser, handler3);
router.get('/admin-route', adminOnly, adminHandler);
```

## Error Handling

The authentication middleware provides consistent error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

```json
{
  "error": "Unauthorized", 
  "message": "Invalid or expired Auth0 token",
  "details": "Token verification failed" // in development only
}
```

### 403 Forbidden (Admin Only)
```json
{
  "message": "Access denied: Administrator privileges required"
}
```

### 500 Server Error
```json
{
  "error": "Server Error",
  "message": "Authentication processing failed"
}
```

## Environment Variables Required

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier

# Traditional JWT
JWT_SECRET=your-secret-key
```

## Best Practices

1. **Use `withUser` for most protected routes** - Provides both auth and user data
2. **Use `adminOnly` for admin routes** - Handles complete admin authorization
3. **Apply auth at app level when possible** - Reduces redundancy
4. **Handle errors consistently** - Use the standard error responses
5. **Test both auth types** - Ensure compatibility with Auth0 and traditional JWT

## Troubleshooting

### Common Issues

1. **"No token provided"** - Check Authorization header format: `Bearer <token>`
2. **"Invalid token format"** - Ensure token is a valid JWT
3. **"User not found"** - Check database user exists and auth0Id is set correctly
4. **"Access denied"** - Verify user has correct role for admin routes

### Debug Mode

Set `NODE_ENV=development` to get detailed error messages in API responses.

## Legacy Support

The middleware maintains backward compatibility by exporting legacy functions:
- `checkJwt` - Original Auth0 middleware
- `handleJwtError` - Auth0 error handler

These should be avoided in new code but are available for gradual migration.

# VaHire - Backend API

Welcome to the **VaHire** backend, the engine behind our platform that connects IT professionals with businesses. This backend manages user authentication, profiles, project management, secure payments, and more.

## 🔧 Tech Stack

- **Node.js** / **Express.js**: Backend framework
- **MongoDB** + **Mongoose**: NoSQL database
- **Auth0**: Authentication and user management
- **JWT**: Secures protected routes
- **Stripe**: Secure payments
- **Cloudinary**: File storage (resumes, images, etc.)
- **Socket.IO**: Real-time messaging
- **Express Rate Limit**: API rate limiting
- **Morgan**: Request logging
- **Multer**: File upload handling
- **Swagger/OpenAPI**: API documentation
- **ReDoc**: Interactive API documentation UI

---

## 📁 Project Structure

```
vahire-backend/
│
├── controllers/        # Business logic
│   ├── adminController.js
│   ├── authController.js
│   ├── conversationController.js
│   ├── courseController.js
│   ├── notificationController.js
│   ├── paymentController.js
│   ├── projectController.js
│   ├── reviewController.js
│   └── uploadController.js
│
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   ├── Conversation.js
│   ├── Course.js
│   ├── Review.js
│   └── Notification.js
│
├── routes/            # API routes
│   ├── admin.js
│   ├── auth.js
│   ├── conversation.js
│   ├── course.js
│   ├── notification.js
│   ├── payment.js
│   ├── project.js
│   ├── review.js
│   └── upload.js
│
├── middlewares/       # Express middlewares
│   ├── auth.js
│   ├── errorHandler.js
│   ├── logger.js
│   ├── rateLimiter.js
│   └── validators.js
│
├── config/           # Configuration files
│   ├── cloudinary.js
│   ├── version.js    # Centralized API versioning
│   ├── swagger.js    # OpenAPI/Swagger specification
│   └── production.js
│
├── utils/            # Utility functions
├── logs/             # Application logs
├── scripts/          # Utility scripts
│   └── update-version.js # API version updater script
├── app.js            # Express entry point
├── server.js         # Server launcher
└── .env.example      # Sample configuration
```

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-user/vahire-backend.git
cd vahire-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

#### Required Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vahire

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=90d
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=your-auth0-audience

# Frontend URL for Redirects
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 4. Start the server

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

## 📖 API Documentation

The VaHire API is fully documented using OpenAPI/Swagger. Two interactive documentation UIs are available:

### Swagger UI
- **URL**: `/api-docs`
- **Features**:
  - Interactive API explorer
  - Try out endpoints directly from the browser
  - Complete schema reference

### ReDoc
- **URL**: `/docs`
- **Features**: 
  - Clean, user-friendly interface
  - Version history and release notes
  - Downloadable OpenAPI specification
  - Improved navigation

### OpenAPI Specification
- **URL**: `/swagger.json`
- Raw OpenAPI/Swagger JSON specification
- Can be imported into tools like Postman

## 🔢 Versioning System

VaHire uses semantic versioning (X.Y.Z) for the API:

- **X**: Major version (breaking changes)
- **Y**: Minor version (backward-compatible features)
- **Z**: Patch version (bug fixes)

### Version Management

All version information is centralized in `config/version.js`. To update the version:

#### Option 1: Using the script

```bash
npm run update-version 1.0.3 "Fixed a bug in authentication" "Improved validation"
```

#### Option 2: Manually edit

Modify the `config/version.js` file directly.

### Current Version
The current version is **v1.0.2**, which includes:
- Added `passwordConfirm` field to the registration endpoint documentation
- Fixed missing `Message` schema definition

## 🔐 Authentication

The API uses **Auth0** for authentication. JWT tokens must be sent in the header:

```
Authorization: Bearer <token>
```

### User Roles

- **user**: Regular user
- **professional**: IT professional/freelancer
- **recruiter**: Project owner/recruiter
- **admin**: System administrator

## 🔑 Social Login with Auth0

VaHire supports social login via Auth0, allowing users to sign in with their:
- Google accounts
- LinkedIn profiles
- GitHub accounts
- And other identity providers supported by Auth0

### Setting Up Social Login

1. **Auth0 Configuration:**
   - Create an [Auth0 account](https://auth0.com/) if you don't have one
   - Create a new application in the Auth0 dashboard
   - Configure the following settings:
     - Allowed Callback URLs: `http://localhost:3000/callback` (development) and your production URL
     - Allowed Web Origins: `http://localhost:3000` (development) and your production URL
     - Allowed Logout URLs: `http://localhost:3000` (development) and your production URL

2. **Enable Social Connections in Auth0:**
   - Go to "Authentication" > "Social" in your Auth0 dashboard
   - Enable Google, LinkedIn, or other providers
   - Configure each provider with the required credentials (Client ID, Client Secret)

3. **Environment Configuration:**
   - Update your `.env` file with the following Auth0 variables:
   ```
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=your-audience-uri
   AUTH0_CALLBACK_URL=http://localhost:3000/callback
   ```

4. **Frontend Implementation:**
   - Use the Auth0 SDK in your frontend application
   - Implement the login button for each social provider
   - After successful authentication, the user will be redirected to your callback URL
   - The backend will handle creating/updating user accounts via the `/api/auth/auth0-callback` endpoint

### Social Login Flow

1. User clicks on "Sign in with Google/LinkedIn" on the frontend
2. Auth0 handles the OAuth flow with the social provider
3. Upon successful authentication, Auth0 redirects to your callback URL with an access token
4. Your frontend exchanges this token for an Auth0 JWT token
5. The backend endpoint `/api/auth/auth0-callback` processes the user data from Auth0
6. A user account is created or updated in the database
7. User is authenticated and can use the application

---

## 🧠 API Endpoints

### Authentication
| Method | URL                    | Description                    | Auth Required |
|--------|------------------------|--------------------------------|---------------|
| POST   | `/api/auth/login`      | Login with Auth0              | ❌            |
| POST   | `/api/auth/register`   | Register new user             | ❌            |
| GET    | `/api/auth/profile`    | Get user profile              | ✅            |
| Method | URL                                | Description                              | Auth Required |
|--------|-------------------------------------|------------------------------------------|---------------|
| GET    | `/api/users`                       | List all users                           | ✅            |
| POST   | `/api/users`                       | Create a user profile                    | ✅            |
| GET    | `/api/projects`                    | List available projects                  | ❌            |
| POST   | `/api/projects`                    | Create a project                         | ✅ (recruiter)|
| POST   | `/api/payments/checkout`           | Create a payment session                 | ✅            |
| POST   | `/api/upload`                      | Upload files (resume, profile image)     | ✅            |
| POST   | `/api/reviews`                     | Submit a review                          | ✅            |
| GET    | `/api/notifications`               | Get user notifications                   | ✅            |
| GET    | `/api/conversations`               | Get user conversations                   | ✅            |
| POST   | `/api/conversations/start`         | Start a new conversation                 | ✅            |
| GET    | `/api/courses`                     | Get available courses                    | ❌            |
| POST   | `/api/courses/:id/enroll`          | Enroll in a course                       | ✅            |

For a complete list of endpoints, refer to the API documentation at `/api-docs` or `/docs`.

## 🚀 Deployment

For detailed deployment instructions, refer to the [DEPLOYMENT.md](DEPLOYMENT.md) guide. Some key options include:

### Production-ready Hosting Options:

- **Render**: Easy setup with auto-deploy from GitHub
- **Railway**: Zero-config deployment with scaling options
- **Heroku**: Classic PaaS with add-ons ecosystem
- **AWS/DigitalOcean**: Full control via VPS
- **Docker**: Containerized deployment anywhere

### Quick Deployment Checklist:

1. Configure environment variables
2. Set up MongoDB production database
3. Run tests and security audit
4. Deploy to your preferred platform
5. Set up monitoring and backups

## 🧪 Testing

To run tests:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Fork, branch, make changes and submit a **pull request**.

## 📬 Contact

- **Lead Developer**: TCHANGAI Kybaloo Florentin  
- **Email**: tchangaiflorentin6@gmail.com

---

## 📄 License

MIT © 2025 VaHire
# VaHire Frontend Development Specification

## Overview
VaHire is a platform that connects IT professionals with businesses. The backend is already implemented with Node.js, Express, MongoDB, and Auth0 for authentication. We need a modern, responsive frontend that provides an intuitive user experience for all user roles.

## Technical Stack Requirements
- **Framework**: React.js with TypeScript
- **State Management**: Redux Toolkit or React Context API
- **Styling**: Tailwind CSS for utility-based styling
- **UI Components**: Material UI or Chakra UI
- **Forms**: React Hook Form with Yup validation
- **API Calls**: Axios or React Query
- **Authentication**: Auth0 React SDK with social login support
- **Real-time Communication**: Socket.io client for chat functionality
- **File Uploads**: Integration with Cloudinary

## User Roles and Personas
1. **User**: Basic account with limited access
2. **Professional**: IT freelancers looking for projects
3. **Recruiter**: Businesses posting projects and hiring professionals
4. **Admin**: Platform administrators with full system access

## Key Features & Pages

### 1. Authentication & User Management
- Sign up/Login page with email/password and social login options (Google, LinkedIn)
- User profile creation and completion
- Profile dashboard with edit capabilities
- Account settings page

### 2. Project Management
- Project listing page with search, filter, and sort functionality
- Project details page
- Project creation form (for recruiters)
- Project application system (for professionals)
- Project status tracking

### 3. Messaging System
- Conversation list view
- Chat interface with real-time messaging
- Message notifications
- Ability to start new conversations

### 4. Payment System
- Secure payment processing with Stripe
- Payment history
- Invoice generation
- Payment status tracking

### 5. Review System
- Leave reviews for completed projects
- View received reviews
- Rating system (1-5 stars)

### 6. Course Platform
- Course listing page
- Course details page
- Course enrollment functionality
- Learning dashboard

### 7. Admin Dashboard
- User management
- Project oversight
- System reports and analytics
- Content moderation tools

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `POST /api/auth/social-register`: Social media login
- `GET /api/auth/auth0-callback`: Handle Auth0 login callback
- `POST /api/auth/complete-profile`: Complete user profile
- `GET /api/auth/profile`: Get user profile

### Users
- `GET /api/users`: Get all users (admin)
- `GET /api/users/profile`: Get current user profile
- `PUT /api/users/profile`: Update current user profile
- `GET /api/users/:userId`: Get specific user
- `PUT /api/users/:userId`: Update specific user
- `DELETE /api/users/:userId`: Delete user

### Projects
- `GET /api/projects`: List all projects
- `POST /api/projects`: Create new project
- `GET /api/projects/:projectId`: Get project details
- `PUT /api/projects/:projectId`: Update project
- `DELETE /api/projects/:projectId`: Delete project

### Payments
- `POST /api/payments/checkout`: Create payment session
- `GET /api/payments/status/:sessionId`: Get payment status
- `POST /api/payments/webhook`: Handle Stripe webhook

### Uploads
- `POST /api/upload/profile-image`: Upload profile image
- `POST /api/upload/resume`: Upload resume
- `POST /api/upload/project/:projectId`: Upload project file
- `DELETE /api/upload/delete`: Delete uploaded file

### Reviews
- `GET /api/reviews`: Get all reviews
- `POST /api/reviews`: Create a review
- `GET /api/reviews/:reviewId`: Get specific review
- `PUT /api/reviews/:reviewId`: Update review
- `DELETE /api/reviews/:reviewId`: Delete review

### Notifications
- `GET /api/notifications`: Get all notifications
- `GET /api/notifications/:notificationId`: Get specific notification
- `PUT /api/notifications/:notificationId/read`: Mark notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read
- `DELETE /api/notifications/:notificationId`: Delete notification

### Conversations
- `GET /api/conversations`: Get all conversations
- `POST /api/conversations`: Create new conversation
- `GET /api/conversations/:conversationId`: Get conversation with messages
- `POST /api/conversations/:conversationId/messages`: Send message
- `DELETE /api/conversations/:conversationId`: Delete conversation

## Authentication Flow

Implement Auth0 integration with the following flow:
1. User clicks Sign Up/Login
2. User chooses email/password or social login (Google, LinkedIn, etc.)
3. User completes Auth0 authentication
4. On successful authentication, send token to backend at `/api/auth/auth0-callback`
5. Backend creates/updates user and returns user data
6. Frontend stores token and user data
7. If user profile is incomplete, redirect to profile completion page
8. Once profile is complete, redirect to dashboard

## UI/UX Guidelines

### Design System
- **Color Palette**:
  - Primary: #1E88E5 (Blue)
  - Secondary: #43A047 (Green)
  - Accent: #FFC107 (Amber)
  - Error: #E53935 (Red)
  - Background: #F5F7FA
  - Text: #333333 (Dark Gray)

- **Typography**:
  - Primary Font: Roboto or Inter
  - Headings: Semi-bold, 24px-48px
  - Body: Regular, 16px
  - Small Text: 14px

- **Components**:
  - Buttons with subtle hover effects
  - Cards with slight shadows
  - Forms with inline validation
  - Responsive tables for data display
  - Toast notifications for system messages

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1280px
- Collapsible sidebar for navigation on smaller screens
- Optimized forms for mobile input

## Detailed Page Requirements

### Landing Page
- Hero section with value proposition
- Features overview
- Testimonials/reviews section
- Call-to-action buttons
- Footer with links to privacy policy, terms, etc.

### Dashboard
- User profile summary
- Activity feed
- Quick actions section
- Stats overview (projects, earnings, etc.)
- Recent notifications and messages

### Project Listing
- Search bar
- Filter panel (budget range, skills, status)
- Sort options (date, budget, etc.)
- Card or list view toggle
- Pagination or infinite scroll

### Project Details
- Title and description
- Budget and timeline
- Skills required
- Apply button (for professionals)
- Chat with owner button
- Status indicator
- Attachment section
- Reviews and ratings (if completed)

### Profile Page
- Profile image
- Contact information
- Skills and experience
- Portfolio/previous work
- Reviews and ratings
- Availability status

### Messaging Interface
- Conversations list sidebar
- Message thread view
- Input area with attachment support
- Read receipts
- Typing indicators
- New message notifications

### Payment Flow
- Project selection
- Payment method selection
- Amount confirmation
- Secure checkout with Stripe
- Success/failure page
- Receipt generation

## Additional Technical Requirements

### State Management
- Implement proper loading, error, and success states for all API calls
- Handle offline capabilities where appropriate
- Persist important user data in local storage

### Performance Optimization
- Implement code splitting for route-based components
- Use React.memo and useCallback where appropriate
- Implement virtualization for long lists
- Optimize images with lazy loading

### Security
- Implement proper token storage and refresh mechanism
- Sanitize all user inputs
- Implement CSRF protection
- Apply appropriate content security policies

### Accessibility
- Aim for WCAG 2.1 AA compliance
- Use semantic HTML elements
- Implement proper focus management
- Ensure proper color contrast
- Add appropriate ARIA attributes

### Testing Requirements
- Unit tests for utility functions and hooks
- Component tests for UI elements
- Integration tests for complex workflows
- End-to-end tests for critical user journeys

## Development Process
- Use Git for version control
- Follow a feature-branch workflow
- Implement CI/CD with automated testing
- Use ESLint and Prettier for code quality
- Document components with Storybook

## Delivery Requirements
- Source code in a Git repository
- Comprehensive README with setup instructions
- Environment configuration documentation
- Build scripts for production deployment
- Performance metrics report

## Timeline
- Phase 1 (2 weeks): Authentication and user management
- Phase 2 (2 weeks): Project listing and details
- Phase 3 (2 weeks): Messaging system
- Phase 4 (2 weeks): Payments and reviews
- Phase 5 (1 week): Admin dashboard
- Phase 6 (1 week): Testing, optimization, and final polish

## Success Criteria
- All user roles can successfully perform their core functions
- Frontend successfully integrates with all backend APIs
- UI is responsive across devices (mobile, tablet, desktop)
- Core user journeys are optimized for conversion
- Authentication flow, including social login, works seamlessly
- Performance meets targets (First Contentful Paint < 1.2s)
- All automated tests pass 
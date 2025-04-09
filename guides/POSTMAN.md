# VaHire API Postman Guide

This guide provides instructions for using Postman to interact with the VaHire API. Postman is a popular API client that makes it easy to create, share, test, and document APIs.

## Table of Contents

1. [Setting Up Postman](#setting-up-postman)
2. [Importing the Collection](#importing-the-collection)
3. [Environment Configuration](#environment-configuration)
4. [Authentication](#authentication)
5. [Using the Collection](#using-the-collection)
6. [Testing API Endpoints](#testing-api-endpoints)
7. [VaHire API Collection Structure](#vahire-api-collection-structure)
8. [Common Issues](#common-issues)
9. [Advanced Usage](#advanced-usage)

## Setting Up Postman

1. Download and install Postman from [postman.com](https://www.postman.com/downloads/)
2. Create a free account or sign in to your existing account
3. Create a new workspace for VaHire API testing (optional)

## Importing the Collection

### Option 1: Import from JSON File

1. Download the VaHire Postman Collection JSON file from the project repository
2. In Postman, click "Import" in the top left corner
3. Drag and drop the JSON file or browse to select it
4. Click "Import" to add the collection to your workspace

### Option 2: Create Collection Manually

1. Click "Collections" in the sidebar, then click the "+" icon
2. Name the collection "VaHire API"
3. Add folders for each API category (Authentication, Users, Projects, etc.)
4. Create requests for each endpoint as detailed in the [API documentation](DOCUMENTATION.md)

## Environment Configuration

Setting up environments helps you quickly switch between development, staging, and production.

1. Click "Environments" in the sidebar, then click the "+" icon
2. Create the following environments:
   - Development
   - Staging
   - Production

3. For each environment, add these variables:

| Variable          | Initial Value (Development)       | Description                |
|-------------------|-----------------------------------|----------------------------|
| `baseUrl`         | `http://localhost:5000`           | API base URL               |
| `authToken`       | Empty (will be set via script)    | JWT token for auth         |
| `userId`          | Empty (will be set after login)   | Current user ID            |
| `projectId`       | Empty (for testing)               | Sample project ID          |
| `conversationId`  | Empty (for testing)               | Sample conversation ID     |
| `courseId`        | Empty (for testing)               | Sample course ID           |

4. For staging and production, update the `baseUrl` appropriately:
   - Staging: `https://staging-api.vahire.example.com`
   - Production: `https://api.vahire.example.com`

## Authentication

### Setting Up Auth in Postman

1. Create a "Login" request in the Authentication folder:
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/login`
   - Body (raw JSON):
   ```json
   {
     "email": "your.email@example.com",
     "password": "your-password"
   }
   ```

2. Add a "Tests" script to automatically extract and store the JWT token:
   ```javascript
   // Parse response
   var response = pm.response.json();
   
   // Check if login was successful
   if (response.data && response.data.token) {
       // Set auth token in environment variables
       pm.environment.set("authToken", response.data.token);
       
       // Extract and store user ID if available
       if (response.data.user && response.data.user.id) {
           pm.environment.set("userId", response.data.user.id);
       }
       
       console.log("Auth token saved to environment variables");
   } else {
       console.error("Failed to extract auth token", response);
   }
   ```

3. Set up a Collection-level Authorization:
   - Click on the VaHire API collection
   - Go to the "Authorization" tab
   - Select "Bearer Token" as the Type
   - Set the Token to `{{authToken}}`
   - This applies to all requests in the collection unless overridden

## Using the Collection

### Folder Structure

The collection is organized into folders matching the API documentation sections:

- Authentication
- Users
- Projects
- Payments
- Reviews
- Conversations
- Courses
- File Uploads
- Notifications
- Admin

Each folder contains requests for all endpoints in that category.

### Request Examples

#### 1. Create User (Registration)

- Method: POST
- URL: `{{baseUrl}}/api/auth/register`
- Body (raw JSON):
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "professional"
}
```

#### 2. Get User Profile

- Method: GET
- URL: `{{baseUrl}}/api/auth/profile`
- Authorization: Bearer Token (inherited from collection)

#### 3. Create Project

- Method: POST
- URL: `{{baseUrl}}/api/projects`
- Body (raw JSON):
```json
{
  "title": "Mobile App Development",
  "description": "Develop a cross-platform mobile app for both iOS and Android",
  "budget": 8000,
  "skillsRequired": ["React Native", "JavaScript", "Firebase"]
}
```
- Tests:
```javascript
// Store project ID for future requests
var response = pm.response.json();
if (response.data && response.data.id) {
    pm.environment.set("projectId", response.data.id);
    console.log("Project ID saved:", response.data.id);
}
```

#### 4. Upload Profile Image

- Method: POST
- URL: `{{baseUrl}}/api/upload/profile-image`
- Body (form-data):
  - Key: `image`
  - Value: Select file (JPG/PNG)
  - Type: File

## Testing API Endpoints

### Pre-request Scripts

Use pre-request scripts to set up data before sending a request. Example for creating test data:

```javascript
// Generate a random email for testing
pm.environment.set("testEmail", "user_" + Date.now() + "@example.com");

// Set current timestamp for testing
pm.environment.set("timestamp", Date.now());
```

### Test Scripts

Add test scripts to verify responses:

```javascript
// Basic tests for successful response
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response contains expected data", function() {
    var response = pm.response.json();
    pm.expect(response.data).to.be.an('object');
    pm.expect(response.message).to.eql("Operation successful");
});

// Validate specific fields
pm.test("User data is correct", function() {
    var response = pm.response.json();
    pm.expect(response.data.firstname).to.eql("John");
    pm.expect(response.data.email).to.include("@");
});
```

### Running Collections

You can run the entire collection or specific folders to test multiple endpoints:

1. Click on the collection or folder
2. Click "Run" in the top bar
3. Select the requests you want to run
4. Choose your environment
5. Click "Run VaHire API"

## VaHire API Collection Structure

Here's a detailed structure for the complete VaHire API Postman collection:

### 1. Authentication Folder

| Request Name        | Method | Endpoint                  | Description                      |
|---------------------|--------|---------------------------|----------------------------------|
| Register            | POST   | `/api/auth/register`      | Create a new user account        |
| Login               | POST   | `/api/auth/login`         | Authenticate and get token       |
| Get Profile         | GET    | `/api/auth/profile`       | Get current user profile         |
| Update Profile      | PUT    | `/api/auth/profile`       | Update current user profile      |

### 2. Users Folder

| Request Name        | Method | Endpoint                  | Description                      |
|---------------------|--------|---------------------------|----------------------------------|
| Get All Users       | GET    | `/api/users`              | Get list of all users (admin)    |
| Get User            | GET    | `/api/users/{{userId}}`   | Get specific user details        |
| Update User         | PUT    | `/api/users/{{userId}}`   | Update specific user details     |
| Delete User         | DELETE | `/api/users/{{userId}}`   | Delete a user account (admin)    |

### 3. Projects Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Get All Projects    | GET    | `/api/projects`                    | Get list of all projects         |
| Get Project         | GET    | `/api/projects/{{projectId}}`      | Get specific project details     |
| Create Project      | POST   | `/api/projects`                    | Create a new project             |
| Update Project      | PUT    | `/api/projects/{{projectId}}`      | Update project details           |
| Delete Project      | DELETE | `/api/projects/{{projectId}}`      | Delete a project                 |
| Assign Project      | PUT    | `/api/projects/{{projectId}}/assign` | Assign project to professional   |
| Complete Project    | PUT    | `/api/projects/{{projectId}}/complete` | Mark project as complete     |

### 4. Payments Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Create Checkout     | POST   | `/api/payments/checkout`           | Create payment checkout session  |
| Get Payment Status  | GET    | `/api/payments/status/{{sessionId}}` | Check payment status           |

### 5. Reviews Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Submit Review       | POST   | `/api/reviews`                      | Submit a new review             |
| Get User Reviews    | GET    | `/api/reviews/user/{{userId}}`      | Get reviews for a specific user |
| Get Review          | GET    | `/api/reviews/{{reviewId}}`         | Get specific review details     |
| Delete Review       | DELETE | `/api/reviews/{{reviewId}}`         | Delete a review                 |

### 6. Conversations Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Get Conversations   | GET    | `/api/conversations`                | Get all user conversations       |
| Get Conversation    | GET    | `/api/conversations/{{conversationId}}` | Get specific conversation with messages |
| Send Message        | POST   | `/api/conversations/{{conversationId}}/message` | Send a new message  |
| Start Conversation  | POST   | `/api/conversations/start`          | Start a new conversation         |

### 7. Courses Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Get All Courses     | GET    | `/api/courses`                      | Get list of all courses          |
| Get Course          | GET    | `/api/courses/{{courseId}}`         | Get specific course details      |
| Create Course       | POST   | `/api/courses`                      | Create a new course              |
| Update Course       | PUT    | `/api/courses/{{courseId}}`         | Update course details            |
| Delete Course       | DELETE | `/api/courses/{{courseId}}`         | Delete a course                  |
| Enroll in Course    | POST   | `/api/courses/{{courseId}}/enroll`  | Enroll in a course               |
| Update Progress     | PUT    | `/api/courses/{{courseId}}/progress` | Update course progress          |
| Add Course Review   | POST   | `/api/courses/{{courseId}}/review`  | Add a review for a course        |

### 8. File Uploads Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Upload Profile Image| POST   | `/api/upload/profile-image`         | Upload user profile image        |
| Upload Resume       | POST   | `/api/upload/resume`                | Upload user resume               |
| Upload Project File | POST   | `/api/upload/project/{{projectId}}` | Upload file for a project        |
| Delete File         | DELETE | `/api/upload/delete`                | Delete an uploaded file          |

### 9. Notifications Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Get Notifications   | GET    | `/api/notifications`                | Get user notifications           |
| Mark as Read        | POST   | `/api/notifications/mark-read`      | Mark notifications as read       |
| Mark All as Read    | POST   | `/api/notifications/mark-all-read`  | Mark all notifications as read   |
| Delete Notification | DELETE | `/api/notifications/{{notificationId}}` | Delete a notification        |

### 10. Admin Folder

| Request Name        | Method | Endpoint                           | Description                      |
|---------------------|--------|------------------------------------|----------------------------------|
| Get All Users       | GET    | `/api/admin/users`                  | Admin: Get all users with filters|
| Get All Projects    | GET    | `/api/admin/projects`               | Admin: Get all projects with filters |
| Get System Reports  | GET    | `/api/admin/reports`                | Generate system reports          |
| Ban User            | PUT    | `/api/admin/ban-user/{{userId}}`    | Ban a user                       |
| Unban User          | PUT    | `/api/admin/unban-user/{{userId}}`  | Unban a user                     |

## Common Issues

### Authentication Errors

If you get 401 Unauthorized errors:

1. Make sure you've run the login request to get a valid token
2. Check if your token has expired (tokens usually expire after a set time)
3. Verify the token is correctly set in your environment variables

### Content Type Errors

For requests with a JSON body:

1. Ensure the "Content-Type: application/json" header is set
2. Verify your JSON is valid with no syntax errors

### File Upload Issues

For file upload requests:

1. Make sure you're using form-data as the body type
2. Check that the file type is supported (JPG/PNG for images, PDF/DOC for resumes)
3. Verify the file size is within limits

## Advanced Usage

### Collection Runner for Automated Testing

1. Create a test data file (JSON or CSV) with multiple test cases
2. Use the Collection Runner to iterate through test cases
3. Export test results for documentation or CI/CD integration

### Environment Variables for Dynamic Testing

Use environment variables for dynamic testing scenarios:

```javascript
// Pre-request script to set up test data
let testData = {
    professional: {
        email: "pro@example.com",
        password: "password123",
        role: "professional"
    },
    recruiter: {
        email: "recruiter@example.com",
        password: "password123",
        role: "recruiter"
    },
    admin: {
        email: "admin@example.com",
        password: "password123",
        role: "admin"
    }
};

// Store test data for current role
let currentRole = "professional"; // Change this to test different roles
pm.environment.set("testUser", JSON.stringify(testData[currentRole]));
```

Then in your requests:

```javascript
// Parse the test user from environment
let testUser = JSON.parse(pm.environment.get("testUser"));

// Use in request body
pm.request.body.update({
    mode: 'raw',
    raw: JSON.stringify({
        email: testUser.email,
        password: testUser.password
    }),
    options: { raw: { language: 'json' } }
});
```

### Generating Documentation from Postman

1. Add descriptions to each request and folder
2. Include example responses
3. Export the collection as documentation
4. Share with your team or publish to a Postman documentation site

### Automated Request Flows

For testing complete workflows, create folders for common user journeys:

#### User Registration and Profile Flow

1. Register as Professional
2. Login
3. Update Profile
4. Upload Profile Image
5. Upload Resume

#### Project Creation and Payment Flow

1. Login as Recruiter
2. Create Project
3. Login as Professional
4. View Project Details
5. Begin Conversation
6. Complete Project
7. Submit Payment
8. Submit Review

### Integrating with CI/CD

For automated testing in CI/CD pipelines:

1. Install Postman CLI (Newman) in your CI environment:
   ```bash
   npm install -g newman
   ```

2. Export your collection and environment as JSON files

3. Add this command to your CI script:
   ```bash
   newman run VaHire_API.postman_collection.json -e Development.postman_environment.json
   ```

This allows you to run API tests automatically when code is pushed to your repository. 
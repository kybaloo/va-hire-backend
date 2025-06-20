# VaHire API Documentation

This document provides comprehensive documentation for the VaHire API, including endpoints, request/response formats, and examples.

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Projects](#projects)
5. [Payments](#payments)
6. [Reviews](#reviews)
7. [Conversations](#conversations)
8. [Courses](#courses)
9. [File Uploads](#file-uploads)
10. [Notifications](#notifications)
11. [Admin](#admin)
12. [Error Handling](#error-handling)

## Introduction

The VaHire API is a RESTful API built with Express.js that powers the VaHire platform. It follows standard REST conventions and returns responses in JSON format.

### Base URL

```
Production: https://vahire-api.example.com
Development: http://localhost:5000
```

### Request Format

All requests should be made with the appropriate HTTP method (GET, POST, PUT, DELETE) and include the following headers:

```
Content-Type: application/json
Accept: application/json
```

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Response Format

All responses are returned in JSON format with the following structure:

```json
{
  "data": {}, // Response data (object or array)
  "message": "Operation successful", // Success/error message
  "status": 200, // HTTP status code
  "pagination": {} // Optional pagination information
}
```

For error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "status": 400 // HTTP status code
}
```

## Authentication

VaHire uses Auth0 for authentication and JSON Web Tokens (JWT) for authorization.

### Auth Flow

1. Users authenticate through Auth0
2. Upon successful authentication, Auth0 provides a JWT token
3. This token must be included in the `Authorization` header for protected API routes

### Endpoints

#### Register User

```
POST /api/auth/register
```

Create a new user account.

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "professional" // Optional, defaults to "user"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "data": {
    "id": "60a6c5e89a8f7e1234567890",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "professional",
    "createdAt": "2023-05-20T12:00:00.000Z"
  }
}
```

#### Login

```
POST /api/auth/login
```

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "role": "professional"
    }
  }
}
```

#### Get User Profile

```
GET /api/auth/profile
```

Retrieve the profile of the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "60a6c5e89a8f7e1234567890",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "professional",
    "profile": {
      "title": "Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": "5 years in web development",
      "portfolio": "https://johndoe.portfolio.com"
    },
    "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg",
    "resume": "https://cloudinary.com/vahire/resumes/johndoe.pdf",
    "createdAt": "2023-05-20T12:00:00.000Z"
  }
}
```

#### Update User Profile

```
PUT /api/auth/profile
```

Update the profile of the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Smith",
  "profile": {
    "title": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "AWS"],
    "experience": "7 years in web development",
    "portfolio": "https://johnsmith.portfolio.com"
  }
}
```

**Response (200 OK):**

```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "60a6c5e89a8f7e1234567890",
    "firstname": "John",
    "lastname": "Smith",
    "email": "john.doe@example.com",
    "role": "professional",
    "profile": {
      "title": "Senior Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js", "AWS"],
      "experience": "7 years in web development",
      "portfolio": "https://johnsmith.portfolio.com"
    },
    "updatedAt": "2023-05-21T14:30:00.000Z"
  }
}
```

### Role-Based Access Control

The API implements role-based access control with the following roles:

1. **user**: Basic access to the platform
2. **professional**: IT professionals/freelancers who can be hired for projects
3. **recruiter**: Business users who can post projects and hire professionals
4. **admin**: System administrators with full access to all functions 

## Users

The Users API allows you to manage user accounts, profiles, and related operations.

### Endpoints

#### Get All Users

```
GET /api/users
```

Retrieve a list of all users (admin access required).

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 20)
role: Filter by role (professional, recruiter, user, admin)
search: Search by name or email
```

**Response (200 OK):**

```json
{
  "data": {
    "users": [
      {
        "id": "60a6c5e89a8f7e1234567890",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "role": "professional",
        "createdAt": "2023-05-20T12:00:00.000Z"
      },
      // More users...
    ],
    "totalPages": 5,
    "currentPage": 1
  }
}
```

#### Get User by ID

```
GET /api/users/:userId
```

Retrieve a specific user by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "60a6c5e89a8f7e1234567890",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "professional",
    "profile": {
      "title": "Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": "5 years in web development",
      "portfolio": "https://johndoe.portfolio.com"
    },
    "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg",
    "resume": "https://cloudinary.com/vahire/resumes/johndoe.pdf",
    "createdAt": "2023-05-20T12:00:00.000Z"
  }
}
```

#### Update User

```
PUT /api/users/:userId
```

Update a specific user. Users can only update their own profiles unless they are admins.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Smith",
  "profile": {
    "title": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "AWS"],
    "experience": "7 years in web development",
    "portfolio": "https://johnsmith.portfolio.com"
  }
}
```

**Response (200 OK):**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "60a6c5e89a8f7e1234567890",
    "firstname": "John",
    "lastname": "Smith",
    "email": "john.doe@example.com",
    "role": "professional",
    "profile": {
      "title": "Senior Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js", "AWS"],
      "experience": "7 years in web development",
      "portfolio": "https://johnsmith.portfolio.com"
    },
    "updatedAt": "2023-05-21T14:30:00.000Z"
  }
}
```

#### Delete User

```
DELETE /api/users/:userId
```

Delete a user account (admin access required).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

## Projects

The Projects API allows you to manage projects, including creation, updates, and assignment.

### Endpoints

#### Get All Projects

```
GET /api/projects
```

Retrieve a list of all projects with optional filtering.

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 10)
status: Filter by status (en cours, terminé, payé)
search: Search by title or description
skills: Filter by required skills (comma-separated)
```

**Response (200 OK):**

```json
{
  "data": {
    "projects": [
      {
        "id": "60d2c5e89a8f7e1234567890",
        "title": "E-commerce Website Development",
        "description": "Development of a full-featured e-commerce platform with payment integration",
        "budget": 5000,
        "skillsRequired": ["JavaScript", "React", "Node.js", "MongoDB"],
        "status": "en cours",
        "owner": {
          "id": "60a6c5e89a8f7e1234567891",
          "firstname": "Jane",
          "lastname": "Smith"
        },
        "createdAt": "2023-06-10T09:00:00.000Z"
      },
      // More projects...
    ],
    "totalPages": 3,
    "currentPage": 1
  }
}
```

#### Get Project by ID

```
GET /api/projects/:projectId
```

Retrieve a specific project by ID.

**Response (200 OK):**

```json
{
  "data": {
    "id": "60d2c5e89a8f7e1234567890",
    "title": "E-commerce Website Development",
    "description": "Development of a full-featured e-commerce platform with payment integration",
    "budget": 5000,
    "skillsRequired": ["JavaScript", "React", "Node.js", "MongoDB"],
    "status": "en cours",
    "owner": {
      "id": "60a6c5e89a8f7e1234567891",
      "firstname": "Jane",
      "lastname": "Smith",
      "email": "jane.smith@example.com"
    },
    "assignedTo": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com"
    },
    "attachments": [
      {
        "url": "https://cloudinary.com/vahire/projects/spec.pdf",
        "filename": "project_specification.pdf",
        "mimetype": "application/pdf",
        "uploadedAt": "2023-06-10T10:15:00.000Z"
      }
    ],
    "createdAt": "2023-06-10T09:00:00.000Z"
  }
}
```

#### Create Project

```
POST /api/projects
```

Create a new project. Requires recruiter role.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Mobile App Development",
  "description": "Develop a cross-platform mobile app for both iOS and Android",
  "budget": 8000,
  "skillsRequired": ["React Native", "JavaScript", "Firebase"]
}
```

**Response (201 Created):**

```json
{
  "message": "Project created successfully",
  "data": {
    "id": "60d2c5e89a8f7e1234567892",
    "title": "Mobile App Development",
    "description": "Develop a cross-platform mobile app for both iOS and Android",
    "budget": 8000,
    "skillsRequired": ["React Native", "JavaScript", "Firebase"],
    "status": "en cours",
    "owner": {
      "id": "60a6c5e89a8f7e1234567891",
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "createdAt": "2023-06-15T14:00:00.000Z"
  }
}
```

#### Update Project

```
PUT /api/projects/:projectId
```

Update a project. Only the project owner or an admin can update a project.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Mobile App Development - Updated",
  "description": "Develop a cross-platform mobile app with additional features",
  "budget": 10000,
  "skillsRequired": ["React Native", "JavaScript", "Firebase", "AWS"]
}
```

**Response (200 OK):**

```json
{
  "message": "Project updated successfully",
  "data": {
    "id": "60d2c5e89a8f7e1234567892",
    "title": "Mobile App Development - Updated",
    "description": "Develop a cross-platform mobile app with additional features",
    "budget": 10000,
    "skillsRequired": ["React Native", "JavaScript", "Firebase", "AWS"],
    "status": "en cours",
    "updatedAt": "2023-06-16T10:30:00.000Z"
  }
}
```

#### Delete Project

```
DELETE /api/projects/:projectId
```

Delete a project. Only the project owner or an admin can delete a project.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Project deleted successfully"
}
```

#### Assign Project

```
PUT /api/projects/:projectId/assign
```

Assign a project to a professional.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "professionalId": "60a6c5e89a8f7e1234567890"
}
```

**Response (200 OK):**

```json
{
  "message": "Project assigned successfully",
  "data": {
    "id": "60d2c5e89a8f7e1234567892",
    "title": "Mobile App Development - Updated",
    "assignedTo": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe"
    },
    "status": "en cours",
    "updatedAt": "2023-06-17T09:45:00.000Z"
  }
}
```

#### Mark Project as Complete

```
PUT /api/projects/:projectId/complete
```

Mark a project as complete. Only the project owner or an admin can mark a project as complete.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Project marked as complete",
  "data": {
    "id": "60d2c5e89a8f7e1234567892",
    "title": "Mobile App Development - Updated",
    "status": "terminé",
    "updatedAt": "2023-07-01T16:20:00.000Z"
  }
}
```

## Payments

The Payments API handles payment processing using Stripe integration.

### Endpoints

#### Create Checkout Session

```
POST /api/payments/checkout
```

Create a new payment checkout session for a project.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "projectId": "60d2c5e89a8f7e1234567890"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
    "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0"
  }
}
```

#### Get Payment Status

```
GET /api/payments/status/:sessionId
```

Check the status of a payment.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "status": "complete",
    "session": {
      "id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
      "payment_status": "paid",
      "amount_total": 5000,
      "currency": "usd",
      "customer_details": {
        "email": "jane.smith@example.com",
        "name": "Jane Smith"
      },
      "created": 1625145600
    }
  }
}
```

#### Stripe Webhook Handler

```
POST /api/payments/webhook
```

Handles Stripe webhook events. This endpoint is called directly by Stripe when certain events occur.

**Request Body:**
Stripe webhook event payload

**Response (200 OK):**

```json
{
  "received": true
}
```

### Payment Flow

1. Client creates a checkout session with the project ID
2. Client is redirected to the Stripe checkout page
3. After payment, client is redirected back to the application
4. Stripe sends a webhook notification to our server
5. Server updates the project status to "payé" (paid)
6. The professional receives payment according to the defined payout schedule

## Reviews

The Reviews API allows users to submit and manage reviews for completed projects.

### Endpoints

#### Submit Review

```
POST /api/reviews
```

Submit a review for a completed project.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "projectId": "60d2c5e89a8f7e1234567890",
  "rating": 4,
  "comment": "Great work! The project was delivered on time and met all requirements."
}
```

**Response (201 Created):**

```json
{
  "message": "Review submitted successfully",
  "data": {
    "id": "60e3d5e89a8f7e1234567890",
    "project": "60d2c5e89a8f7e1234567890",
    "reviewer": {
      "id": "60a6c5e89a8f7e1234567891",
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "reviewed": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe"
    },
    "rating": 4,
    "comment": "Great work! The project was delivered on time and met all requirements.",
    "createdAt": "2023-07-05T13:25:00.000Z"
  }
}
```

#### Get Reviews for User

```
GET /api/reviews/user/:userId
```

Retrieve all reviews for a specific user.

**Response (200 OK):**

```json
{
  "data": {
    "reviews": [
      {
        "id": "60e3d5e89a8f7e1234567890",
        "project": {
          "id": "60d2c5e89a8f7e1234567890",
          "title": "E-commerce Website Development"
        },
        "reviewer": {
          "id": "60a6c5e89a8f7e1234567891",
          "firstname": "Jane",
          "lastname": "Smith",
          "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
        },
        "rating": 4,
        "comment": "Great work! The project was delivered on time and met all requirements.",
        "createdAt": "2023-07-05T13:25:00.000Z"
      },
      // More reviews...
    ]
  }
}
```

#### Get Specific Review

```
GET /api/reviews/:reviewId
```

Retrieve a specific review by ID.

**Response (200 OK):**

```json
{
  "data": {
    "id": "60e3d5e89a8f7e1234567890",
    "project": {
      "id": "60d2c5e89a8f7e1234567890",
      "title": "E-commerce Website Development"
    },
    "reviewer": {
      "id": "60a6c5e89a8f7e1234567891",
      "firstname": "Jane",
      "lastname": "Smith",
      "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
    },
    "reviewed": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
    },
    "rating": 4,
    "comment": "Great work! The project was delivered on time and met all requirements.",
    "createdAt": "2023-07-05T13:25:00.000Z"
  }
}
```

#### Delete Review

```
DELETE /api/reviews/:reviewId
```

Delete a review. Only the reviewer or an admin can delete a review.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Review deleted successfully"
}
```

### Review Policies

1. Reviews can only be submitted for completed projects
2. A user can only review a project once
3. Both the project owner and the professional can review each other
4. Reviews are visible to all users
5. Average ratings are calculated for each user profile 

## File Uploads

The File Uploads API handles file uploads to Cloudinary, including profile images, resumes, and project files.

### Endpoints

#### Upload Profile Image

```
POST /api/upload/profile-image
```

Upload a profile image for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
image: (file) - The image file to upload
```

**Response (200 OK):**

```json
{
  "message": "Profile image uploaded successfully",
  "data": {
    "imageUrl": "https://cloudinary.com/vahire/images/johndoe.jpg",
    "user": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
    }
  }
}
```

#### Upload Resume

```
POST /api/upload/resume
```

Upload a resume for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
resume: (file) - The resume file to upload (PDF, DOC, DOCX)
```

**Response (200 OK):**

```json
{
  "message": "Resume uploaded successfully",
  "data": {
    "resumeUrl": "https://cloudinary.com/vahire/resumes/johndoe.pdf",
    "user": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "resume": "https://cloudinary.com/vahire/resumes/johndoe.pdf"
    }
  }
}
```

#### Upload Project File

```
POST /api/upload/project/:projectId
```

Upload a file for a specific project.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
file: (file) - The file to upload
```

**Response (200 OK):**

```json
{
  "message": "Project file uploaded successfully",
  "data": {
    "fileUrl": "https://cloudinary.com/vahire/projects/specification.pdf",
    "project": {
      "id": "60d2c5e89a8f7e1234567890",
      "title": "E-commerce Website Development",
      "attachments": [
        {
          "url": "https://cloudinary.com/vahire/projects/specification.pdf",
          "filename": "specification.pdf",
          "mimetype": "application/pdf",
          "uploadedAt": "2023-06-12T11:20:00.000Z"
        }
      ]
    }
  }
}
```

#### Delete File

```
DELETE /api/upload/delete
```

Delete a previously uploaded file.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "fileUrl": "https://cloudinary.com/vahire/projects/specification.pdf"
}
```

**Response (200 OK):**

```json
{
  "message": "File deleted successfully"
}
```

### File Upload Restrictions

- **Profile Images**: JPG, JPEG, PNG (max 5MB)
- **Resumes**: PDF, DOC, DOCX (max 10MB)
- **Project Files**: JPG, JPEG, PNG, PDF, DOC, DOCX, ZIP (max 50MB)

Files are stored in Cloudinary and organized in the following folders:
- `/vahire/images/` - Profile images
- `/vahire/resumes/` - Resumes
- `/vahire/projects/` - Project files

## Admin

The Admin API provides administrative functions for system management, available only to users with admin role.

### Endpoints

#### Get All Users (Admin)

```
GET /api/admin/users
```

Retrieve all users with advanced filtering options.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 20)
role: Filter by role (professional, recruiter, user, admin)
search: Search by name or email
sortBy: Field to sort by (createdAt, firstname, etc.)
sortOrder: Sort order (asc, desc)
```

**Response (200 OK):**

```json
{
  "data": {
    "users": [
      {
        "id": "60a6c5e89a8f7e1234567890",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "role": "professional",
        "createdAt": "2023-05-20T12:00:00.000Z"
      },
      // More users...
    ],
    "totalPages": 10,
    "currentPage": 1
  }
}
```

#### Get All Projects (Admin)

```
GET /api/admin/projects
```

Retrieve all projects with advanced filtering options.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 20)
status: Filter by status (en cours, terminé, payé)
search: Search by title or description
sortBy: Field to sort by (createdAt, budget, etc.)
sortOrder: Sort order (asc, desc)
```

**Response (200 OK):**

```json
{
  "data": {
    "projects": [
      {
        "id": "60d2c5e89a8f7e1234567890",
        "title": "E-commerce Website Development",
        "description": "Development of a full-featured e-commerce platform with payment integration",
        "budget": 5000,
        "status": "en cours",
        "owner": {
          "id": "60a6c5e89a8f7e1234567891",
          "firstname": "Jane",
          "lastname": "Smith",
          "email": "jane.smith@example.com"
        },
        "createdAt": "2023-06-10T09:00:00.000Z"
      },
      // More projects...
    ],
    "totalPages": 5,
    "currentPage": 1
  }
}
```

#### Get System Reports

```
GET /api/admin/reports
```

Generate system usage and financial reports.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "users": {
      "total": 250,
      "professionals": 120,
      "recruiters": 80
    },
    "projects": {
      "total": 150,
      "active": 75,
      "completed": 65
    },
    "courses": {
      "total": 25,
      "enrollments": 350
    },
    "finances": {
      "projectRevenue": 75000,
      "courseRevenue": 15000,
      "totalRevenue": 90000
    },
    "activity": {
      "totalMessages": 1250
    },
    "systemStats": {
      "lastUpdated": "2023-08-01T10:30:00.000Z",
      "uptime": 1209600,
      "memory": {
        "rss": 85000000,
        "heapTotal": 50000000,
        "heapUsed": 40000000
      }
    }
  }
}
```

#### Ban User

```
PUT /api/admin/ban-user/:userId
```

Ban a user from the platform.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "reason": "Violation of terms of service: Inappropriate content"
}
```

**Response (200 OK):**

```json
{
  "message": "User banned successfully"
}
```

#### Unban User

```
PUT /api/admin/unban-user/:userId
```

Remove a ban from a previously banned user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "User unbanned successfully"
}
```

### Admin Capabilities

Administrators have the following capabilities:
1. View and manage all users and their profiles
2. View and manage all projects
3. Generate system-wide reports and analytics
4. Ban and unban users who violate platform rules
5. Access to system logs and error reports 

## Conversations

The Conversations API handles messaging between users, enabling them to communicate about projects or general inquiries.

### Endpoints

#### Get User Conversations

```
GET /api/conversations
```

Retrieve all conversations for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "conversations": [
      {
        "id": "60f4c5e89a8f7e1234567890",
        "participants": [
          {
            "id": "60a6c5e89a8f7e1234567890",
            "firstname": "John",
            "lastname": "Doe",
            "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
          },
          {
            "id": "60a6c5e89a8f7e1234567891",
            "firstname": "Jane",
            "lastname": "Smith",
            "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
          }
        ],
        "project": {
          "id": "60d2c5e89a8f7e1234567890",
          "title": "E-commerce Website Development"
        },
        "lastMessage": "2023-07-15T10:30:00.000Z",
        "createdAt": "2023-07-10T14:00:00.000Z"
      },
      // More conversations...
    ]
  }
}
```

#### Get Conversation Messages

```
GET /api/conversations/:conversationId
```

Retrieve all messages in a specific conversation.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "60f4c5e89a8f7e1234567890",
    "participants": [
      {
        "id": "60a6c5e89a8f7e1234567890",
        "firstname": "John",
        "lastname": "Doe",
        "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
      },
      {
        "id": "60a6c5e89a8f7e1234567891",
        "firstname": "Jane",
        "lastname": "Smith",
        "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
      }
    ],
    "project": {
      "id": "60d2c5e89a8f7e1234567890",
      "title": "E-commerce Website Development"
    },
    "messages": [
      {
        "id": "60f5d5e89a8f7e1234567890",
        "sender": {
          "id": "60a6c5e89a8f7e1234567891",
          "firstname": "Jane",
          "lastname": "Smith",
          "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
        },
        "content": "Hello, I'm interested in discussing the e-commerce project.",
        "read": true,
        "createdAt": "2023-07-10T14:00:00.000Z"
      },
      {
        "id": "60f5d5e89a8f7e1234567891",
        "sender": {
          "id": "60a6c5e89a8f7e1234567890",
          "firstname": "John",
          "lastname": "Doe",
          "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
        },
        "content": "Hi Jane, I'd be happy to discuss details. What's your timeline for this project?",
        "read": true,
        "createdAt": "2023-07-10T14:15:00.000Z"
      },
      // More messages...
    ],
    "createdAt": "2023-07-10T14:00:00.000Z"
  }
}
```

#### Send Message

```
POST /api/conversations/:conversationId/message
```

Send a new message in a conversation.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "I can start working on this project next week. Would that work for you?"
}
```

**Response (201 Created):**

```json
{
  "message": "Message sent successfully"
}
```

#### Start Conversation

```
POST /api/conversations/start
```

Start a new conversation with another user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "recipientId": "60a6c5e89a8f7e1234567891",
  "initialMessage": "Hello, I'm interested in discussing potential collaboration on projects.",
  "projectId": "60d2c5e89a8f7e1234567890" // Optional
}
```

**Response (201 Created):**

```json
{
  "message": "Conversation started successfully",
  "data": {
    "id": "60f4c5e89a8f7e1234567892",
    "participants": [
      {
        "id": "60a6c5e89a8f7e1234567890",
        "firstname": "John",
        "lastname": "Doe"
      },
      {
        "id": "60a6c5e89a8f7e1234567891",
        "firstname": "Jane",
        "lastname": "Smith"
      }
    ],
    "project": {
      "id": "60d2c5e89a8f7e1234567890",
      "title": "E-commerce Website Development"
    },
    "createdAt": "2023-07-20T09:45:00.000Z"
  }
}
```

### Real-time Messaging

The conversation system supports real-time messaging using Socket.IO. When a user is connected, they will receive real-time updates for:

- New messages in their conversations
- Read receipts when messages are read by the recipient
- Typing indicators

## Courses

The Courses API allows professionals to create educational courses and for users to enroll in and complete these courses.

### Endpoints

#### Get All Courses

```
GET /api/courses
```

Retrieve all available courses with optional filtering.

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 10)
search: Search in title or description
level: Filter by level (beginner, intermediate, advanced)
instructor: Filter by instructor ID
```

**Response (200 OK):**

```json
{
  "data": {
    "courses": [
      {
        "id": "60g2c5e89a8f7e1234567890",
        "title": "Modern Web Development with React",
        "description": "Learn how to build modern web applications using React and related technologies",
        "price": 49.99,
        "duration": "10 hours",
        "level": "intermediate",
        "instructor": {
          "id": "60a6c5e89a8f7e1234567890",
          "firstname": "John",
          "lastname": "Doe",
          "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
        },
        "rating": 4.8,
        "createdAt": "2023-06-05T12:00:00.000Z"
      },
      // More courses...
    ],
    "totalPages": 3,
    "currentPage": 1
  }
}
```

#### Get Course by ID

```
GET /api/courses/:courseId
```

Retrieve detailed information about a specific course.

**Response (200 OK):**

```json
{
  "data": {
    "id": "60g2c5e89a8f7e1234567890",
    "title": "Modern Web Development with React",
    "description": "Learn how to build modern web applications using React and related technologies",
    "price": 49.99,
    "duration": "10 hours",
    "level": "intermediate",
    "instructor": {
      "id": "60a6c5e89a8f7e1234567890",
      "firstname": "John",
      "lastname": "Doe",
      "profileImage": "https://cloudinary.com/vahire/images/johndoe.jpg"
    },
    "topics": [
      {
        "title": "Introduction to React",
        "description": "Learn the basics of React and component-based architecture",
        "videoUrl": "https://example.com/courses/react/intro.mp4",
        "duration": "45 minutes"
      },
      // More topics...
    ],
    "requirements": [
      "Basic knowledge of HTML, CSS, and JavaScript",
      "Node.js installed on your computer"
    ],
    "objectives": [
      "Build complete React applications from scratch",
      "Understand state management with Redux",
      "Implement authentication and routing"
    ],
    "enrolledStudents": 120,
    "rating": 4.8,
    "reviews": [
      {
        "student": {
          "id": "60a6c5e89a8f7e1234567891",
          "firstname": "Jane",
          "lastname": "Smith",
          "profileImage": "https://cloudinary.com/vahire/images/janesmith.jpg"
        },
        "rating": 5,
        "comment": "Excellent course! Very detailed and well-explained.",
        "createdAt": "2023-06-20T15:30:00.000Z"
      },
      // More reviews...
    ],
    "createdAt": "2023-06-05T12:00:00.000Z"
  }
}
```

#### Create Course

```
POST /api/courses
```

Create a new course. Only professionals can create courses.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Introduction to Node.js",
  "description": "Learn the fundamentals of Node.js and server-side JavaScript",
  "price": 39.99,
  "duration": "8 hours",
  "level": "beginner",
  "topics": [
    {
      "title": "Getting Started with Node.js",
      "description": "Installation and first steps",
      "videoUrl": "https://example.com/courses/nodejs/intro.mp4",
      "duration": "40 minutes"
    },
    // More topics...
  ],
  "requirements": [
    "Basic JavaScript knowledge",
    "Code editor (VSCode recommended)"
  ],
  "objectives": [
    "Understand Node.js architecture",
    "Build RESTful APIs with Express",
    "Connect to databases"
  ]
}
```

**Response (201 Created):**

```json
{
  "message": "Course created successfully",
  "data": {
    "id": "60g2c5e89a8f7e1234567891",
    "title": "Introduction to Node.js",
    "price": 39.99,
    "createdAt": "2023-08-05T11:30:00.000Z"
  }
}
```

#### Enroll in Course

```
POST /api/courses/:courseId/enroll
```

Enroll in a course.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Successfully enrolled in course"
}
```

#### Update Course Progress

```
PUT /api/courses/:courseId/progress
```

Update the user's progress in a course.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "topicIndex": 2,
  "completed": true
}
```

**Response (200 OK):**

```json
{
  "message": "Progress updated successfully"
}
```

#### Add Course Review

```
POST /api/courses/:courseId/review
```

Add a review for a completed course.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Excellent course! I learned a lot and the instructor was very clear."
}
```

**Response (200 OK):**

```json
{
  "message": "Review added successfully"
}
```

## Notifications

The Notifications API handles user notifications for various events on the platform.

### Endpoints

#### Get User Notifications

```
GET /api/notifications
```

Retrieve all notifications for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: Page number (default: 1)
limit: Number of items per page (default: 20)
```

**Response (200 OK):**

```json
{
  "data": {
    "notifications": [
      {
        "id": "60h5d5e89a8f7e1234567890",
        "type": "project_assigned",
        "title": "Project Assigned",
        "message": "You have been assigned to the project 'E-commerce Website Development'",
        "read": false,
        "data": {
          "projectId": "60d2c5e89a8f7e1234567890"
        },
        "createdAt": "2023-06-15T14:30:00.000Z"
      },
      {
        "id": "60h5d5e89a8f7e1234567891",
        "type": "message_received",
        "title": "New Message",
        "message": "Jane Smith sent you a message",
        "read": true,
        "data": {
          "conversationId": "60f4c5e89a8f7e1234567890"
        },
        "createdAt": "2023-06-12T10:15:00.000Z"
      },
      // More notifications...
    ],
    "totalPages": 2,
    "currentPage": 1
  }
}
```

#### Mark Notifications as Read

```
POST /api/notifications/mark-read
```

Mark specific notifications as read.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "notificationIds": [
    "60h5d5e89a8f7e1234567890"
  ]
}
```

**Response (200 OK):**

```json
{
  "message": "Notifications marked as read"
}
```

#### Mark All Notifications as Read

```
POST /api/notifications/mark-all-read
```

Mark all notifications as read for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "All notifications marked as read"
}
```

#### Delete Notification

```
DELETE /api/notifications/:notificationId
```

Delete a specific notification.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Notification deleted successfully"
}
```

### Notification Types

The system supports the following notification types:

1. **project_application**: When a professional applies to a project
2. **project_assigned**: When a professional is assigned to a project
3. **project_completed**: When a project is marked as complete
4. **payment_received**: When a payment is received
5. **review_received**: When a user receives a review
6. **message_received**: When a user receives a new message
7. **system**: System-wide announcements and updates

## Error Handling

### Error Response Format

All error responses follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional error details
  },
  "status": 400 // HTTP status code
}
```

### Common Error Codes

| Status Code | Error Code               | Description                                           |
|-------------|--------------------------|-------------------------------------------------------|
| 400         | VALIDATION_ERROR         | Invalid or missing required fields                    |
| 401         | UNAUTHORIZED             | Authentication required or token invalid              |
| 403         | FORBIDDEN                | Not authorized to perform the action                  |
| 404         | NOT_FOUND                | Resource not found                                    |
| 409         | CONFLICT                 | Resource already exists                               |
| 429         | TOO_MANY_REQUESTS        | Rate limit exceeded                                   |
| 500         | INTERNAL_SERVER_ERROR    | Unexpected server error                               |

### Validation Errors

For validation errors, the response includes specific details about which fields failed validation:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email address"
        },
        {
          "field": "password",
          "message": "Password must be at least 8 characters"
        }
      ]
    }
  },
  "status": 400
}
```

### Rate Limiting

The API implements rate limiting to prevent abuse. When rate limits are exceeded, a 429 error is returned:

```json
{
  "error": {
    "message": "Too many requests, please try again later",
    "code": "TOO_MANY_REQUESTS",
    "details": {
      "retryAfter": 60 // Seconds until the rate limit resets
    }
  },
  "status": 429
}
```

### Handling Errors in Clients

It is recommended that client applications handle errors gracefully by:

1. Checking the HTTP status code
2. Examining the `error.code` field for programmatic handling
3. Displaying the `error.message` to users when appropriate
4. Implementing retry logic with exponential backoff for rate limiting errors
5. Logging unexpected 500 errors for further investigation 
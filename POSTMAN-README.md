# Using Postman with VaHire API

This guide provides instructions on how to use Postman to interact with the VaHire API.

## Table of Contents
- [Introduction](#introduction)
- [Setting Up Postman](#setting-up-postman)
- [Importing the VaHire Collection](#importing-the-vahire-collection)
- [Environment Configuration](#environment-configuration)
- [Authentication](#authentication)
- [Working with Endpoints](#working-with-endpoints)
- [Tips and Best Practices](#tips-and-best-practices)
- [Troubleshooting](#troubleshooting)

## Introduction

Postman is an API platform for building and using APIs. It simplifies each step of the API lifecycle and streamlines collaboration, making it easier to create better APIs. This guide will help you set up Postman to work with the VaHire API.

## Setting Up Postman

1. Download and install Postman from [postman.com](https://www.postman.com/downloads/)
2. Create a free Postman account if you don't have one
3. Launch Postman and sign in to your account

## Importing the VaHire Collection

We've created a ready-to-use Postman collection for VaHire API. You can import it in two ways:

### Option 1: Import from File

1. Download the `POSTMAN-COLLECTION-EXAMPLE.json` file from this repository
2. In Postman, click on "Import" in the upper-left corner
3. Drag and drop the JSON file or click "Upload Files" and select it
4. Click "Import" to add the collection to your workspace

### Option 2: Import via Link (If Available)

1. In Postman, click on "Import" in the upper-left corner
2. Select the "Link" tab
3. Paste the collection link (if provided by your team)
4. Click "Import" to add the collection to your workspace

## Environment Configuration

To work with different environments (development, staging, production), you should set up environment variables:

1. Click on "Environments" in the sidebar
2. Click the "+" icon to create a new environment
3. Name it "VaHire Development"
4. Add the following variables:
   - `baseUrl`: `http://localhost:5000` (or your local development URL)
   - `authToken`: Leave it empty initially (will be filled automatically after login)
   - `userId`: Leave it empty initially
   - `projectId`: Leave it empty initially
5. Click "Save"

For staging or production, create additional environments with appropriate base URLs.

## Authentication

The VaHire API uses JWT for authentication. The collection is configured to automatically save your auth token:

1. Select the "VaHire API" collection
2. Navigate to the "Authentication" folder
3. Select the "Register User" request to create a new account or "Login" if you already have credentials
4. Fill in the required details in the request body
5. Send the request
6. Upon successful login, the auth token will be automatically stored in your environment variables

The collection includes a test script in the Login request that automatically extracts and stores the JWT token from the response.

## Working with Endpoints

The collection is organized into folders based on functionality:

- **Authentication**: User registration, login, profile management
- **Projects**: Create, view, and manage projects
- **Payments**: Process payments and check status
- **File Uploads**: Upload profile images and resumes
- **Admin**: Administrative functions (requires admin privileges)

Each request includes:
- Pre-configured headers
- Example request bodies where applicable
- Description of the endpoint's purpose
- Required parameters

### Example: Creating a Project

1. Make sure you're authenticated (run the Login request first)
2. Navigate to the "Projects" folder
3. Select "Create Project"
4. Modify the request body as needed
5. Send the request
6. The Project ID will be automatically stored in your environment variables

## Tips and Best Practices

1. **Environment Management**: Always ensure you're using the correct environment when testing
2. **Authorization**: Most endpoints require authentication. If you get 401 errors, try logging in again
3. **Response Scripts**: The collection includes scripts that automatically store IDs and tokens - check the "Tests" tab to see how they work
4. **Variable Usage**: Use environment variables (`{{variableName}}`) in your requests for consistency
5. **Request Chaining**: Some operations require previous steps (e.g., creating a project before assigning it)

## Troubleshooting

Common issues and solutions:

1. **401 Unauthorized**: Your token may have expired. Run the Login request again
2. **404 Not Found**: Check that you're using the correct base URL for your environment
3. **400 Bad Request**: Verify your request body has all required fields with correct data types
4. **Connection Error**: Ensure the API server is running and accessible
5. **Variable Not Available**: If a variable like `{{projectId}}` is showing as undefined, make sure you've run the corresponding request that sets it first

---

For detailed API documentation, please refer to [DOCUMENTATION.md](DOCUMENTATION.md) in this repository. 
# Setting Up Postman Environments for VaHire API

This guide explains how to set up different environments in Postman for working with the VaHire API across development, testing, and production stages.

## What are Postman Environments?

Environments in Postman are a set of variables that allow you to run your API requests against different servers without changing the requests themselves. This means you can easily switch between environments (like local development, staging, or production) with a simple selection.

## Creating VaHire API Environments

### Local Development Environment

1. Open Postman and click on "Environments" in the left sidebar
2. Click the "+" icon to create a new environment
3. Name it "VaHire Local"
4. Add the following variables:

| Variable Name | Initial Value | Current Value | Description |
|---------------|---------------|---------------|-------------|
| baseUrl | http://localhost:5000 | http://localhost:5000 | Your local API URL |
| authToken | | | Will be set automatically after login |
| userId | | | Will be set automatically after login |
| projectId | | | Will be set after creating a project |
| sessionId | | | For payment sessions |

5. Click "Save"

### Staging Environment (If Applicable)

1. Follow steps 1-2 above
2. Name it "VaHire Staging"
3. Add the following variables:

| Variable Name | Initial Value | Current Value | Description |
|---------------|---------------|---------------|-------------|
| baseUrl | https://staging-api.vahire.com | https://staging-api.vahire.com | Staging API URL |
| authToken | | | Will be set automatically after login |
| userId | | | Will be set automatically after login |
| projectId | | | Will be set after creating a project |
| sessionId | | | For payment sessions |

4. Click "Save"

### Production Environment

1. Follow steps 1-2 above
2. Name it "VaHire Production"
3. Add the following variables:

| Variable Name | Initial Value | Current Value | Description |
|---------------|---------------|---------------|-------------|
| baseUrl | https://api.vahire.com | https://api.vahire.com | Production API URL |
| authToken | | | Will be set automatically after login |
| userId | | | Will be set automatically after login |
| projectId | | | Will be set after creating a project |
| sessionId | | | For payment sessions |

4. Click "Save"

## Using Environments

### Switching Between Environments

1. In the top-right corner of Postman, you'll see an environment dropdown
2. Select the environment you want to use (e.g., "VaHire Local")
3. All requests in the VaHire collection will now use the selected environment's variables

### Viewing and Editing Environment Variables

1. Click on the "eye" icon in the top-right corner to view current environment variables
2. You can edit values directly in this quick-look modal
3. For more extensive edits, go to "Environments" in the sidebar and select the environment to edit

## Environment-Specific Authentication

The login process will populate your environment with authentication tokens:

1. Select the environment you want to use
2. Run the "Login" request in the Authentication folder
3. The test script will automatically populate the `authToken` and `userId` variables
4. Check the "Test Results" tab to confirm the variables were set correctly

## Additional Environment Variables

You may want to add additional variables to your environments to handle:

- Test user credentials
- API keys
- Webhook URLs
- Test data IDs

For example:

| Variable Name | Initial Value | Current Value | Description |
|---------------|---------------|---------------|-------------|
| testUserEmail | test@example.com | test@example.com | Email for test user |
| testUserPassword | password123 | password123 | Password for test user |

## Environment Variable Security

**Important security note:** Never commit sensitive information like production passwords or API keys to version control.

When sharing Postman collections with team members:

1. Export the collection without environment variables containing sensitive data
2. Share a template of the environment with placeholder values
3. Instruct team members to add their own secure values

## Using Environment Variables in Requests

You can use environment variables in:

- URLs
- Headers
- Request bodies
- Tests and scripts

Example in URL:
```
{{baseUrl}}/api/projects
```

Example in headers:
```
Authorization: Bearer {{authToken}}
```

Example in request body:
```json
{
  "userId": "{{userId}}"
}
```

## Environment Variable Scripts

The VaHire collection includes scripts that automatically manage environment variables:

- The login request automatically saves your auth token
- Creating a project saves the project ID
- Starting a payment session saves the session ID

You can examine these in the "Tests" tab of each request.

## Troubleshooting Environment Variables

If a request is failing with environment variables:

1. Check that you've selected the correct environment
2. Verify variables exist and have values (use the "eye" icon)
3. Ensure you've run dependent requests (like login before trying authenticated endpoints)
4. Look for typos in variable names
5. Check the console log for any script errors

---

For detailed Postman collection usage instructions, refer to [POSTMAN-README.md](POSTMAN-README.md) 
# Testing VaHire API with Postman

This guide shows how to effectively test the VaHire API using Postman's testing capabilities.

## Table of Contents
- [Introduction to Postman Tests](#introduction-to-postman-tests)
- [Basic Test Structure](#basic-test-structure)
- [Pre-Written Tests in VaHire Collection](#pre-written-tests-in-vahire-collection)
- [Writing Your Own Tests](#writing-your-own-tests)
- [Running Tests](#running-tests)
- [Creating Test Suites](#creating-test-suites)
- [Automating Tests](#automating-tests)

## Introduction to Postman Tests

Postman allows you to write test scripts that run after a request completes. These tests can:
- Validate response status codes
- Check response data structure and values
- Set environment variables for use in subsequent requests
- Verify response times
- And much more

## Basic Test Structure

Tests in Postman are written in JavaScript and run in a sandbox environment. A typical test follows this pattern:

```javascript
// Test example
pm.test("Test Name", function () {
    // Assertions go here
    pm.response.to.have.status(200);
});
```

## Pre-Written Tests in VaHire Collection

The VaHire API Postman collection comes with pre-written tests for key endpoints:

### Authentication Tests

The Login request includes tests to:
- Verify successful login (status 200)
- Check token existence in response
- Automatically store the token as an environment variable
- Validate user object structure

```javascript
// Login Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('token');
    pm.expect(jsonData.data.token).to.be.a('string');
});

// Store token in environment variables
var response = pm.response.json();
if (response.data && response.data.token) {
    pm.environment.set("authToken", response.data.token);
    
    if (response.data.user && response.data.user.id) {
        pm.environment.set("userId", response.data.user.id);
    }
}
```

### Project Creation Tests

The Create Project request includes tests to:
- Verify project creation success
- Store the new project ID as an environment variable
- Validate project structure

```javascript
// Project Creation Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Project created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data.title).to.eql(JSON.parse(pm.request.body.raw).title);
});

// Store project ID
var response = pm.response.json();
if (response.data && response.data.id) {
    pm.environment.set("projectId", response.data.id);
}
```

## Writing Your Own Tests

### Testing Status Codes

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

### Testing Response JSON

```javascript
pm.test("Response has expected structure", function () {
    var jsonData = pm.response.json();
    
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('object');
});
```

### Testing Response Headers

```javascript
pm.test("Content-Type header is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

### Testing Response Time

```javascript
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### Testing Error Responses

```javascript
pm.test("Failed login with wrong credentials", function () {
    pm.response.to.have.status(401);
    
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(false);
    pm.expect(jsonData).to.have.property('message');
});
```

## Running Tests

### Running Individual Request Tests

1. Select a request in the VaHire collection
2. Click the "Send" button
3. View test results in the "Test Results" tab of the response section

### Running Folder-Level Tests

1. Right-click on a folder (e.g., "Authentication")
2. Select "Run" from the context menu
3. In the Collection Runner, click "Run [Folder Name]"
4. View results in the Collection Runner window

## Creating Test Suites

You can create a comprehensive test suite for VaHire API by:

1. Organizing your tests in a logical sequence
2. Using environment variables to share data between requests
3. Setting up pre-request scripts to prepare test data

### Example Test Sequence

1. Register a test user
2. Login with the user
3. Create a project
4. Retrieve the project
5. Update the project
6. Delete the project
7. Verify deletion

## Automating Tests

### Using Collection Runner

1. Open Postman
2. Click "Runner" in the bottom left
3. Select the VaHire collection or specific folders
4. Configure run settings:
   - Environment: Select your environment (e.g., "VaHire Local")
   - Iterations: Number of test cycles to run
   - Delay: Time between requests
5. Click "Run" to execute tests

### Using Newman (CLI Tool)

Newman is Postman's command-line collection runner. To use Newman:

1. Install Newman: `npm install -g newman`
2. Export your collection and environment from Postman
3. Run tests with Newman:

```bash
newman run VaHire.postman_collection.json -e VaHire_Local.postman_environment.json
```

### CI/CD Integration

You can integrate Newman into your CI/CD pipeline:

#### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Newman
        run: npm install -g newman
      - name: Run API Tests
        run: newman run ./postman/VaHire.postman_collection.json -e ./postman/VaHire_CI.postman_environment.json
```

## Advanced Testing Techniques

### Data-Driven Testing

Use a data file to test with different inputs:

```bash
newman run VaHire.postman_collection.json -e VaHire_Local.postman_environment.json -d test-data.json
```

### Test Reports

Generate detailed test reports:

```bash
newman run VaHire.postman_collection.json -e VaHire_Local.postman_environment.json -r htmlextra
```

### Custom Assertion Libraries

You can use Chai assertion library in your tests:

```javascript
pm.test("Check user properties", function () {
    const user = pm.response.json().data.user;
    pm.expect(user.email).to.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
});
```

---

For more information on setting up and using the VaHire API collection, refer to [POSTMAN-README.md](POSTMAN-README.md). 
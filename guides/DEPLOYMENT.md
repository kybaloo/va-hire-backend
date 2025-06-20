# VaHire Backend Deployment Guide

This document provides instructions for deploying the VaHire backend to a production environment.

## Pre-Deployment Checklist

- [ ] **Environment Variables**: Copy `.env.example` to `.env.production` and update all values:
  - Set secure, production-grade secrets (JWT_SECRET, etc.)
  - Configure production database connection string
  - Set up production Auth0 credentials
  - Add Stripe production keys
  - Configure Cloudinary production credentials
  - Set `NODE_ENV=production`

- [ ] **Security Audit**:
  - [ ] Run `npm audit` and fix any critical vulnerabilities
  - [ ] Ensure all passwords and API keys are securely stored in environment variables
  - [ ] Check that no secrets are committed to the repository

- [ ] **Database**:
  - [ ] Create production database and ensure it's properly secured
  - [ ] Run any required migrations
  - [ ] Set up database backup strategy

- [ ] **API Testing**:
  - [ ] Test all endpoints with production credentials
  - [ ] Verify rate limiting is working correctly
  - [ ] Check that authentication is properly securing routes

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

1. Provision a server with Node.js installed (LTS version recommended)
2. Set up a process manager like PM2:
   ```bash
   npm install -g pm2
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/va-hire-backend.git
   cd va-hire-backend
   ```
4. Install dependencies:
   ```bash
   npm install --production
   ```
5. Copy your production environment file:
   ```bash
   cp .env.production .env
   ```
6. Start the application:
   ```bash
   pm2 start index.js --name vahire-backend
   ```
7. Set up PM2 to start on server boot:
   ```bash
   pm2 startup
   pm2 save
   ```
8. Set up Nginx as a reverse proxy (recommended)

### Option 2: Containerized Deployment (Docker)

1. Build the Docker image:
   ```bash
   docker build -t vahire-backend .
   ```
2. Run the container:
   ```bash
   docker run -d -p 5000:5000 --env-file .env.production --name vahire-backend vahire-backend
   ```

### Option 3: Platform as a Service (Render, Railway, Heroku)

1. Create a new web service on your preferred platform
2. Link your GitHub repository
3. Set environment variables in the platform's dashboard
4. Deploy the main branch

## Post-Deployment

- [ ] Set up monitoring (Uptime checks, resource usage)
- [ ] Configure logging and alerting
- [ ] Test Stripe webhooks with production URLs
- [ ] Set up automated backups
- [ ] Implement CI/CD for future updates

## Common Issues

- **CORS errors**: Make sure `FRONTEND_URL` is correctly set in environment variables
- **Auth0 issues**: Verify production domain and audience are correctly configured
- **MongoDB connection failures**: Check connection string and network security settings
- **Rate limiting too aggressive**: Adjust rate limits in `middlewares/rateLimiter.js` if needed

## Performance Tuning

For high-traffic deployments, consider:

- Setting up MongoDB Atlas with appropriate tier
- Using a caching layer (Redis)
- Implementing horizontal scaling (load balancer + multiple instances)
- Enabling GZIP compression

## Maintenance

- Schedule regular security audits
- Keep dependencies updated
- Monitor error logs regularly
- Set up automated testing for critical paths 
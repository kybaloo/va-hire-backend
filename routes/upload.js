const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadImage, uploadResume, uploadProjectFile } = require('../config/cloudinary');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Auth middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

/**
 * @swagger
 * /api/upload/profile-image:
 *   post:
 *     summary: Upload a profile image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (JPG, PNG)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary URL of the uploaded image
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 */
router.post('/profile-image', checkJwt, uploadImage.single('image'), uploadController.uploadProfileImage);

/**
 * @swagger
 * /api/upload/resume:
 *   post:
 *     summary: Upload a resume
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOC, DOCX)
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary URL of the uploaded resume
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 */
router.post('/resume', checkJwt, uploadResume.single('resume'), uploadController.uploadResume);

/**
 * @swagger
 * /api/upload/project/{projectId}:
 *   post:
 *     summary: Upload a project file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Project file (any format)
 *     responses:
 *       200:
 *         description: Project file uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary URL of the uploaded file
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.post('/project/:projectId', checkJwt, uploadProjectFile.single('file'), uploadController.uploadProjectFile);

/**
 * @swagger
 * /api/upload/delete:
 *   delete:
 *     summary: Delete a file from Cloudinary
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 description: Cloudinary public ID of the file
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Invalid public ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 */
router.delete('/delete', checkJwt, uploadController.deleteFile);

module.exports = router; 
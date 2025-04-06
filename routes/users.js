const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkJwt } = require('../middleware/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, professional, recruiter, admin]
 *         description: Filter users by role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in firstname, lastname, and email
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', checkJwt, userController.getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user's own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', checkJwt, userController.getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user's own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profile:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   experience:
 *                     type: string
 *                   portfolio:
 *                     type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', checkJwt, userController.updateUserProfile);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:userId', checkJwt, userController.getUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profile:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   experience:
 *                     type: string
 *                   portfolio:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own profile
 */
router.put('/:userId', checkJwt, [
  body('firstname').optional().isString().trim(),
  body('lastname').optional().isString().trim(),
  body('email').optional().isEmail(),
  body('profile.title').optional().isString().trim(),
  body('profile.skills').optional().isArray(),
  body('profile.experience').optional().isString(),
  body('profile.portfolio').optional().isString()
], userController.updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own account
 */
router.delete('/:userId', checkJwt, userController.deleteUser);

module.exports = router;

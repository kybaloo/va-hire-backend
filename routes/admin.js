const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { body } = require('express-validator');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ auth0Id: req.auth.sub });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
};

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with admin filtering
 *     tags: [Admin]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, suspended, deleted]
 *         description: Filter users by status
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
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/users', checkJwt, isAdmin, adminController.getUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Admin]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended, deleted]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/users/:userId/status', checkJwt, [
  body('status').isIn(['active', 'suspended', 'deleted'])
], adminController.updateUserStatus);

/**
 * @swagger
 * /api/admin/projects:
 *   get:
 *     summary: Get all projects with admin filtering
 *     tags: [Admin]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, completed, cancelled]
 *         description: Filter projects by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter projects by category
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/projects', checkJwt, isAdmin, adminController.getProjects);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Get system reports
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System reports retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/reports', checkJwt, isAdmin, adminController.getReports);

/**
 * @swagger
 * /api/admin/ban-user/{userId}:
 *   put:
 *     summary: Ban a user
 *     tags: [Admin]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for banning the user
 *     responses:
 *       200:
 *         description: User banned successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/ban-user/:userId', checkJwt, isAdmin, [
  body('reason').optional().isString().trim().notEmpty().withMessage('Reason must not be empty')
], adminController.banUser);

/**
 * @swagger
 * /api/admin/unban-user/{userId}:
 *   put:
 *     summary: Unban a user
 *     tags: [Admin]
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
 *         description: User unbanned successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/unban-user/:userId', checkJwt, isAdmin, adminController.unbanUser);

module.exports = router; 
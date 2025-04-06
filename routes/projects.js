const express = require('express');
const { createProject, getProjects } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { checkJwt } = require('../middleware/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects with pagination and filtering
 *     tags: [Projects]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
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
 */
router.get('/', checkJwt, projectController.getProjects);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', checkJwt, [
  body('title').isString().trim().notEmpty(),
  body('description').isString().trim().notEmpty(),
  body('budget').isNumeric().isFloat({ min: 0 }),
  body('category').isString().trim().notEmpty(),
  body('skills').optional().isArray(),
  body('deadline').optional().isISO8601()
], projectController.createProject);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:projectId', checkJwt, projectController.getOneProject);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   put:
 *     summary: Update project details
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own project
 */
router.put('/:projectId', checkJwt, [
  body('title').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim().notEmpty(),
  body('budget').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().isString().trim().notEmpty(),
  body('skills').optional().isArray(),
  body('deadline').optional().isISO8601(),
  body('status').optional().isIn(['open', 'in_progress', 'completed', 'cancelled'])
], projectController.updateProject);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own project
 */
router.delete('/:projectId', checkJwt, projectController.deleteProject);

module.exports = router;

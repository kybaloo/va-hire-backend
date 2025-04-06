const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const courseController = require('../controllers/courseController');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses with pagination and filtering
 *     tags: [Courses]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter courses by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', checkJwt, courseController.getCourses);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
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
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               duration:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', checkJwt, [
  body('title').isString().trim().notEmpty(),
  body('description').isString().trim().notEmpty(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('category').isString().trim().notEmpty(),
  body('duration').optional().isString(),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('prerequisites').optional().isArray()
], courseController.createCourse);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:courseId', checkJwt, courseController.getCourse);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   put:
 *     summary: Update course details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               duration:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own course
 */
router.put('/:courseId', checkJwt, [
  body('title').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim().notEmpty(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().isString().trim().notEmpty(),
  body('duration').optional().isString(),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('prerequisites').optional().isArray()
], courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own course
 */
router.delete('/:courseId', checkJwt, courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Successfully enrolled in course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Already enrolled in this course
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:courseId/enroll', checkJwt, courseController.enrollInCourse);

/**
 * @swagger
 * /api/courses/{courseId}/progress:
 *   put:
 *     summary: Update course progress
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - progress
 *             properties:
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Progress percentage (0-100)
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Not enrolled in this course or invalid progress value
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:courseId/progress', checkJwt, courseController.updateProgress);

/**
 * @swagger
 * /api/courses/{courseId}/review:
 *   post:
 *     summary: Add a review to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Not enrolled in this course or already reviewed
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:courseId/review', checkJwt, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().trim().notEmpty().withMessage('Comment must not be empty')
], courseController.addReview);

module.exports = router; 
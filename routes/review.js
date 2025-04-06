const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with pagination and filtering
 *     tags: [Reviews]
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
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter reviews by project ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter reviews by user ID
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', checkJwt, reviewController.getReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - rating
 *               - comment
 *             properties:
 *               projectId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.post('/', checkJwt, [
  body('projectId').isString().trim().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').isString().trim().notEmpty()
], reviewController.createReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:reviewId', checkJwt, reviewController.getReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own review
 */
router.put('/:reviewId', checkJwt, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().isString().trim().notEmpty()
], reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own review
 */
router.delete('/:reviewId', checkJwt, reviewController.deleteReview);

module.exports = router; 
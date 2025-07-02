const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Create a new payment checkout session
 *     tags: [Payments]
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
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project to pay for
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe session ID
 *                 url:
 *                   type: string
 *                   description: Checkout URL
 *       400:
 *         description: Invalid project ID
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post('/checkout', auth, paymentController.createCheckoutSession);

/**
 * @swagger
 * /api/payments/status/{sessionId}:
 *   get:
 *     summary: Get payment status for a session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe session ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Payment status (paid, unpaid, etc.)
 *                 session:
 *                   type: object
 *                   description: Full Stripe session object
 *       500:
 *         description: Server error
 */
router.get('/status/:sessionId', auth, paymentController.getPaymentStatus);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle Stripe webhook events
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe event object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 

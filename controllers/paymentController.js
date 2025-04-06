const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Project = require('../models/Project');

// Create a new payment session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Find the project to get payment details
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create a stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: project.title,
              description: project.description
            },
            unit_amount: project.budget * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        projectId: project._id.toString(),
        userId: req.auth.sub, // From Auth0
      }
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ message: 'Error creating payment session', error: error.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.status(200).json({ status: session.payment_status, session });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Error getting payment status', error: error.message });
  }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update the project or create a payment record
      console.log('Payment succeeded:', session);
      // Additional logic here to update project status, etc.
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}; 
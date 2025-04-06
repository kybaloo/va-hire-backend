const Review = require('../models/Review');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// Get all reviews with pagination and filtering
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, projectId, userId } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (projectId) query.project = projectId;
    if (userId) query.reviewed = userId;
    
    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('reviewer', 'firstname lastname profileImage')
      .populate('project', 'title')
      .populate('reviewed', 'firstname lastname profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Review.countDocuments(query);
    
    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Submit a review
exports.createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;
    const reviewerId = req.auth.sub;

    // Check if project exists and is completed
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'terminé') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }

    // Determine who is being reviewed
    const reviewedId = reviewerId === project.owner.toString() 
      ? project.assignedTo 
      : project.owner;

    // Create review
    const review = await Review.create({
      project: projectId,
      reviewer: reviewerId,
      reviewed: reviewedId,
      rating,
      comment
    });

    // Create notification for the reviewed user
    await Notification.create({
      recipient: reviewedId,
      type: 'review_received',
      title: 'New Review Received',
      message: `You received a new ${rating}-star review for project "${project.title}"`,
      data: { reviewId: review._id }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Get reviews for a user
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewed: userId })
      .populate('reviewer', 'firstname lastname profileImage')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get a specific review
exports.getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId)
      .populate('reviewer', 'firstname lastname profileImage')
      .populate('project', 'title')
      .populate('reviewed', 'firstname lastname profileImage');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.auth.sub;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is authorized to delete
    if (review.reviewer.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.auth.sub;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is authorized to update
    if (review.reviewer.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update fields if provided
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    
    await review.save();
    
    const updatedReview = await Review.findById(reviewId)
      .populate('reviewer', 'firstname lastname profileImage')
      .populate('project', 'title')
      .populate('reviewed', 'firstname lastname profileImage');
      
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
}; 
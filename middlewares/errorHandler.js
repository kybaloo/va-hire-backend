const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // JWT error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid token or no token provided'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 
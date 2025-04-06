const { body, param, validationResult } = require('express-validator');

// Validation result middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Project validation rules
const projectValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('skillsRequired').isArray().withMessage('Skills must be an array'),
  validate
];

// User validation rules
const userValidationRules = [
  body('firstname').trim().notEmpty().withMessage('First name is required'),
  body('lastname').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('role').isIn(['user', 'admin', 'professional', 'recruiter']).withMessage('Invalid role'),
  validate
];

// Payment validation rules
const paymentValidationRules = [
  body('projectId').isMongoId().withMessage('Invalid project ID'),
  validate
];

// File upload validation rules
const fileUploadValidationRules = [
  param('projectId').isMongoId().withMessage('Invalid project ID'),
  validate
];

module.exports = {
  projectValidationRules,
  userValidationRules,
  paymentValidationRules,
  fileUploadValidationRules
}; 
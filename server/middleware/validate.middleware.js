const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Registration validation rules ───────────────────────────────────────────
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  handleValidationErrors,
];

// ─── Login validation rules ───────────────────────────────────────────────────
const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ─── Score submission validation ──────────────────────────────────────────────
const validateScore = [
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('level').isInt({ min: 1 }).withMessage('Level must be a positive integer'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateScore };

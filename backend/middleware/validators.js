// backend/middleware/validators.js
const { body } = require('express-validator');

const donorPatientValidation = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('blood_group')
    .trim()
    .notEmpty()
    .withMessage('Blood group is required'),
  body('age')
    .isInt({ min: 1 })
    .withMessage('Age must be a positive integer'),
  body('contact')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid contact number'),
  body('address')
    .optional()
    .trim(),
];

const bloodRequestValidationAdmin = [
  body('patient_id')
    .isInt()
    .withMessage('patient_id must be an integer'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('request_date')
    .isISO8601()
    .withMessage('Invalid request_date'),
  body('status')
    .optional()
    .isIn(['Pending', 'Approved', 'Rejected'])
    .withMessage('Invalid status value'),
];

module.exports = { donorPatientValidation, bloodRequestValidationAdmin };
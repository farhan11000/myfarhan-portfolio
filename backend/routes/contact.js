const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { validateRequest } = require('../middleware/validateRequest');

// Validation rules for contact form
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Subject must be between 5 and 200 characters'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[\d\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('company')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Company name cannot exceed 100 characters')
];

// Routes
router.post('/send', contactValidation, validateRequest, contactController.sendContactEmail);
router.post('/subscribe', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], validateRequest, contactController.subscribeNewsletter);

module.exports = router;
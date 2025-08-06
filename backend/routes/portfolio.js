const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Get portfolio data
router.get('/data', portfolioController.getPortfolioData);

// Get social links
router.get('/social', portfolioController.getSocialLinks);

// Get contact information
router.get('/contact-info', portfolioController.getContactInfo);

// Get skills data
router.get('/skills', portfolioController.getSkills);

// Get projects data
router.get('/projects', portfolioController.getProjects);

// Analytics endpoint (for future use)
router.post('/analytics', portfolioController.trackVisit);

module.exports = router;

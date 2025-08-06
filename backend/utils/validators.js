const validator = require('validator');

// Custom validation functions
const isValidName = (name) => {
    return name && 
           typeof name === 'string' && 
           name.length >= 2 && 
           name.length <= 100 && 
           /^[a-zA-Z\s]+$/.test(name.trim());
};

const isValidEmail = (email) => {
    return email && validator.isEmail(email);
};

const isValidSubject = (subject) => {
    return subject && 
           typeof subject === 'string' && 
           subject.trim().length >= 5 && 
           subject.trim().length <= 200;
};

const isValidMessage = (message) => {
    return message && 
           typeof message === 'string' && 
           message.trim().length >= 10 && 
           message.trim().length <= 1000;
};

const isValidPhone = (phone) => {
    if (!phone) return true; // Optional field
    return /^[\+]?[\d\s\-\(\)]{10,15}$/.test(phone.trim());
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

const sanitizeHtml = (input) => {
    if (typeof input !== 'string') return input;
    // Remove HTML tags but keep line breaks
    return input.replace(/<[^>]*>/g, '').trim();
};

module.exports = {
    isValidName,
    isValidEmail,
    isValidSubject,
    isValidMessage,
    isValidPhone,
    sanitizeInput,
    sanitizeHtml
};
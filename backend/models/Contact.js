const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true,
        maxlength: 100
    },
    ipAddress: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['pending', 'replied', 'resolved'],
        default: 'pending'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true
    },
    ipAddress: String,
    userAgent: String,
    referer: String,
    sessionId: String,
    duration: Number, // Time spent on page in seconds
    actions: [{
        type: String,
        timestamp: Date,
        data: mongoose.Schema.Types.Mixed
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);

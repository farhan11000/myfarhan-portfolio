const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (important for Railway and other cloud platforms)
app.set('trust proxy', 1);

// Enhanced CORS configuration
const corsOptions = {
    origin: [
        'https://farhan-peerzada-portfolio.netlify.app',
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5500',
        /\.netlify\.app$/,
        /localhost:\d+$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 200
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));

app.use(compression());

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // increased limit
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    }
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // increased from 5 to 10
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Too many contact attempts. Please wait an hour before trying again.'
    }
});

app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    next();
});

// Email transporter with better error handling
let transporter;

async function createEmailTransporter() {
    try {
        transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            secure: true,
            port: 587,
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter
        await transporter.verify();
        console.log('✅ Email transporter configured successfully');
        return true;
    } catch (error) {
        console.error('❌ Email transporter configuration failed:', error.message);
        return false;
    }
}

// Initialize email transporter on startup
createEmailTransporter();

// Root route with API information
app.get('/', (req, res) => {
    res.json({
        message: 'Farhan Ali Peerzada Portfolio API',
        version: '1.0.0',
        status: 'Running successfully! 🚀',
        timestamp: new Date().toISOString(),
        endpoints: {
            contact: '/api/contact/send',
            health: '/health'
        },
        cors: {
            allowedOrigins: corsOptions.origin
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        emailConfigured: !!process.env.EMAIL_USER
    });
});

// Enhanced contact form endpoint
app.post('/api/contact/send', contactLimiter, async (req, res) => {
    console.log('📬 Contact form submission received');
    
    try {
        const { name, email, subject, message, phone = '', company = '' } = req.body;

        // Enhanced validation
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                error: 'All required fields (name, email, subject, message) must be filled out'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            console.log('❌ Validation failed: Invalid email format');
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email address'
            });
        }

        // Check if email transporter is available
        if (!transporter) {
            console.log('❌ Email transporter not available');
            return res.status(500).json({
                success: false,
                error: 'Email service is temporarily unavailable. Please try again later.'
            });
        }

        console.log(`📧 Processing contact from: ${name.trim()} (${email.trim()})`);

        // Prepare notification email (to you)
        const notificationEmailOptions = {
            from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
            subject: `🔔 New Portfolio Contact: ${subject.trim()}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">From your portfolio website</p>
                    </div>
                    
                    <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 20px;">
                            <h3 style="color: #333; margin: 0 0 10px 0;">Contact Details</h3>
                            <p style="margin: 5px 0; color: #555;"><strong>👤 Name:</strong> ${name.trim()}</p>
                            <p style="margin: 5px 0; color: #555;"><strong>📧 Email:</strong> <a href="mailto:${email.trim()}" style="color: #667eea; text-decoration: none;">${email.trim()}</a></p>
                            ${phone ? `<p style="margin: 5px 0; color: #555;"><strong>📱 Phone:</strong> ${phone.trim()}</p>` : ''}
                            ${company ? `<p style="margin: 5px 0; color: #555;"><strong>🏢 Company:</strong> ${company.trim()}</p>` : ''}
                            <p style="margin: 5px 0; color: #555;"><strong>📋 Subject:</strong> ${subject.trim()}</p>
                        </div>
                        
                        <div style="border-left: 4px solid #4CAF50; padding-left: 15px;">
                            <h3 style="color: #333; margin: 0 0 10px 0;">💬 Message</h3>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-style: italic; color: #444; line-height: 1.6;">
                                ${message.trim().replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #888; font-size: 12px; margin: 0;">
                                Received on ${new Date().toLocaleString('en-US', { 
                                    timeZone: 'Asia/Karachi',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZoneName: 'short'
                                })}
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="mailto:${email.trim()}" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500;">
                            Reply to ${name.trim()}
                        </a>
                    </div>
                </div>
            `,
            replyTo: email.trim()
        };

        // Auto-reply email (to the sender)
        const autoReplyOptions = {
            from: `"Farhan Ali Peerzada" <${process.env.EMAIL_USER}>`,
            to: email.trim(),
            subject: `✅ Thank you for contacting me, ${name.trim()}!`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 28px;">👋 Hello ${name.trim()}!</h2>
                        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Thank you for reaching out</p>
                    </div>
                    
                    <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            I've successfully received your message and really appreciate you taking the time to contact me through my portfolio website.
                        </p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                            <h3 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">📋 Your Message Summary</h3>
                            <p style="margin: 5px 0; color: #555;"><strong>Subject:</strong> ${subject.trim()}</p>
                            <p style="margin: 10px 0 0 0; color: #555;"><strong>Message:</strong></p>
                            <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 8px; font-style: italic; color: #444;">
                                "${message.trim().replace(/\n/g, '<br>')}"
                            </div>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 18px;">⏰ What Happens Next?</h3>
                            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                                <li>I'll review your message within the next few hours</li>
                                <li>You can expect a personal response within 24-48 hours</li>
                                <li>For urgent matters, feel free to connect with me on LinkedIn</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <p style="color: #555; margin: 0 0 15px 0;">Meanwhile, feel free to connect with me on:</p>
                            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                                <a href="https://linkedin.com/in/farhan-ali-peerzada" style="background: #0077b5; color: white; padding: 8px 15px; text-decoration: none; border-radius: 20px; font-size: 14px; display: inline-flex; align-items: center; gap: 5px;">
                                    🔗 LinkedIn
                                </a>
                                <a href="https://github.com/farhan11000" style="background: #333; color: white; padding: 8px 15px; text-decoration: none; border-radius: 20px; font-size: 14px; display: inline-flex; align-items: center; gap: 5px;">
                                    💻 GitHub
                                </a>
                            </div>
                        </div>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                            Thank you again for your interest in my work!
                        </p>
                        
                        <p style="color: #333; font-weight: 600; margin: 15px 0 0 0;">
                            Best regards,<br>
                            <span style="color: #667eea; font-size: 18px;">Farhan Ali Peerzada</span><br>
                            <span style="color: #888; font-size: 14px;">Data Analyst & Software Engineer</span>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #888; font-size: 12px; margin: 0;">
                            This is an automated confirmation. Please do not reply to this email directly.
                        </p>
                    </div>
                </div>
            `
        };

        // Send emails with proper error handling
        console.log('📤 Sending notification email...');
        await transporter.sendMail(notificationEmailOptions);
        console.log('✅ Notification email sent successfully');

        console.log('📤 Sending auto-reply email...');
        await transporter.sendMail(autoReplyOptions);
        console.log('✅ Auto-reply email sent successfully');

        // Log successful submission
        console.log(`✅ Contact form processed successfully for ${name.trim()} (${email.trim()})`);

        res.status(200).json({
            success: true,
            message: '🎉 Message sent successfully! I\'ll get back to you within 24-48 hours.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        
        // More specific error handling
        if (error.code === 'EAUTH') {
            console.error('❌ Email authentication failed');
            return res.status(500).json({
                success: false,
                error: 'Email service authentication failed. Please try again later.'
            });
        }
        
        if (error.code === 'ECONNECTION') {
            console.error('❌ Email service connection failed');
            return res.status(500).json({
                success: false,
                error: 'Unable to connect to email service. Please try again later.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later or contact me directly on LinkedIn.'
        });
    }
});

// Test email route (for debugging)
app.get('/api/test-email', async (req, res) => {
    try {
        if (!transporter) {
            await createEmailTransporter();
        }
        
        if (!transporter) {
            throw new Error('Email transporter not configured');
        }

        await transporter.verify();
        res.json({
            success: true,
            message: 'Email service is working correctly',
            configured: !!process.env.EMAIL_USER
        });
    } catch (error) {
        console.error('Email test failed:', error);
        res.status(500).json({
            success: false,
            error: 'Email service test failed',
            details: error.message
        });
    }
});

// Portfolio data endpoint (optional)
app.get('/api/portfolio/data', (req, res) => {
    res.json({
        success: true,
        data: {
            personal: {
                name: 'Farhan Ali Peerzada',
                email: 'farhan.peerzadaa@gmail.com',
                title: 'Data Analyst & Software Engineer',
                location: 'Defence view phase 2 Karachi, Pakistan'
            },
            social: {
                github: 'https://github.com/farhan11000',
                linkedin: 'https://linkedin.com/in/farhan-ali-peerzada',
                twitter: 'https://twitter.com/farhanalipeer',
                email: 'mailto:farhan.peerzadaa@gmail.com'
            },
            stats: {
                projects: 15,
                experience: 4,
                technologies: 8
            }
        }
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /api/contact/send',
            'GET /api/portfolio/data',
            'GET /api/test-email'
        ]
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled error:', err);
    
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON in request body'
        });
    }
    
    res.status(500).json({
        success: false,
        error: 'Internal server error occurred',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    
    const server = app.listen(PORT);
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.log('⚠️ Forcing shutdown...');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception thrown:', error);
    process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
    console.log('🚀 =================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact/send`);
    console.log(`🔧 Test email: http://localhost:${PORT}/api/test-email`);
    console.log('🚀 =================================');
    
    // Test email configuration on startup
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const emailWorking = await createEmailTransporter();
        if (emailWorking) {
            console.log('✅ Email service ready');
        } else {
            console.log('⚠️ Email service configuration needs attention');
        }
    } else {
        console.log('⚠️ Email credentials not found in environment variables');
        console.log('📝 Required: EMAIL_USER, EMAIL_PASS, CONTACT_EMAIL (optional)');
    }
});

// Handle server startup errors
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`❌ Port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`❌ Port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

module.exports = app;
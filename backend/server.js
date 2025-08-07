// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const compression = require('compression');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
//             scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
//             imgSrc: ["'self'", "data:", "https:", "http:"],
//             connectSrc: ["'self'"],
//         },
//     },
// }));

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: {
//         success: false,
//         error: 'Too many requests from this IP, please try again later.'
//     }
// });

// const contactLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 5, // limit each IP to 5 contact requests per hour
//     message: {
//         success: false,
//         error: 'Too many contact requests from this IP, please try again later.'
//     }
// });

// app.use(limiter);

// // CORS configuration - FIXED: Added your Netlify URL
// const corsOptions = {
//   origin: [
//     'https://farhan-peerzada-portfolio.netlify.app',
//     'http://localhost:3000',
//     'http://localhost:5000',
//     'http://127.0.0.1:5500'
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options('*', cors(corsOptions));

// // Compression middleware
// app.use(compression());

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Serve static files (if directories exist)
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // Health check route
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime(),
//         environment: process.env.NODE_ENV || 'development'
//     });
// });

// // Contact form email configuration
// const createTransporter = () => {
//     return nodemailer.createTransporter({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });
// };

// // Contact route - FIXED: Proper error responses
// app.post('/api/contact/send', contactLimiter, async (req, res) => {
//     try {
//         const { name, email, subject, message, phone, company } = req.body;

//         console.log('Contact form submission received:', { name, email, subject });

//         // Basic validation
//         if (!name || !email || !subject || !message) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'All required fields (name, email, subject, message) must be filled'
//             });
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Invalid email format'
//             });
//         }

//         const transporter = createTransporter();

//         // Email to you (notification)
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
//             subject: `Portfolio Contact: ${subject}`,
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
//                         New Contact Form Submission
//                     </h2>
//                     <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
//                         <p><strong>Name:</strong> ${name}</p>
//                         <p><strong>Email:</strong> ${email}</p>
//                         <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
//                         <p><strong>Company:</strong> ${company || 'Not provided'}</p>
//                         <p><strong>Subject:</strong> ${subject}</p>
//                         <p><strong>Message:</strong></p>
//                         <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px;">
//                             ${message.replace(/\n/g, '<br>')}
//                         </div>
//                     </div>
//                     <p style="color: #666; font-size: 12px;">
//                         This email was sent from your portfolio contact form.
//                     </p>
//                 </div>
//             `
//         };

//         // Auto-reply to user
//         const autoReply = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Thank you for contacting me - Farhan Ali Peerzada',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">Hello ${name}!</h2>
//                     <p>Thank you for reaching out through my portfolio website. I have received your message:</p>
//                     <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                         <p><strong>Subject:</strong> ${subject}</p>
//                         <p><strong>Your Message:</strong></p>
//                         <div style="background-color: white; padding: 10px; border-left: 3px solid #007bff;">
//                             ${message.replace(/\n/g, '<br>')}
//                         </div>
//                     </div>
//                     <p>I'll get back to you as soon as possible, usually within 24-48 hours.</p>
//                     <p>Best regards,<br><strong>Farhan Ali Peerzada</strong></p>
//                     <hr>
//                     <p style="font-size: 12px; color: #666;">
//                         This is an automated response. Please do not reply to this email.
//                     </p>
//                 </div>
//             `
//         };

//         // Send both emails
//         await transporter.sendMail(mailOptions);
//         await transporter.sendMail(autoReply);

//         console.log(`Contact form submitted by: ${name} (${email})`);

//         res.status(200).json({
//             success: true,
//             message: 'Message sent successfully! I\'ll get back to you soon.'
//         });

//     } catch (error) {
//         console.error('Contact form error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to send message. Please try again later.'
//         });
//     }
// });

// // Newsletter subscription route (optional)
// app.post('/api/contact/subscribe', contactLimiter, async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Email is required'
//             });
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Invalid email format'
//             });
//         }

//         const transporter = createTransporter();

//         // Notification email
//         const subscriptionNotification = {
//             from: process.env.EMAIL_USER,
//             to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
//             subject: 'New Newsletter Subscription',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">New Newsletter Subscription</h2>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//                 </div>
//             `
//         };

//         // Welcome email to subscriber
//         const welcomeEmail = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Welcome to my Newsletter - Farhan Ali Peerzada',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">Welcome to my Newsletter!</h2>
//                     <p>Thank you for subscribing to my newsletter. You'll receive updates about:</p>
//                     <ul>
//                         <li>New projects and developments</li>
//                         <li>Technical articles and insights</li>
//                         <li>Industry news and trends</li>
//                         <li>Career updates and opportunities</li>
//                     </ul>
//                     <p>Stay tuned for exciting content!</p>
//                     <p>Best regards,<br><strong>Farhan Ali Peerzada</strong></p>
//                 </div>
//             `
//         };

//         await transporter.sendMail(subscriptionNotification);
//         await transporter.sendMail(welcomeEmail);

//         console.log(`Newsletter subscription: ${email}`);

//         res.status(200).json({
//             success: true,
//             message: 'Successfully subscribed to newsletter!'
//         });

//     } catch (error) {
//         console.error('Newsletter subscription error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to subscribe. Please try again later.'
//         });
//     }
// });

// // Portfolio data route (optional - for dynamic content)
// app.get('/api/portfolio/data', (req, res) => {
//     try {
//         const portfolioData = {
//             success: true,
//             data: {
//                 personal: {
//                     name: 'Farhan Ali Peerzada',
//                     email: 'farhan.peerzadaa@gmail.com',
//                     title: 'Data Analyst & Software Engineer'
//                 },
//                 social: {
//                     github: 'https://github.com/yourprofile',
//                     linkedin: 'https://linkedin.com/in/yourprofile',
//                     twitter: 'https://twitter.com/yourprofile',
//                     email: 'mailto:farhan.peerzadaa@gmail.com'
//                 },
//                 stats: {
//                     projects: 15,
//                     experience: 4,
//                     technologies: 8,
//                     clients: 10
//                 }
//             }
//         };

//         res.status(200).json(portfolioData);
//     } catch (error) {
//         console.error('Portfolio data error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to load portfolio data'
//         });
//     }
// });

// // Analytics route (optional - for tracking)
// app.post('/api/portfolio/analytics', (req, res) => {
//     try {
//         const { event, data, timestamp, page } = req.body;
        
//         // Log analytics data (you can store this in a database later)
//         console.log('Analytics Event:', {
//             event,
//             data,
//             timestamp,
//             page,
//             ip: req.ip,
//             userAgent: req.get('User-Agent')
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Analytics data recorded'
//         });
//     } catch (error) {
//         console.error('Analytics error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to record analytics'
//         });
//     }
// });

// // Root route
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Farhan Ali Peerzada Portfolio API',
//         version: '1.0.0',
//         endpoints: {
//             contact: '/api/contact/send',
//             subscribe: '/api/contact/subscribe',
//             portfolio: '/api/portfolio/data',
//             analytics: '/api/portfolio/analytics',
//             health: '/health'
//         },
//         status: 'Running successfully! 🚀',
//         cors: {
//             allowedOrigins: corsOptions.origin
//         }
//     });
// });

// // 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         error: `Route ${req.originalUrl} not found`,
//         availableRoutes: [
//             '/api/contact/send',
//             '/api/contact/subscribe',
//             '/api/portfolio/data',
//             '/api/portfolio/analytics',
//             '/health'
//         ]
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//         ...(process.env.NODE_ENV === 'development' && { details: err.message })
//     });
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received - shutting down gracefully');
//     process.exit(0);
// });

// process.on('SIGINT', () => {
//     console.log('SIGINT received - shutting down gracefully');
//     process.exit(0);
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🔗 Health check: https://myfarhan-portfolio-production.up.railway.app/health`);
//     console.log(`📧 Contact endpoint: https://myfarhan-portfolio-production.up.railway.app/api/contact/send`);
//     console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
// });

// module.exports = app;





const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    }
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many contact requests from this IP, please try again later.'
    }
});

app.use(limiter);

// CORS configuration - Updated with proper origins
const allowedOrigins = [
    'https://farhan-peerzada-portfolio.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Enhanced contact route with better error handling
app.post('/api/contact/send', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message, phone, company } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'All required fields must be filled'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Prepare emails
        const notificationEmail = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact: ${subject}`,
            html: `<div>
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>`
        };

        const confirmationEmail = {
            from: `"Farhan Ali Peerzada" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting me',
            html: `<div>
                <h2>Hello ${name},</h2>
                <p>Thank you for reaching out! I've received your message and will get back to you soon.</p>
                <p><strong>Your Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <p>Best regards,<br>Farhan Ali Peerzada</p>
            </div>`
        };

        // Send emails
        await transporter.sendMail(notificationEmail);
        await transporter.sendMail(confirmationEmail);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Contact endpoint: /api/contact/send`);
    console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});
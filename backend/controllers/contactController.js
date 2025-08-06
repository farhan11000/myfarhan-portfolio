const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Email templates
const getContactEmailTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
        <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .label { font-weight: bold; color: #667eea; margin-top: 15px; }
            .value { margin-bottom: 15px; padding: 10px; background: #f8f9ff; border-left: 3px solid #667eea; }
            .logo { font-size: 24px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Portfolio Contact Form</div>
                <p>New message from your website</p>
            </div>
            <div class="content">
                <div class="label">From:</div>
                <div class="value">${data.name} &lt;${data.email}&gt;</div>
                
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
                
                ${data.phone ? `<div class="label">Phone:</div><div class="value">${data.phone}</div>` : ''}
                
                ${data.company ? `<div class="label">Company:</div><div class="value">${data.company}</div>` : ''}
                
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
                
                <div class="label">Received:</div>
                <div class="value">${new Date().toLocaleString()}</div>
            </div>
            <div class="footer">
                <p>This message was sent through your portfolio contact form.</p>
                <p>Reply to this email to respond directly to the sender.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const getAutoReplyTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for your message</title>
        <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .social-links { margin-top: 20px; }
            .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Farhan Ali Peerzada</div>
                <p>Data Analyst & Software Engineer</p>
            </div>
            <div class="content">
                <h2>Thank you for reaching out, ${name}! 👋</h2>
                
                <p>I've received your message and I'm excited to connect with you. I typically respond within 24-48 hours, so you'll hear from me soon.</p>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Check out my projects on <a href="https://github.com/${process.env.GITHUB_USERNAME}" style="color: #667eea;">GitHub</a></li>
                    <li>Connect with me on <a href="https://linkedin.com/in/${process.env.LINKEDIN_USERNAME}" style="color: #667eea;">LinkedIn</a></li>
                    <li>Follow me on <a href="https://twitter.com/${process.env.TWITTER_USERNAME}" style="color: #667eea;">Twitter</a></li>
                </ul>
                
                <p>Looking forward to our conversation!</p>
                
                <p>Best regards,<br>
                <strong>Farhan Ali Peerzada</strong><br>
                Data Analyst & Software Engineer</p>
            </div>
            <div class="footer">
                <p>This is an automated response. Please don't reply to this email.</p>
                <div class="social-links">
                    <a href="https://github.com/${process.env.GITHUB_USERNAME}">GitHub</a>
                    <a href="https://linkedin.com/in/${process.env.LINKEDIN_USERNAME}">LinkedIn</a>
                    <a href="https://twitter.com/${process.env.TWITTER_USERNAME}">Twitter</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Log contact attempts
const logContact = async (data, status, error = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        status,
        name: data.name,
        email: data.email,
        subject: data.subject,
        ip: data.ip,
        userAgent: data.userAgent,
        error: error ? error.message : null
    };
    
    try {
        const logPath = path.join(__dirname, '../logs/contacts.log');
        await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n');
    } catch (logError) {
        console.error('Failed to log contact attempt:', logError);
    }
};

// Send contact email
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message, phone, company } = req.body;
        
        const contactData = {
            name,
            email,
            subject,
            message,
            phone,
            company,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };

        const transporter = createTransporter();

        // Send email to you (notification)
        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: getContactEmailTemplate(contactData),
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High'
            }
        };

        await transporter.sendMail(mailOptions);

        // Send auto-reply to sender
        const autoReplyOptions = {
            from: `"Farhan Ali Peerzada" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Thank you for your message - Farhan Ali Peerzada',
            html: getAutoReplyTemplate(name)
        };

        await transporter.sendMail(autoReplyOptions);

        // Log successful contact
        await logContact(contactData, 'success');

        res.status(200).json({
            success: true,
            message: 'Message sent successfully! I\'ll get back to you soon.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Contact form error:', error);
        
        // Log failed contact
        await logContact(req.body, 'error', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Newsletter subscription
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Log subscription (you can implement actual newsletter service later)
        const subscriptionData = {
            email,
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };
        
        const logPath = path.join(__dirname, '../logs/newsletter.log');
        await fs.appendFile(logPath, JSON.stringify(subscriptionData) + '\n');
        
        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        });
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        });
    }
};

module.exports = {
    sendContactEmail,
    subscribeNewsletter
};
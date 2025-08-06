# Farhan Ali Peerzada - Portfolio Backend API

This is the backend API for Farhan Ali Peerzada's portfolio website, built with Node.js, Express, and various middleware for security, validation, and email functionality.

## Features

- ✅ Contact form handling with email notifications
- ✅ Portfolio data API endpoints
- ✅ Rate limiting and security middleware
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Email templates for contact forms
- ✅ Analytics tracking
- ✅ CORS configuration
- ✅ Environment-based configuration

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the email credentials and other settings

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Contact Routes
- `POST /api/contact/send` - Send contact email
- `POST /api/contact/subscribe` - Newsletter subscription

### Portfolio Routes
- `GET /api/portfolio/data` - Get complete portfolio data
- `GET /api/portfolio/social` - Get social media links
- `GET /api/portfolio/contact-info` - Get contact information
- `GET /api/portfolio/skills` - Get skills data
- `GET /api/portfolio/projects` - Get projects data
- `POST /api/portfolio/analytics` - Track page visits

### Health Check
- `GET /health` - Server health status

## Email Configuration

The backend uses Gmail SMTP for sending emails. Make sure to:

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for the application
3. Use the app password in the `EMAIL_PASS` environment variable

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- Contact form rate limiting (5 requests per hour)
- Input validation and sanitization
- CORS protection
- Error logging

## Environment Variables

```env
NODE_ENV=development
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=your_email@gmail.com
GITHUB_USERNAME=your_github_username
LINKEDIN_USERNAME=your_linkedin_username
TWITTER_USERNAME=your_twitter_username
```

## Logging

The application logs various activities:
- `logs/access.log` - HTTP access logs
- `logs/errors.log` - Error logs
- `logs/contacts.log` - Contact form submissions
- `logs/analytics.log` - Page visit analytics

## Contact Form Validation

The contact form includes comprehensive validation:
- Name: 2-100 characters, letters and spaces only
- Email: Valid email format
- Subject: 5-200 characters
- Message: 10-1000 characters
- Phone: Optional, valid phone number format
- Company: Optional, max 100 characters

## Development

```bash
# Start development server with auto-reload
npm run dev

# View access logs
npm run logs

# View error logs
npm run errors

# View contact logs
npm run contacts
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `CORS_ORIGINS` with your production domain
3. Use a process manager like PM2
4. Set up proper SSL/TLS certificates
5. Configure reverse proxy (nginx/Apache)

## File Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Custom middleware
├── models/          # Data models (for future database integration)
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File uploads (if needed)
├── public/          # Static files
├── logs/            # Application logs
├── temp/            # Temporary files
├── server.js        # Main application file
├── .env             # Environment variables
└── package.json     # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Contact

Farhan Ali Peerzada
- Email: farhan.peerzadaa@gmail.com
- LinkedIn: https://linkedin.com/in/farhan-ali-peerzada
- GitHub: https://github.com/farhan11000

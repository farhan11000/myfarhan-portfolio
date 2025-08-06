// Additional email templates for future use

const getWelcomeEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Farhan's Portfolio</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: white; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome, ${name}!</h1>
                <p>Thank you for your interest in my work</p>
            </div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for visiting my portfolio and reaching out. I'm excited to connect with you!</p>
                <p>Feel free to explore my projects and don't hesitate to contact me for any opportunities or collaborations.</p>
                <p>Best regards,<br>Farhan Ali Peerzada</p>
            </div>
            <div class="footer">
                <p>Data Analyst & Software Engineer</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const getProjectInquiryTemplate = (projectName, inquirerName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Project Inquiry - ${projectName}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: white; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Project Inquiry</h1>
                <p>Someone is interested in your project: ${projectName}</p>
            </div>
            <div class="content">
                <p><strong>Project:</strong> ${projectName}</p>
                <p><strong>Inquirer:</strong> ${inquirerName}</p>
                <p>Someone has shown interest in your project. Check your main inbox for details.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    getWelcomeEmailTemplate,
    getProjectInquiryTemplate
};
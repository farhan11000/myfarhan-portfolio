const fs = require('fs').promises;
const path = require('path');

// Portfolio data
const portfolioData = {
    personal: {
        name: "Farhan Ali Peerzada",
        title: "Data Analyst & Software Engineer",
        email: "farhan.peerzadaa@gmail.com",
        location: "Karachi, Pakistan",
        university: "Iqra University",
        degree: "Bachelor of Engineering in Software Engineering (BESE)",
        bio: "A final year BESE student at Iqra University passionate about transforming data into actionable insights and building robust software solutions.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    
    social: {
        github: `https://github.com/${process.env.GITHUB_USERNAME}`,
        linkedin: `https://linkedin.com/in/${process.env.LINKEDIN_USERNAME}`,
        twitter: `https://twitter.com/${process.env.TWITTER_USERNAME}`,
        email: `mailto:${process.env.EMAIL_FROM}`
    },
    
    skills: {
        "Data Analysis & Machine Learning": [
            { name: "Python", level: 90, icon: "fab fa-python" },
            { name: "Pandas", level: 85, icon: "fas fa-table" },
            { name: "NumPy", level: 80, icon: "fas fa-calculator" },
            { name: "Matplotlib", level: 75, icon: "fas fa-chart-line" },
            { name: "Scikit-learn", level: 70, icon: "fas fa-brain" },
            { name: "SQL", level: 85, icon: "fas fa-database" },
            { name: "Excel", level: 90, icon: "fas fa-file-excel" },
            { name: "Power BI", level: 75, icon: "fas fa-chart-bar" }
        ],
        "Cloud Computing": [
            { name: "AWS", level: 75, icon: "fab fa-aws" },
            { name: "Google Cloud", level: 65, icon: "fab fa-google" },
            { name: "EC2", level: 70, icon: "fas fa-server" },
            { name: "RDS", level: 70, icon: "fas fa-database" }
        ],
        "Web & Mobile Development": [
            { name: "React.js", level: 85, icon: "fab fa-react" },
            { name: "React Native", level: 80, icon: "fab fa-react" },
            { name: "JavaScript", level: 90, icon: "fab fa-js-square" },
            { name: "HTML5", level: 95, icon: "fab fa-html5" },
            { name: "CSS3", level: 90, icon: "fab fa-css3-alt" },
            { name: "PHP", level: 70, icon: "fab fa-php" }
        ],
        "Other Tools & Concepts": [
            { name: "Git & GitHub", level: 85, icon: "fab fa-git-alt" },
            { name: "RESTful APIs", level: 80, icon: "fas fa-exchange-alt" },
            { name: "Agile", level: 75, icon: "fas fa-sync-alt" },
            { name: "Problem Solving", level: 90, icon: "fas fa-lightbulb" }
        ]
    },
    
    projects: [
        {
            id: 1,
            title: "Full-Stack E-commerce Dashboard",
            description: "Developed a full-stack dashboard that visualizes e-commerce analytics using React.js for a modern frontend, Node.js/Express for the backend, and AWS RDS for data storage. Integrated real-time sales, customer, and product performance insights.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
            technologies: ["React.js", "Node.js", "AWS RDS", "Express"],
            featured: true,
            github: "#",
            demo: "#",
            category: "Full Stack"
        },
        {
            id: 2,
            title: "Sentiment Analysis on Social Media Data",
            description: "Collected social media data using web scraping and performed sentiment analysis with Python (TextBlob, scikit-learn). Built an interactive React.js dashboard to visualize data trends and results, making complex textual data accessible and actionable.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
            technologies: ["Python", "TextBlob", "Scikit-learn", "React.js"],
            featured: false,
            github: "#",
            demo: "#",
            category: "Data Analysis"
        },
        {
            id: 3,
            title: "Personalized Event Manager Mobile App",
            description: "Designed and built a React Native mobile app for event management, featuring user authentication, event scheduling, and push notifications. Leveraged AWS PostgreSQL for secure data storage and integrated best practices for UI/UX and real-time user interactions.",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
            technologies: ["React Native", "AWS PostgreSQL", "Authentication", "Push Notifications"],
            featured: false,
            github: "#",
            demo: "#",
            category: "Mobile"
        }
    ],
    
    stats: {
        projects: 15,
        experience: 4,
        technologies: 8,
        clients: 5
    }
};

// Analytics tracking
const trackVisit = async (req, res) => {
    try {
        const visitData = {
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer'),
            page: req.body.page || 'unknown'
        };
        
        const logPath = path.join(__dirname, '../logs/analytics.log');
        await fs.appendFile(logPath, JSON.stringify(visitData) + '\n');
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        res.status(200).json({ success: false }); // Don't fail the request for analytics
    }
};

// Get complete portfolio data
const getPortfolioData = (req, res) => {
    res.json({
        success: true,
        data: portfolioData
    });
};

// Get social links
const getSocialLinks = (req, res) => {
    res.json({
        success: true,
        data: portfolioData.social
    });
};

// Get contact information
const getContactInfo = (req, res) => {
    res.json({
        success: true,
        data: {
            email: portfolioData.personal.email,
            location: portfolioData.personal.location,
            linkedin: portfolioData.social.linkedin,
            github: portfolioData.social.github
        }
    });
};

// Get skills data
const getSkills = (req, res) => {
    res.json({
        success: true,
        data: portfolioData.skills
    });
};

// Get projects data
const getProjects = (req, res) => {
    const { category, featured } = req.query;
    let projects = portfolioData.projects;
    
    if (category) {
        projects = projects.filter(project => 
            project.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (featured === 'true') {
        projects = projects.filter(project => project.featured);
    }
    
    res.json({
        success: true,
        data: projects
    });
};

module.exports = {
    getPortfolioData,
    getSocialLinks,
    getContactInfo,
    getSkills,
    getProjects,
    trackVisit
};
// Global variables
let isLoading = true;

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            initializeAnimations();
            loadPortfolioData();
            trackPageVisit();
        }, 500);
    }, 2000);
});

// API Functions
async function makeAPIRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Load portfolio data from backend
async function loadPortfolioData() {
    try {
        const response = await makeAPIRequest('/portfolio/data');
        if (response.success) {
            updateUIWithData(response.data);
        }
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
        // Continue with static data if API fails
    }
}

// Update UI with backend data
function updateUIWithData(data) {
    // Update social links
    if (data.social) {
        updateSocialLinks(data.social);
    }
    
    // Update contact info
    if (data.personal) {
        updateContactInfo(data.personal);
    }
    
    // Update stats
    if (data.stats) {
        updateStats(data.stats);
    }
}

// Update social links
function updateSocialLinks(social) {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('github') && social.github) {
            link.setAttribute('href', social.github);
        } else if (href.includes('linkedin') && social.linkedin) {
            link.setAttribute('href', social.linkedin);
        } else if (href.includes('twitter') && social.twitter) {
            link.setAttribute('href', social.twitter);
        } else if (href.includes('mailto') && social.email) {
            link.setAttribute('href', social.email);
        }
    });
}

// Update contact information
function updateContactInfo(personal) {
    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    emailElements.forEach(el => {
        if (personal.email) {
            el.setAttribute('href', `mailto:${personal.email}`);
            if (el.textContent.includes('@')) {
                el.textContent = personal.email;
            }
        }
    });
}

// Update statistics
function updateStats(stats) {
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(el => {
        const target = el.getAttribute('data-target');
        if (stats.projects && target === '15') {
            el.setAttribute('data-target', stats.projects);
        } else if (stats.experience && target === '4') {
            el.setAttribute('data-target', stats.experience);
        } else if (stats.technologies && target === '8') {
            el.setAttribute('data-target', stats.technologies);
        }
    });
}

// Track page visits
async function trackPageVisit() {
    try {
        await makeAPIRequest('/portfolio/analytics', {
            method: 'POST',
            body: JSON.stringify({
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                referrer: document.referrer
            })
        });
    } catch (error) {
        // Silently fail analytics tracking
        console.debug('Analytics tracking failed:', error);
    }
}

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Data Analyst',
    'Software Engineer', 
    'React Developer',
    'Python Specialist',
    'Problem Solver',
    'Cloud Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeAnimation() {
    if (isLoading) return;
    
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeAnimation, typeSpeed);
}

// Initialize animations after loading
function initializeAnimations() {
    setTimeout(typeAnimation, 1000);
    observeElements();
    animateOnLoad();
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNav();
    
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            if (entry.target.querySelector('.stats-grid')) {
                setTimeout(animateCounters, 500);
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animations
function observeElements() {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.skill-category, .project-card, .reason-item');
    
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    cards.forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

// Enhanced Contact form handling with backend integration
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        phone: formData.get('phone') || '',
        company: formData.get('company') || ''
    };
    
    // Client-side validation
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(contactData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send to backend
        const response = await makeAPIRequest('/contact/send', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
        
        if (response.success) {
            showNotification(response.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            
            // Track successful contact
            trackEvent('contact_form_submitted', {
                name: contactData.name,
                subject: contactData.subject
            });
        } else {
            throw new Error(response.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        // Show user-friendly error message
        if (error.message.includes('rate limit') || error.message.includes('Too many')) {
            showNotification('Too many requests. Please wait a moment before trying again.', 'error');
        } else if (error.message.includes('validation') || error.message.includes('Validation')) {
            showNotification('Please check your input and try again.', 'error');
        } else {
            showNotification('Failed to send message. Please try again later or contact me directly.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Track events
async function trackEvent(eventName, data = {}) {
    try {
        await makeAPIRequest('/portfolio/analytics', {
            method: 'POST',
            body: JSON.stringify({
                event: eventName,
                data,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            })
        });
    } catch (error) {
        console.debug('Event tracking failed:', error);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        ${type === 'success' ? 'background: linear-gradient(135deg, #4CAF50, #45a049);' : 'background: linear-gradient(135deg, #f44336, #d32f2f);'}
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    const autoRemoveTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close button
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemoveTimeout);
        removeNotification(notification);
    });
    
    function removeNotification(notif) {
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 300);
    }
}

// Newsletter subscription
async function subscribeNewsletter(email) {
    try {
        const response = await makeAPIRequest('/contact/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (response.success) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            trackEvent('newsletter_subscribed', { email });
        } else {
            throw new Error(response.message || 'Subscription failed');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Failed to subscribe. Please try again later.', 'error');
    }
}

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    trackEvent('back_to_top_clicked');
});

// Parallax effect for floating elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.05;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// 3D card tilt effect
function addCardTiltEffect() {
    const cards = document.querySelectorAll('.skill-category, .project-card, .stat-item, .reason-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
}

function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

// Animate elements on page load
function animateOnLoad() {
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-social');
    
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, (index + 1) * 200);
    });
}

// Skill items hover effect
function addSkillHoverEffect() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Project link tracking
function trackProjectLinks() {
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const linkType = this.title.toLowerCase();
            
            trackEvent('project_link_clicked', {
                project: projectTitle,
                linkType: linkType
            });
        });
    });
}

// Theme toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        }
        
        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
    }
});

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let currentSection = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    return currentSection;
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Connection status monitoring
function monitorConnection() {
    function updateConnectionStatus() {
        if (navigator.onLine) {
            showNotification('Connection restored', 'success');
        } else {
            showNotification('Connection lost. Some features may not work.', 'error');
        }
    }
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    addCardTiltEffect();
    addSkillHoverEffect();
    trackProjectLinks();
    monitorConnection();
    
    const animatedElements = document.querySelectorAll('.nav-logo, .section-header, .contact-info, .footer-info');
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    document.body.classList.add('loading');
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }, 250);
});

// Smooth page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

// Error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/400x400/667eea/ffffff?text=Image+Not+Found';
    }
}, true);

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                trackEvent('page_performance', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 1000);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason.toString()
    });
});
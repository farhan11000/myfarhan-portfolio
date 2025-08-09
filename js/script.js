// Global variables
let isLoading = true;
let typingInterval;

// API Configuration
const API_BASE_URL = 'https://myfarhan-portfolio-production.up.railway.app';

// Loading screen management
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                isLoading = false;
                initializeAnimations();
            }, 500);
        }
    }, 2000);
});

// Enhanced API request function with better error handling
async function makeAPIRequest(endpoint, options = {}) {
    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            mode: 'cors',
            credentials: 'include',
            ...options
        });
        
        console.log(`API Response status: ${response.status}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        return data;
        
    } catch (error) {
        console.error('API request failed:', error);
        
        // Network error handling
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network connection failed. Please check your internet connection.');
        }
        
        // CORS error handling
        if (error.message.includes('CORS')) {
            throw new Error('Connection blocked by security policy. Please try again later.');
        }
        
        throw error;
    }
}

// Enhanced contact form handler with comprehensive error handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Contact form submitted');
            
            // Get form elements
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Extract and validate form data
            const contactData = {
                name: formData.get('name')?.trim() || '',
                email: formData.get('email')?.trim() || '',
                subject: formData.get('subject')?.trim() || '',
                message: formData.get('message')?.trim() || '',
                phone: formData.get('phone')?.trim() || '',
                company: formData.get('company')?.trim() || ''
            };
            
            console.log('📋 Form data:', { ...contactData, message: '[HIDDEN]' });
            
            // Client-side validation
            if (!contactData.name) {
                showNotification('Please enter your name', 'error');
                return;
            }
            
            if (!contactData.email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(contactData.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!contactData.subject) {
                showNotification('Please enter a subject', 'error');
                return;
            }
            
            if (!contactData.message) {
                showNotification('Please enter your message', 'error');
                return;
            }
            
            if (contactData.message.length < 10) {
                showNotification('Please enter a more detailed message (at least 10 characters)', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                console.log('🚀 Sending request to API...');
                
                const response = await makeAPIRequest('/api/contact/send', {
                    method: 'POST',
                    body: JSON.stringify(contactData)
                });
                
                console.log('✅ API request successful:', response);
                
                if (response.success) {
                    showNotification(response.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                    
                    // Remove any existing error states
                    const inputs = this.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.style.borderColor = '';
                        input.classList.remove('error');
                    });
                    
                } else {
                    throw new Error(response.error || 'Failed to send message');
                }
                
            } catch (error) {
                console.error('❌ Contact form submission failed:', error);
                
                // Handle specific error types
                let errorMessage = 'Failed to send message. Please try again later.';
                
                if (error.message.includes('rate limit') || error.message.includes('Too many')) {
                    errorMessage = 'Too many requests. Please wait a moment before trying again.';
                } else if (error.message.includes('validation') || error.message.includes('required fields')) {
                    errorMessage = 'Please check all required fields and try again.';
                } else if (error.message.includes('email format') || error.message.includes('Invalid email')) {
                    errorMessage = 'Please enter a valid email address.';
                } else if (error.message.includes('Network') || error.message.includes('connection')) {
                    errorMessage = 'Network connection failed. Please check your internet and try again.';
                } else if (error.message.includes('CORS') || error.message.includes('security policy')) {
                    errorMessage = 'Security restriction detected. Please try refreshing the page.';
                }
                
                showNotification(errorMessage, 'error');
                
                // Add fallback contact information
                setTimeout(() => {
                    showNotification('Alternatively, you can email me directly at farhan.peerzadaa@gmail.com', 'info');
                }, 3000);
                
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Enhanced notification system with multiple types
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => notif.remove(), 300);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50, #45a049)',
        error: 'linear-gradient(135deg, #f44336, #d32f2f)',
        info: 'linear-gradient(135deg, #2196F3, #1976D2)',
        warning: 'linear-gradient(135deg, #ff9800, #f57c00)'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Apply styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease, opacity 0.3s ease;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        max-width: 400px;
        min-width: 300px;
        background: ${colors[type]};
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-right: 10px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after delay
    const autoRemoveDelay = type === 'error' ? 8000 : 5000; // Errors stay longer
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, autoRemoveDelay);
}

// Typing Animation
function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
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
        
        typingInterval = setTimeout(typeAnimation, typeSpeed);
    }
    
    typeAnimation();
}

// Initialize animations after loading
function initializeAnimations() {
    initializeTypingAnimation();
    observeElements();
    animateOnLoad();
    addInteractiveEffects();
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    updateActiveNav();
    
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
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
}

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

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Parallax effect for floating elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.02; // Reduced for smoother effect
        const yPos = -(scrolled * speed);
        const rotation = scrolled * 0.02;
        element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
});

// 3D card tilt effect
function addInteractiveEffects() {
    const cards = document.querySelectorAll('.skill-category, .project-card, .stat-item, .reason-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
    
    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px) scale(1.02)`;
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
}

// Animate elements on page load
function animateOnLoad() {
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-social');
    
    heroElements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, (index + 1) * 200);
        }
    });
}

// Form field enhancement
function enhanceFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Handle focus and blur events
            input.addEventListener('focus', function() {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.color = 'var(--primary-color)';
                this.style.borderColor = 'var(--primary-color)';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = 'var(--text-lighter)';
                }
                this.style.borderColor = '#e0e0e0';
            });
            
            // Check if field has value on load
            if (input.value.trim()) {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.color = 'var(--primary-color)';
            }
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Arrow key navigation between sections
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
        
        if (sections[nextIndex]) {
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
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

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }, 250);
});

// Error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/400x400/667eea/ffffff?text=Image+Not+Found';
        e.target.alt = 'Image not available';
    }
}, true);

// API health check on page load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Health Check:', data);
        } else {
            console.warn('⚠️ API Health Check failed:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ API Health Check failed:', error.message);
    }
}

// DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio website initialized');
    
    // Initialize form enhancements
    enhanceFormFields();
    
    // Check API health
    checkAPIHealth();
    
    // Add animated elements observer
    const animatedElements = document.querySelectorAll('.nav-logo, .section-header, .contact-info, .footer-info');
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    // Lazy load images if supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Initialize other features
    addProjectLinkTracking();
    initializeTheme();
    
    console.log('✅ All features initialized successfully');
});

// Project link tracking
function addProjectLinkTracking() {
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectCard = this.closest('.project-card');
            if (projectCard) {
                const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
                const linkType = this.title?.toLowerCase() || 'unknown';
                
                console.log(`🔗 Project link clicked: ${projectTitle} - ${linkType}`);
            }
        });
    });
}

// Theme initialization
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-theme', e.matches);
        }
    });
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Performance metrics:', {
                        loadTime: `${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`,
                        domContentLoaded: `${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`,
                        totalTime: `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`
                    });
                }
            }, 1000);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Connection status monitoring
function monitorConnection() {
    function updateConnectionStatus(isOnline) {
        if (isOnline) {
            showNotification('✅ Connection restored', 'success');
        } else {
            showNotification('⚠️ Connection lost. Some features may not work.', 'warning');
        }
    }
    
    window.addEventListener('online', () => updateConnectionStatus(true));
    window.addEventListener('offline', () => updateConnectionStatus(false));
}

// Initialize connection monitoring
monitorConnection();

// Global error handling
window.addEventListener('error', function(e) {
    console.error('🚨 Global JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled promise rejection:', e.reason);
});

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (typingInterval) {
        clearTimeout(typingInterval);
    }
    
    // Clean up any observers
    if (observer) {
        observer.disconnect();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeAPIRequest,
        isValidEmail,
        showNotification
    };
}
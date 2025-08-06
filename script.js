// ChurnGuard landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize entrance animations
    initializeEntranceAnimations();
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate email
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        submitButton.innerHTML = '<span style="opacity: 0;">Join Waitlist</span>';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Simulate API call with enhanced experience
        setTimeout(async () => {
            try {
                // Store email in MongoDB
                await storeEmail(email);
                
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Trigger enhanced confetti
                createEnhancedConfetti();
                
                // Track success
                trackEvent('churnguard_waitlist_signup', {
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'landing_page',
                    product: 'churnguard'
                });
                
                // Scroll to success message
                successMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Update progress bar animation
                updateProgressBar();
                
            } catch (error) {
                // Show error message if MongoDB storage fails
                showError('Something went wrong. Please try again later.');
                
                // Track error
                trackEvent('churnguard_waitlist_error', {
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            } finally {
                // Reset button state
                submitButton.innerHTML = 'Join Waitlist';
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }, 1500);
    });
});

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
            
            // Track FAQ interaction
            trackEvent('faq_interaction', {
                question: question.querySelector('h3').textContent,
                action: isActive ? 'close' : 'open'
            });
        });
    });
}

// Enhanced confetti effect for SaaS theme
function createEnhancedConfetti() {
    const colors = ['#e53e3e', '#2b6cb0', '#68d391'];
    const confettiCount = 50;
    const duration = 4000;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 1 + 's';
            confetti.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
            
            // Add some variety in shapes
            if (Math.random() > 0.7) {
                confetti.style.borderRadius = '50%';
            }
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, duration);
        }, i * 40);
    }
}

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Store email in MongoDB with ChurnGuard context
async function storeEmail(email) {
    try {
        // Use Railway backend URL directly since frontend is on Vercel
        const apiUrl = 'https://competitor-production.up.railway.app/api/waitlist';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                timestamp: new Date().toISOString(),
                source: 'churnguard_landing',
                product: 'churnguard',
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('ChurnGuard email stored successfully:', data);
        return data;
    } catch (error) {
        console.error('Error storing ChurnGuard email:', error);
        
        // Enhanced fallback to localStorage
        const emails = JSON.parse(localStorage.getItem('churnguardEmails') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString(),
            status: 'offline_backup',
            product: 'churnguard'
        });
        localStorage.setItem('churnguardEmails', JSON.stringify(emails));
        
        throw error;
    }
}

// Enhanced error display
function showError(message) {
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#e53e3e';
    emailInput.style.background = 'rgba(229, 62, 62, 0.1)';
    
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #e53e3e;
        background: rgba(229, 62, 62, 0.1);
        border: 1px solid #e53e3e;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        margin-top: 1rem;
        text-align: center;
        animation: errorShake 0.5s ease-in-out;
    `;
    errorDiv.textContent = message;
    
    emailInput.parentNode.appendChild(errorDiv);
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove error styling after 6 seconds
    setTimeout(() => {
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        emailInput.style.background = 'rgba(255, 255, 255, 0.1)';
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
        document.head.removeChild(style);
    }, 6000);
}

// Enhanced smooth scrolling with offset for fixed nav
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 30;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track scroll interaction
                trackEvent('navigation_click', {
                    target: this.getAttribute('href'),
                    text: this.textContent.trim()
                });
            }
        });
    });
}

// Enhanced scroll effect for navigation
function initializeScrollEffects() {
    let scrollTimeout;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        const currentScrollY = window.scrollY;
        
        // Debounce scroll events for better performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = 'none';
                nav.style.backdropFilter = 'blur(10px)';
            }
            
            // Hide/show nav on scroll direction (optional enhancement)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, 10);
    });
}

// Enhanced entrance animations
function initializeEntranceAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for grid items
                if (entry.target.parentElement) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.pain-item, .feature, .testimonial, .flow-step, .integration-item, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Update progress bar animation
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const currentWidth = parseInt(progressFill.style.width) || 78;
        const newWidth = Math.min(currentWidth + 1, 95); // Don't go to 100%
        progressFill.style.width = newWidth + '%';
    }
}

// Enhanced analytics tracking
function trackEvent(eventName, properties = {}) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        page_title: document.title,
        referrer: document.referrer,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        ...properties
    };
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
    
    // Custom analytics endpoint (if needed)
    try {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(() => {}); // Fail silently
    } catch (e) {}
    
    console.log('ChurnGuard Event tracked:', eventData);
}

// Enhanced button click tracking
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn');
    if (button) {
        trackEvent('button_click', {
            button_text: button.textContent.trim(),
            button_location: button.closest('section')?.className || 'unknown',
            button_type: button.classList.contains('btn-primary') ? 'primary' : 'secondary',
            button_url: button.href || button.getAttribute('href') || 'none'
        });
    }
    
    // Track integration item clicks
    const integration = e.target.closest('.integration-item');
    if (integration) {
        trackEvent('integration_interest', {
            integration_name: integration.querySelector('.integration-logo').textContent,
            tooltip: integration.getAttribute('data-tooltip')
        });
    }
});

// Track scroll depth milestones
let maxScrollDepth = 0;
const scrollMilestones = [25, 50, 75, 90, 100];

window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone percentages
        scrollMilestones.forEach(milestone => {
            if (scrollDepth >= milestone && !window[`tracked_${milestone}`]) {
                window[`tracked_${milestone}`] = true;
                trackEvent('scroll_depth', { 
                    depth: milestone,
                    page_section: getCurrentSection()
                });
            }
        });
    }
});

// Get current section based on scroll position
function getCurrentSection() {
    const sections = document.querySelectorAll('section[class]');
    let currentSection = 'unknown';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section.className.split(' ')[0] || section.tagName.toLowerCase();
        }
    });
    
    return currentSection;
}

// Track time spent on page
let startTime = Date.now();
let isPageVisible = true;

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isPageVisible = false;
        trackEvent('page_visibility', {
            action: 'hidden',
            time_spent: Math.round((Date.now() - startTime) / 1000)
        });
    } else {
        isPageVisible = true;
        startTime = Date.now();
        trackEvent('page_visibility', { action: 'visible' });
    }
});

// Track page unload
window.addEventListener('beforeunload', function() {
    if (isPageVisible) {
        trackEvent('page_exit', {
            time_spent: Math.round((Date.now() - startTime) / 1000),
            max_scroll_depth: maxScrollDepth
        });
    }
});

// Performance optimization and feature detection
if ('IntersectionObserver' in window) {
    // Already using observer above
} else {
    // Fallback for older browsers
    document.querySelectorAll('.pain-item, .feature, .testimonial, .flow-step').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// Initialize dashboard chart animation
function animateDashboardChart() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(1)';
        }, index * 100);
    });
}

// Trigger chart animation when hero is visible
const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateDashboardChart, 500);
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

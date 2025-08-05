// Email collection functionality with confetti
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
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
        
        // Simulate API call (replace with your actual endpoint)
        setTimeout(async () => {
            try {
                // Store email in MongoDB
                await storeEmail(email);
                
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Trigger confetti
                createConfetti();
                
                // Track success
                trackEvent('waitlist_signup_success', {
                    email: email,
                    timestamp: new Date().toISOString()
                });
                
                // Scroll to success message
                successMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
            } catch (error) {
                // Show error message if MongoDB storage fails
                showError('Something went wrong. Please try again later.');
                
                // Track error
                trackEvent('waitlist_signup_error', {
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            } finally {
                // Reset button state
                submitButton.innerHTML = 'Join Waitlist';
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }, 1000);
    });
});

// Create confetti effect
function createConfetti() {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 5000);
        }, i * 50);
    }
}

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Store email in MongoDB
async function storeEmail(email) {
    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                timestamp: new Date().toISOString(),
                source: 'landing_page'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Email stored successfully:', data);
        return data;
    } catch (error) {
        console.error('Error storing email:', error);
        
        // Fallback to localStorage if API fails
        const emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString(),
            status: 'offline_backup'
        });
        localStorage.setItem('waitlistEmails', JSON.stringify(emails));
        
        throw error; // Re-throw to handle in the calling function
    }
}

// Enhanced error display
function showError(message) {
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#ef4444';
    emailInput.style.background = 'rgba(239, 68, 68, 0.05)';
    
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        padding: 1rem;
        border-radius: 12px;
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
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove error styling after 5 seconds
    setTimeout(() => {
        emailInput.style.borderColor = '#e2e8f0';
        emailInput.style.background = 'white';
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
        document.head.removeChild(style);
    }, 5000);
}

// Enhanced smooth scrolling with offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll effect for navigation
let scrollTimeout;
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    
    // Debounce scroll events for better performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    }, 10);
});

// Enhanced entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add stagger effect for multiple elements
            if (entry.target.parentElement && entry.target.parentElement.classList.contains('steps')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .feature, .target-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Enhanced analytics tracking
function trackEvent(eventName, properties = {}) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
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
    
    console.log('Event tracked:', eventData);
}

// Track form submission and button clicks
document.getElementById('waitlistForm').addEventListener('submit', function() {
    trackEvent('waitlist_signup_attempt', {
        source: 'landing_page'
    });
});

// Enhanced button click tracking
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.className || 'unknown',
            button_type: this.classList.contains('btn-primary') ? 'primary' : 'secondary'
        });
    });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone percentages
        if ([25, 50, 75, 100].includes(scrollDepth)) {
            trackEvent('scroll_depth', { depth: scrollDepth });
        }
    }
});

// Performance optimization
if ('IntersectionObserver' in window) {
    // Already using observer above
} else {
    // Fallback for older browsers
    document.querySelectorAll('.step, .feature, .target-content').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

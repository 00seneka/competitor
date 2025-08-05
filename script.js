// Email collection functionality with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    const spotNumber = document.getElementById('spotNumber');
    
    // Generate a random spot number for social proof
    const currentSpot = Math.floor(Math.random() * 50) + 1248;
    if (spotNumber) {
        spotNumber.textContent = currentSpot;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate email
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading state with enhanced animation
        submitButton.innerHTML = '<span>Securing Your Spot...</span><span class="loading-spinner">⚡</span>';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Simulate API call with realistic timing
        setTimeout(() => {
            // Store email
            storeEmail(email);
            
            // Track conversion
            trackEvent('waitlist_signup_success', {
                email: email,
                timestamp: new Date().toISOString(),
                spot_number: currentSpot
            });
            
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Confetti effect
            createConfetti();
            
            // Reset button state
            submitButton.innerHTML = '<span>Secure My Spot</span><span class="btn-rocket">🚀</span>';
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            
            // Auto-scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        }, 2000); // Realistic loading time
    });
});

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Enhanced email storage with better data structure
function storeEmail(email) {
    const timestamp = new Date().toISOString();
    const emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
    
    // Check for duplicates
    const isDuplicate = emails.some(entry => entry.email === email);
    if (isDuplicate) {
        console.log('Email already exists in waitlist');
        return;
    }
    
    emails.push({
        email: email,
        timestamp: timestamp,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        spotNumber: Math.floor(Math.random() * 50) + 1248
    });
    
    localStorage.setItem('waitlistEmails', JSON.stringify(emails));
    
    // Example API integration (replace with your actual endpoint)
    /*
    fetch('https://your-api.com/waitlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key'
        },
        body: JSON.stringify({
            email: email,
            timestamp: timestamp,
            source: 'landing_page',
            campaign: 'videoscale_waitlist'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Handle success response
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error - maybe show retry option
    });
    */
}

// Enhanced error display
function showError(message) {
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#dc2626';
    emailInput.style.background = 'rgba(220, 38, 38, 0.1)';
    
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #dc2626;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid #dc2626;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        margin-top: 0.5rem;
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
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        emailInput.style.background = 'rgba(255, 255, 255, 0.1)';
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
        document.head.removeChild(style);
    }, 5000);
}

// Confetti effect for success
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 10000;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
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
    
    // Debounce scroll events
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, 10);
});

// Enhanced intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add special animations for specific elements
            if (entry.target.classList.contains('testimonial-card')) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .testimonial-card, .problem-item, .benefit-item, .stat-item').forEach(el => {
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
    
    // Custom analytics endpoint
    /*
    fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    }).catch(err => console.log('Analytics error:', err));
    */
    
    console.log('Event tracked:', eventData);
}

// Track user interactions
document.addEventListener('click', function(e) {
    const element = e.target.closest('button, .btn, a');
    if (element) {
        trackEvent('element_click', {
            element_type: element.tagName.toLowerCase(),
            element_text: element.textContent.trim(),
            element_class: element.className,
            section: element.closest('section')?.className || 'unknown'
        });
    }
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track 25%, 50%, 75%, 100% scroll milestones
        if ([25, 50, 75, 100].includes(scrollDepth)) {
            trackEvent('scroll_depth', { depth: scrollDepth });
        }
    }
});

// Track time on page
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', { 
        seconds: timeOnPage,
        max_scroll_depth: maxScrollDepth 
    });
});

// Progressive enhancement for older browsers
if (!window.CSS || !CSS.supports('backdrop-filter', 'blur(10px)')) {
    document.documentElement.classList.add('no-backdrop-filter');
}

// Add loading states to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('no-loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        }
    });
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: lazy load images if any are added
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

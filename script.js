// Email collection functionality
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
        submitButton.textContent = 'Joining...';
        submitButton.disabled = true;
        
        // Simulate API call (replace with your actual endpoint)
        setTimeout(() => {
            // Store email (you can replace this with actual API call)
            storeEmail(email);
            
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Reset button state
            submitButton.textContent = 'Join Waitlist';
            submitButton.disabled = false;
        }, 1000);
    });
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Store email (replace with your backend integration)
function storeEmail(email) {
    // For now, just store in localStorage
    const emails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
    emails.push({
        email: email,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('waitlistEmails', JSON.stringify(emails));
    
    // You can replace this with an actual API call to your backend
    // Example:
    /*
    fetch('/api/waitlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
}

// Show error message
function showError(message) {
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#ff4444';
    
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    emailInput.parentNode.appendChild(errorDiv);
    
    // Remove error styling after 3 seconds
    setTimeout(() => {
        emailInput.style.borderColor = '#eee';
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Add entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .feature, .target-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Analytics tracking (replace with your analytics service)
function trackEvent(eventName, properties = {}) {
    // Example for Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example for other analytics services
    console.log('Event tracked:', eventName, properties);
}

// Track form submission
document.getElementById('waitlistForm').addEventListener('submit', function() {
    trackEvent('waitlist_signup', {
        source: 'landing_page'
    });
});

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent,
            button_location: this.closest('section')?.className || 'unknown'
        });
    });
});

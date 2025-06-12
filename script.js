// Common JavaScript for all OPay pages

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the current page
    if (document.getElementById('signup-form')) {
        initSignupPage();
    } else if (document.getElementById('login-form')) {
        initLoginPage();
    } else if (document.getElementById('dashboard-container')) {
        initDashboardPage();
    }
});

// Sign Up Page Initialization
function initSignupPage() {
    // DOM Elements
    const signupForm = document.getElementById('signup-form');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const maleOption = document.getElementById('male-option');
    const femaleOption = document.getElementById('female-option');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(password, togglePassword);
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
    });
    
    // Gender selection
    maleOption.addEventListener('click', function() {
        maleOption.classList.add('selected');
        femaleOption.classList.remove('selected');
        hideError('gender-error');
    });
    
    femaleOption.addEventListener('click', function() {
        femaleOption.classList.add('selected');
        maleOption.classList.remove('selected');
        hideError('gender-error');
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateSignupForm()) {
            // Create user object
            const user = {
                firstName: document.getElementById('first-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim(),
                email: document.getElementById('email').value,
                phone: document.getElementById('country-code').textContent + document.getElementById('phone').value,
                gender: maleOption.classList.contains('selected') ? 'male' : 'female',
                balance: 125800.50,
                joined: new Date().toISOString()
            };
            
            // Store user data
            localStorage.setItem('opayUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
}

// Login Page Initialization
function initLoginPage() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const loginPassword = document.getElementById('login-password');
    
    // Toggle password visibility
    toggleLoginPassword.addEventListener('click', function() {
        togglePasswordVisibility(loginPassword, toggleLoginPassword);
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if user exists in localStorage
        const user = JSON.parse(localStorage.getItem('opayUser'));
        
        if (user) {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('No account found. Please sign up first.');
        }
    });
}

// Dashboard Page Initialization
function initDashboardPage() {
    // Load user data
    const user = JSON.parse(localStorage.getItem('opayUser'));
    
    if (user) {
        // Set user information
        document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('user-email').textContent = user.email;
        
        // Set profile picture based on gender
        const profilePic = document.getElementById('profile-pic');
        if (user.gender === 'male') {
            profilePic.innerHTML = '<i class="fas fa-male"></i>';
            profilePic.style.background = 'linear-gradient(135deg, #3560f6, #1d3a8a)';
        } else {
            profilePic.innerHTML = '<i class="fas fa-female"></i>';
            profilePic.style.background = 'linear-gradient(135deg, #ec4899, #8b5cf6)';
        }
    }
    
    // Update greeting based on time
    updateGreeting();
    
    // Toggle balance visibility
    const toggleBalance = document.getElementById('toggle-balance');
    const balanceAmount = document.getElementById('balance-amount');
    
    toggleBalance.addEventListener('click', function() {
        balanceAmount.classList.toggle('balance-hidden');
        
        if (toggleBalance.classList.contains('fa-eye-slash')) {
            toggleBalance.classList.remove('fa-eye-slash');
            toggleBalance.classList.add('fa-eye');
        } else {
            toggleBalance.classList.remove('fa-eye');
            toggleBalance.classList.add('fa-eye-slash');
        }
    });
    
    // Initialize ad carousel
    initAdCarousel();
    
    // Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Helper Functions
function togglePasswordVisibility(passwordField, toggleIcon) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function validateSignupForm() {
    let isValid = true;
    
    // Reset errors
    hideError('first-name-error');
    hideError('last-name-error');
    hideError('email-error');
    hideError('phone-error');
    hideError('gender-error');
    hideError('password-error');
    hideError('confirm-password-error');
    
    // Validate first name
    const firstName = document.getElementById('first-name').value.trim();
    if (!firstName) {
        showError('first-name-error');
        isValid = false;
    }
    
    // Validate last name
    const lastName = document.getElementById('last-name').value.trim();
    if (!lastName) {
        showError('last-name-error');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email-error');
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
        showError('phone-error');
        isValid = false;
    }
    
    // Validate gender
    const maleOption = document.getElementById('male-option');
    const femaleOption = document.getElementById('female-option');
    if (!maleOption.classList.contains('selected') && 
        !femaleOption.classList.contains('selected')) {
        showError('gender-error');
        isValid = false;
    }
    
    // Validate password
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        showError('password-error');
        isValid = false;
    }
    
    // Validate password match
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        showError('confirm-password-error');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
    } else if (hour >= 17 || hour < 5) {
        greeting = 'Good Evening';
    }
    
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = `${greeting}, ${document.getElementById('user-name').textContent}`;
    }
}

function initAdCarousel() {
    const adItems = document.querySelectorAll('.ad-item');
    let currentIndex = 0;
    
    // Show first ad
    if (adItems.length > 0) {
        adItems[0].classList.add('active');
    }
    
    // Rotate ads every 5 seconds
    setInterval(() => {
        adItems[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex + 1) % adItems.length;
        
        adItems[currentIndex].classList.add('active');
    }, 5000);
}
 const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      datasets: [{
        label: 'Stocks Flow Chart',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
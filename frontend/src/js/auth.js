document.addEventListener('DOMContentLoaded', () => {
    
    // Handle Login Button (Redirect to login page)
    const loginButton = document.querySelector('[data-login-btn]');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            window.location.href = 'login.html'; // Redirect to the login page
        });
    }

    // Handle Signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const response = await fetch('http://localhost:4000/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData)),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Signup successful, redirecting to dashboard...');
                localStorage.setItem('jwt-token', result.token);
                localStorage.setItem('username', result.user.username);
                window.location.href = '/frontend/dashboard.html'; // Redirect to dashboard
            } else {
                alert(`Signup failed: ${result.message}`);
            }
        });
    }

    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            try {
                const formData = new FormData(loginForm);
                const response = await fetch('http://localhost:4000/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formData)),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('jwt-token', result.token);
                    localStorage.setItem('username', result.user.username);
                    alert('Login successful, redirecting to dashboard...');
                    window.location.href = '/frontend/dashboard.html'; // Redirect to dashboard
                } else {
                    alert(`Login failed: ${result.message}`);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed due to a network error.');
            }
        });
    }
});

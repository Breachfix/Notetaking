document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:4000/api/v1/auth';
    
    const otpForm = document.getElementById('otpForm');

    otpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const otp = document.getElementById('otp').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch(`${API_BASE}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, email })
            });

            const result = await response.json();

            if (response.ok) {
                alert('OTP verified successfully');
                // Store the tempToken
                localStorage.setItem('tempToken', result.tempToken);
                window.location.href = 'reset.html';  // Redirect to reset password page
            } else {
                alert('OTP verification failed');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            alert('Error during OTP verification.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:4000/api/v1/auth';  // Correct API base URL
    
    const resetForm = document.getElementById('resetForm');

    resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const tempToken = localStorage.getItem('tempToken');  // Retrieve the token from local storage

        if (!tempToken) {
            alert('Invalid session. Please verify OTP again.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/reset_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken, newPassword })  // Send tempToken and new password
            });

            const result = await response.json();

            if (response.ok) {
                alert('Password reset successfully');
                window.location.href = 'login.html';  // Redirect to login page
                localStorage.removeItem('tempToken');  // Clear the token after successful reset
            } else {
                alert(`Password reset failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            alert('Error during password reset.');
        }
    });
});

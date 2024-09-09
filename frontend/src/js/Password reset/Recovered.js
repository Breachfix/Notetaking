document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:4000/api/v1/auth';  // Corrected to match the backend route

    const recoveredForm = document.getElementById('recoveredForm');

    recoveredForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        try {
            const response = await fetch(`${API_BASE}/send_otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient_email: email })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Account recovery email sent!');
                window.location.href = 'opt.html';  // Redirect to OTP verification
            } else {
                alert(`Recovery failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error during recovery process:', error);
            alert('An error occurred during the recovery process. Please try again.');
        }
    });
});

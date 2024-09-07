import express from 'express';
import passport from 'passport';
import { signupAPI,  resetPassword, logout, verifyToken,sendOTP } from '../controllers/auth.controller.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js'; // Import the token generator function

const router = express.Router();

// API routes
router.post('/signup', signupAPI);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Handle failed authentication for both API and Web requests
            if (req.headers['content-type'] === 'application/json') {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            } else {
                return res.render('login', { error: 'Invalid credentials' });
            }
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // Generate the token
            const token = generateTokenAndSetCookie(user._id, res);

            // Handle successful authentication for both API and Web requests
            if (req.headers['content-type'] === 'application/json') {
                return res.status(200).json({
                    success: true,
                    message: 'Logged in successfully',
                    user: { id: user._id, email: user.email, username: user.username },
                    token // Include the token in the response
                });
            } else {
                return res.redirect('/dashboard');
            }
        });
    })(req, res, next);
});
// Add the verify token route
router.post('/verify-token', verifyToken); 

// OTP route
router.post('/send_otp', sendOTP);

// Reset password route
router.post('/reset_password', resetPassword);
router.post('/logout', logout);

export default router;

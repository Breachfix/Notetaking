import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV_VARS } from '../config/envVars.js';

// Middleware to protect API routes
export const protectForAPI = async (req, res, next) => {
    try {
        let token;

        // Get the token from Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]; // Extract token from Bearer header
        } else if (req.cookies['jwt-breachfix']) {
            token = req.cookies['jwt-breachfix']; // Extract token from cookies
        }

        console.log('Received Token:', token);  // Debugging line

        // Check if no token found
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

        console.log('Decoded Token:', decoded);  // Debugging line

        // Find the user by ID and attach to request object
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error('An error occurred in protect middleware:', error.message);

        // If the error is related to JWT, return 401 Unauthorized
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }

        // General server error
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};



// Middleware to protect EJS routes
export async function protectForViews(req, res, next) {
    // Check if the token is in the Authorization header first
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Debugging: log the token to verify it
    console.log('Extracted Token:', token);

    // If no token in header, check in cookies
    if (!token) {
        token = req.cookies['jwt-breachfix'];
    }

    if (!token) {
        return res.redirect('/api/v1/auth/login');
    }

    try {
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.redirect('/api/v1/auth/login');
        }
        next();
    } catch (error) {
        console.error('Error in token verification:', error.message);
        res.clearCookie('jwt-breachfix');
        return res.redirect('/api/v1/auth/login');
    }
}


// Middleware to protect routes in general (ensure authenticated)
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // If the user is authenticated, proceed to the next middleware/route handler
    }
    res.redirect('/login'); // If the user is not authenticated, redirect to the login page
}

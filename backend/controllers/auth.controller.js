import User from '../models/user.model.js';
import { ENV_VARS } from '../config/envVars.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { sendEmail } from '../utils/email.js';  // Use the utility function


// -----------------------------------
// EJS Rendering Controllers
// -----------------------------------

// Render the Login page
export function renderLogin(req, res) {
    res.render('login');
}

// Render the Signup page
export function renderSignup(req, res) {
    res.render('signup');
}

// Render the Dashboard page (ensure this is a protected route)
export function renderDashboard(req, res) {
    if (!req.user) {
        return res.redirect('/api/v1/auth/login');
    }
    res.render('dashboard', { user: req.user });
}

// -----------------------------------
// API Controllers (JSON Responses)
// -----------------------------------

// Signup for API
export async function signupAPI(req, res) {
    try {
        const { username, password, email } = req.body;

        if (!email || !password || !username) {
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ success: false, message: "Please provide all required fields" });
            } else {
                return res.render('signup', { error: "Please provide all required fields" });
            }
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ success: false, message: "Please provide a valid email" });
            } else {
                return res.render('signup', { error: "Please provide a valid email" });
            }
        }

        if (password.length < 7) {
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ success: false, message: "Password must be at least 7 characters long" });
            } else {
                return res.render('signup', { error: "Password must be at least 7 characters long" });
            }
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ success: false, message: "Email already exists" });
            } else {
                return res.render('signup', { error: "Email already exists" });
            }
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            if (req.headers['content-type'] === 'application/json') {
                return res.status(400).json({ success: false, message: "Username already exists" });
            } else {
                return res.render('signup', { error: "Username already exists" });
            }
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png", "/avatar4.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image
        });

        await newUser.save();

        // Handle response based on content type
        if (req.headers['content-type'] === 'application/json') {
            return res.status(201).json({ success: true, user: { ...newUser._doc, password: "" }, message: "User created successfully" });
        } else {
            return res.redirect('/api/view/login'); // Redirect to login page after signup
        }

    } catch (error) {
        console.error('Error during signup:', error);
        if (req.headers['content-type'] === 'application/json') {
            return res.status(500).json({ success: false, message: error.message });
        } else {
            return res.render('signup', { error: "Server error" });
        }
    }
}



export async function loginAPI(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Incorrect email" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = generateTokenAndSetCookie(user._id, res); // Store the token generated

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token // Include the token in the response
        });
    } catch (error) {
        console.error("An error occurred in Login Controller", error.message, error);
        res.status(500).json({ success: false, message: error.message });
    }
}



// -----------------------------------
// API Controllers (Reset Password)
// -----------------------------------
// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send email function using Nodemailer

// Route to send OTP email
export async function sendOTP(req, res) {
    const { recipient_email } = req.body;
    try {
      const user = await User.findOne({ email: recipient_email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const OTP = generateOTP();
      const otpExpires = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes
  
      // Save OTP and expiry time in the user's database
      user.otp = OTP;
      user.otpExpires = otpExpires;
      await user.save();

      console.log(`OTP generated for user ${user.email}: ${OTP}`);  // Debugging info

  
      // Send email
      await sendEmail({ recipient_email, OTP });
      
      res.json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Error sending OTP:', error);  // Log the exact error for debugging
      res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
  }

export async function verifyOTP(req, res) {
    const { otp, email } = req.body;
  
    try {
      const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Clear the OTP once verified
      user.otp = null;
      user.otpExpires = null;
      await user.save();
  
      // Generate a temporary token that expires in 10 minutes
      const tempToken = jwt.sign({ email: user.email }, ENV_VARS.JWT_SECRET, { expiresIn: '10m' });
  
      res.json({ message: 'OTP verified successfully', tempToken });
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).json({ message: 'Error during OTP verification' });
    }
  }  
  
// Route to reset password
export async function resetPassword(req, res) {
  const { tempToken, newPassword } = req.body;

  try {
    // Verify the temporary token
    const decoded = jwt.verify(tempToken, ENV_VARS.JWT_SECRET);
    const email = decoded.email;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    console.log('Hashed password:', hashedPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successful for user:', user.email);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);  // Log the exact error
    res.status(500).json({ message: 'Error resetting password' });
  }
}

  
  




export async function logout(req, res) {
   try{
    res.clearCookie('jwt-breachfix');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
    
   } catch (error) {
    console.error("An error occurred in logout Controller", error.message, error);
    res.status(500).json({ success: false, message: error.message });

   }
}


// Verify token controller
// Middleware to verify the token
export function verifyToken(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, ENV_VARS.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // If the token is valid, you can use the decoded data (e.g., user ID) to perform additional checks or simply return success
        req.user = decoded; // Attach the decoded token data to the request object if needed
        return res.status(200).json({ success: true, message: 'Token is valid' });
    });
}






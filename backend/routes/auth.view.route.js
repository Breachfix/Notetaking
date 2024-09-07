import express from 'express';
import { renderLogin, renderSignup, renderDashboard  } from '../controllers/auth.controller.js';
import { protectForViews } from '../middleware/auth.middleware.js';

const router = express.Router();

// EJS rendering routes
router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.get('/dashboard', protectForViews, renderDashboard);



export default router;

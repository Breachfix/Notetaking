import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.route.js';
import folderRoutes from './routes/notebooks.route.js'; 
import noteRoutes from './routes/note.route.js';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import './config/passport.js'; // Import your passport configuration
import nodemailer from 'nodemailer';



// Import necessary modules
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
app.use(express.urlencoded({ extended: true }));  
const PORT = ENV_VARS.PORT;

// Getting __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', './backend/views');


// Connect to MongoDB database



const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    return callback(null, true);  // Allow all origins
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allows cookies and credentials to be passed
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser()); 

// Express session setup
app.use(session({
    secret: ENV_VARS.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: ENV_VARS.NODE_ENV !== "development", // Only set to true if in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
}));


// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Your routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use('/api/v1/notebooks', folderRoutes); 

// // Serve static files like CSS, JS, images from the frontend directory
// app.use(express.static(path.join(process.cwd(), 'frontend')));



app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
    connectDB();
});

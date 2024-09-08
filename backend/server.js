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

function sendEmail({ recipient_email, OTP }) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: ENV_VARS.MY_EMAIL,
          pass: ENV_VARS.MY_PASSWORD,
        },
      });
  
      const mail_configs = {
        from: ENV_VARS.MY_EMAIL,
        to: recipient_email,
        subject: "PASSWORD RECOVERY",
        html: `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">BreachFix</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing BreachFix. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />BreachFix</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>breachfix</p>
        <p>Port Coquitlam</p>
        <p>BC</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }
  app.post("/send_recovery_email", (req, res) => {
    sendEmail(req.body)
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
});
// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Your routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use('/api/v1/notebooks', folderRoutes); 

// Serve static files like CSS, JS, images from the frontend directory
app.use(express.static(path.join(process.cwd(), 'frontend')));



app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
    connectDB();
});

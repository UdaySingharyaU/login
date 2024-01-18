import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan"; // Import morgan for request logging
import sessionMiddleware from "./middleware/sessionMiddleware.js";
import authRoute from "./authRoutes/authRoute.js"
import passport from "passport";
import mongoose from "mongoose";
const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware for session management
app.use(sessionMiddleware);


// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());



// Middleware for logging requests
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect('mongodb://localhost/your-database-name');

// Routes
app.use('/',authRoute);

// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

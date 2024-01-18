import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/Update";

// Connect to MongoDB
mongoose.connect(dbURL);


// Get the default Mongoose connection
const db = mongoose.connection;


db.on('connected', () => {
    console.log('MongoDB connected successfully');
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

db.on('error', (error) => {
    console.error(`MongoDB connection error: ${error}`);
});

export default db;
import mongoose from 'mongoose';


// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiration: Date,
  verified: { type: Boolean, default: false }
});


// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);


export default User;
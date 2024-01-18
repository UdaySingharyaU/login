import User from "../model/User.js" ;
import nodemailer from "nodemailer";



//generate otp
const generateOTP= () =>{
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = (email,otp)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'udaysingharya78@gmail.com',
            pass:'--------'
        }
    });

    const mailOption = {
        from:"udaysingharya@gmail.com",
        to:email,
        subject:'Verification OTP',
        text:`You OTP for verification is : ${otp}. It will be valid for 2 minutes.`
    };

    transporter.sendMail(mailOption,(error,info)  =>{
        if(error) {
            console.log(error);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    });
}
//for signuo
export const signup= async (req,res)=>{
    const { email, password } = req.body;
    console.log("sign up service");
    try{
        //check the mail is already registered  
        const existUser=await User.findOne({email});
        console.log("sign up service1");
        if(existUser){
            throw new Error("Email is already registered");
        }

        const otp=generateOTP();
        const userObject=new User({email,password,otp,otpExpiration:Date.now()+120000}); //otp valid for 2 minutes(120,000 mili seconds)
        await userObject.save();

        //send otp on mail
        sendOtp(email,otp);

         // Store user information in the session
        req.session.user = { email, verified: false };

        res.json({ message: 'OTP sent for verification' });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

export const verify = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otpExpiration < Date.now()) {
            throw new Error('Invalid OTP or OTP expired');
        }

        // Set user as verified in the session
        req.session.user.verified = true;

        // Clear the OTP value and set user as verified
        user.otp = null;
        user.otpExpiration = null;
        user.verified = true;

        await user.save();

        res.json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if the password matches using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch || !user.verified) {
            throw new Error('Invalid credentials or not verified');
        }

        // Store only the user ID in the session
        req.session.userId = user._id;

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};


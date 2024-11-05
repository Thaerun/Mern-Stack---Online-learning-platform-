const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const app = express();
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // Use a more secure value and store in env variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
});

// User Model
const User = mongoose.model('User', userSchema);

// OTP Schema
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

//OTP model
const Otp = mongoose.model('Otp', otpSchema);

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = new User({ email, password: hashedPassword, verificationToken, });
        await user.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/verify-email?token=${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        res.status(201).send('User created. Please check your email to verify your account.');
    } catch (error) {
        res.status(400).send('User already exists');
    }
});

// Email Verification Route
app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    
    try {
        // Find user by token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        // Mark the email as verified and remove the token
        user.isEmailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send('Email verified successfully. You can now log in.');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    // Check if email is verified
    if (!user.isEmailVerified) {
        return res.status(403).send('Please verify your email before logging in');
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Protect Route (middleware example)
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token, authorization denied');
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send('Token is not valid');
    }
};


// Send OTP Route
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 10 * 60000);
        await Otp.create({ email, otp, expiresAt });

        // Send OTP email
        await transporter.sendMail({
            to: email,
            subject: 'Your OTP for Password Reset',
            html: `<p>Your OTP for password reset is <strong>${otp}</strong>. The OTP is valid only for next 10 minutes.</p>`,
        });

        res.send('OTP sent to your email.');
    } catch (error) {
        console.error('Error sending OTP', error);
        res.status(500).send('Error sending OTP');
    }
});

// Verify OTP Route
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Check if the OTP exists and is not expired
    const otpEntry = await Otp.findOne({ email, otp });
    if (otpEntry && otpEntry.expiresAt > new Date()) {
        // OTP is valid, allow user to update their password
        await Otp.deleteOne({ email }); // Remove OTP after use
        res.send('OTP verified. You can now reset your password.');
    } else {
        res.status(400).send('Invalid or expired OTP');
    }
});

// Update Password Route (to be called after OTP verification)
app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });
        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating password');
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

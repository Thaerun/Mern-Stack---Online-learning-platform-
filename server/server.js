const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // Use a more secure value and store in env variables

// Connect to MongoDB
mongoose.connect('mongodb+srv://dhineshkumar1729:qwertyuiop@cluster0.fc7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// User Model
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('User already exists');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

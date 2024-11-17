const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/users', require('./routes/user'));
app.use('/instructors', require('./routes/instructor'));
app.use('/admin', require('./routes/admin'));
app.use('/forums', require('./routes/forum'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
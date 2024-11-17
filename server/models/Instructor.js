// models/Instructor.js
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    name: { type: String },
    username: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    phoneNumber: { type: String },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Instructor', instructorSchema);
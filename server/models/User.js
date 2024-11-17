// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    coursesProgress: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        completedSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
        lastSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    }],
    name: { type: String },
    username: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    phoneNumber: { type: String },
    imageUrl: { type: String }
});

module.exports = mongoose.model('User', userSchema);
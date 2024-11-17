import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Pages/User/Signup';
import Login from './Pages/User/Login';
import ForgotPassword from './Pages/User/ForgotPassword';
import StudentDashboard from './Pages/User/StudentDashboard';
import CourseDetails from './Pages/User/CourseDetails';
import Payment from './Pages/User/Payment';
import CourseContent from './Pages/User/CourseContent';
import StudentProfile from './Pages/User/StudentProfile';
import InstructorAuth from './Pages/Instructor/InstructorAuth';
import InstructorDashboard from './Pages/Instructor/InstructorDashboard';
import CreateCourse from './Pages/Instructor/CreateCourse';
import Earnings from './Pages/Instructor/earnings';
import EditCourse from './Pages/Instructor/EditCourse';
import Profile from './Pages/Instructor/Profile';
import EnrolledStudents from './Pages/Instructor/EnrolledStudents';

import LandingPage from './Pages/LandingPage';
import AdminPage from './Pages/Admin/Admin';

import ContactUs from './Pages/Navs/Contactus';
import Blog from './Pages/Navs/blog';
import Careers from './Pages/Navs/careers';
import TeacherGuidelines from './Pages/Navs/TeacherGuidelines';

export default function App() {
    const [studentToken, setStudentToken] = useState(null);
    const [instructorToken, setInstructorToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // On mount, check localStorage for tokens
    useEffect(() => {
        const token = localStorage.getItem('studentToken');
        const instructorToken = localStorage.getItem('instructorToken');

        if (token) {
            setStudentToken(token);
        }
        if (instructorToken) {
            setInstructorToken(instructorToken);
        }

        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    handleLogout(); // This will clear the tokens and redirect to login
                    alert('Session expired. Please log in again.');
                }
                return Promise.reject(error);
            }
        );
    }, []);

    const handleLogout = () => {
        setStudentToken(null);
        setInstructorToken(null);
        localStorage.removeItem('studentToken');
        localStorage.removeItem('instructorToken');
        localStorage.removeItem('instructorEmail');
        localStorage.removeItem('userEmail');
    };

    // Show a loading screen or prevent route rendering until auth is checked
    if (isCheckingAuth) {
        return <div>Loading...</div>; // Can be replaced with a proper loading component
    }

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setStudentToken={setStudentToken} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/instructor-auth" element={<InstructorAuth setInstructorToken={setInstructorToken} />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/TeacherGuidelines" element={<TeacherGuidelines />} />

                {/* LandingPage is public */}
                <Route path="/" element={<LandingPage />} />

                {/* Protected route for Student Dashboard */}
                <Route
                    path="/dashboard"
                    element={studentToken ? <StudentDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                {/* Protected route for Instructor Dashboard */}
                <Route
                    path="/instructor-dashboard"
                    element={instructorToken ? <InstructorDashboard onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/create-course"
                    element={instructorToken ? <CreateCourse onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/earnings"
                    element={instructorToken ? <Earnings onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/enrolled-students"
                    element={instructorToken ? <EnrolledStudents onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/edit-course/:courseId"
                    element={instructorToken ? <EditCourse onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/profile"
                    element={instructorToken ? <Profile onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                <Route
                    path="/course/:courseId"
                    element={studentToken ? <CourseDetails onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/payment"
                    element={studentToken ? <Payment /> : <Navigate to="/login" />}
                />
                <Route
                    path="/my-courses/:courseId"
                    element={studentToken ? <CourseContent onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/student-profile"
                    element={studentToken ? <StudentProfile onLogout={handleLogout} /> : <Navigate to="/login" />}
                />

                {/* Redirect any undefined routes to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

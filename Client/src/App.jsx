import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import ForgotPassword from './Pages/ForgotPassword';
import InstructorAuth from './Pages/InstructorAuth';
import InstructorDashboard from './Pages/InstructorDashboard';
import CreateCourse from './Pages/CreateCourse';
import Earnings from './Pages/earnings';
import EditCourse from './Pages/EditCourse';
import Profile from './Pages/Profile';
import StudentDashboard from './Pages/StudentDashboard';
import CourseDetails from './Pages/CourseDetails';
import Payment from './Pages/Payment';
import CourseContent from './Pages/CourseContent';
import StudentProfile from './Pages/StudentProfile';
import AdminPage from './Pages/Admin';
import EnrolledStudents from './Pages/EnrolledStudents';
import ContactUs from './Pages/Contactus';
import Blog from './Pages/blog';
import Careers from './Pages/careers';
import TeacherGuidelines from './Pages/TeacherGuidelines';

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

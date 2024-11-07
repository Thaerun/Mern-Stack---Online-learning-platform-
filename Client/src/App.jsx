import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

export default function App() {
    const [authToken, setAuthToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // On mount, check localStorage for authToken
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        }
        setIsCheckingAuth(false); 
    }, []); 

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
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
                <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/instructor-auth" element={<InstructorAuth setAuthToken={setAuthToken} />} />
                <Route path="/admin" element={<AdminPage />} />

                
                {/* LandingPage is public */}
                <Route path="/" element={<LandingPage />} /> 
                
                {/* Protected route for Dashboard */}
                <Route
                    path="/dashboard"
                    element={authToken ? <StudentDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />
                <Route
                    path="/instructor-dashboard"
                    element={authToken ? <InstructorDashboard onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />} 
                />
                <Route
                    path="/create-course"
                    element={authToken ? <CreateCourse onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />} 
                />

                <Route
                    path="/earnings"
                    element={authToken ? <Earnings onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />} 
                />

                <Route
                    path="/enrolled-students"
                    element={authToken ? <EnrolledStudents onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />} 
                />

                <Route 
                    path="/edit-course/:courseId" 
                    element={authToken ? <EditCourse  onLogout={handleLogout} /> : <Navigate to= "/instructor-auth" /> } 
                />
                
                <Route
                    path="/profile"
                    element={authToken? <Profile onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />

                <Route 
                    path="/course/:courseId" 
                    element={authToken? <CourseDetails onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />

                <Route 
                    path="/payment" 
                    element={authToken? <Payment /> : <Navigate to="/login" />} 
                />

                <Route 
                    path="/my-courses/:courseId" 
                    element={authToken? <CourseContent onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />

                <Route 
                    path="/student-profile" 
                    element={authToken? <StudentProfile onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />

                {/* Redirect any undefined routes to home */}
                <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
        </Router>
    );
}

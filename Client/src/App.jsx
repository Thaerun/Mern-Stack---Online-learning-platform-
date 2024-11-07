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

export default function App() {
    const [authToken, setAuthToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // On mount, check localStorage for authToken
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        }
        setIsCheckingAuth(false); // Stop loading once auth check is complete
    }, []); // Only run on mount

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
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
                    path="/edit-course/:courseId" 
                    element={authToken ? <EditCourse  onLogout={handleLogout} /> : <Navigate to= "/instructor-auth" /> } 
                />
                
                <Route
                    path="/profile"
                    element={authToken? <Profile onLogout={handleLogout} /> : <Navigate to="/instructor-auth" />}
                />
                {/* Redirect any undefined routes to home */}
                <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
        </Router>
    );
}

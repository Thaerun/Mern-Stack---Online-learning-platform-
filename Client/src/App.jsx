import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard'; // New Dashboard component

export default function App() {
    const [authToken, setAuthToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state to handle loading

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
                
                {/* LandingPage is public */}
                <Route path="/" element={<LandingPage />} /> 
                
                {/* Protected route for Dashboard */}
                <Route
                    path="/dashboard"
                    element={authToken ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />

                {/* Redirect any undefined routes to home */}
                <Route path="*" element={<Navigate to="/" />} /> 
            </Routes>
        </Router>
    );
}

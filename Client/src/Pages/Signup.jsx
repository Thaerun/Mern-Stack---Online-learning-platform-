import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Updated to useNavigate

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/signup`, { email, password });
            navigate('/login'); // Updated to navigate after signup
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    return (
        <div className="container">
            <h2 className='mt-5'>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
}

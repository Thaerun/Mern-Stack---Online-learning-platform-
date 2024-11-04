import React from 'react';

export default function Dashboard({ onLogout }) {
    return (
        <div className="container">
            <h1 className="mt-5">Dashboard</h1>
            <p>Welcome to your dashboard! This is a protected route.</p>
            <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>
    );
}

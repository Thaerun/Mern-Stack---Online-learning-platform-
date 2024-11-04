import React from 'react';
import { FaSearch, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Header() {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <header className="sticky-top bg-white border-bottom">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <FaBook className="me-2" />
                        <span className="fw-bold">LearnHub</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/courses">Courses</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/categories">Categories</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/teach">Teach</a>
                            </li>
                        </ul>
                        <form className="d-flex me-2">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <FaSearch className="text-muted" />
                                </span>
                                <input
                                    className="form-control border-start-0"
                                    type="search"
                                    placeholder="Search for courses..."
                                    aria-label="Search"
                                />
                            </div>
                        </form>
                        <div className="d-flex">
                            {/* Use onClick and navigate to login and signup */}
                            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>
                                Log in
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
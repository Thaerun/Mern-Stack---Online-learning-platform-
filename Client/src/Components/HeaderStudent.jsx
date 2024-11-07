import React from 'react';
import { FaSearch, FaBook, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HeaderStudent({ onLogout }) {
    const navigate = useNavigate();

    return (
        <header className="sticky-top bg-white border-bottom">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light py-2">
                    {/* Branding and Burger Menu */}
                    <div className="d-flex align-items-center">
                        <a className="navbar-brand d-flex align-items-center" href="/">
                            <FaBook className="me-2" />
                            <span className="fw-bold">LearnHub</span>
                        </a>
                        <button
                            className="navbar-toggler ms-auto"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarContent"
                            aria-controls="navbarContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <FaBars />
                        </button>
                    </div>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
                        {/* Search Bar (Center-Aligned) */}
                        <form className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" style={{ maxWidth: '500px' }}>
                            <div className="input-group w-100">
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
                        
                        {/* Profile and Logout Buttons (Right-Aligned) */}
                        <div className="d-flex align-items-center">
                            <button className="btn btn-outline-primary me-3" onClick={() => navigate('/student-profile')}>
                                <FaUser className="me-1" /> Profile
                            </button>
                            <button className="btn btn-outline-danger" onClick={onLogout}>
                                <FaSignOutAlt className="me-1" /> Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

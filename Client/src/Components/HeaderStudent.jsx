import React, { useState } from 'react';
import { FaSearch, FaBook, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

export default function HeaderStudent({ onLogout }) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    return (
        <header className="sticky-top bg-white border-bottom">
            <nav className="navbar navbar-expand-lg navbar-light py-2 px-3">
                {/* Branding */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <FaBook className="me-2" />
                    <span className="fw-bold">LearnHub</span>
                </a>

                {/* Right-aligned content */}
                <div className="ms-auto d-flex align-items-center">
                    {/* Search Bar (center-aligned on large screens) */}
                    <form className="d-none d-lg-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" style={{ maxWidth: '400px' }}>
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

                    {/* Burger Menu with Custom Dropdown */}
                    <div className="d-lg-none position-relative">
                        <button className="btn p-0 m-0 border-0" onClick={toggleDropdown}>
                            <FaBars size={24} />
                        </button>

                        <Dropdown.Menu show={showDropdown} align="end" className="position-absolute end-0 mt-2">
                            <Dropdown.Item onClick={() => navigate('/student-profile')}>
                                <FaUser className="me-2" /> Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={onLogout}>
                                <FaSignOutAlt className="me-2" /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </div>

                    {/* Profile and Logout Buttons for large screens */}
                    <div className="d-none d-lg-flex align-items-center">
                        <button className="btn btn-outline-primary me-3" onClick={() => navigate('/student-profile')}>
                            <FaUser className="me-1" /> Profile
                        </button>
                        <button className="btn btn-outline-danger" onClick={onLogout}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
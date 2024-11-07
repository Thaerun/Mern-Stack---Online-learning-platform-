import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaBook, FaPlusCircle, FaDollarSign, FaUsers, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout, isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`sidebar bg-primary text-white d-flex flex-column ${isSidebarOpen ? '' : 'collapsed'}`}
      style={{
        position: 'fixed',
        height: '100vh',
        width: isSidebarOpen ? '250px' : '70px',
        transition: 'width 0.3s',
        overflow: 'hidden', // Ensures no scrollbar appears in the sidebar
        boxSizing: 'border-box', // Ensures padding and border are included in width/height
      }}
    >
      <div className="d-flex align-items-center mt-3 px-3">
        <button className="btn text-white me-2" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h2 className="text-white mb-0" style={{ display: isSidebarOpen ? 'block' : 'none' }}>Dashboard</h2>
      </div>

      <ul className="nav flex-column px-3 mt-4" style={{ flexGrow: 1 }}>
        <li className="nav-item mb-3">
          <a href="/instructor-dashboard" className="nav-link text-white d-flex align-items-center">
            <FaBook className="me-2" />
            {isSidebarOpen && 'My Courses'}
          </a>
        </li>
        <li className="nav-item mb-3">
          <a href="/create-course" className="nav-link text-white d-flex align-items-center">
            <FaPlusCircle className="me-2" />
            {isSidebarOpen && 'Create a Course'}
          </a>
        </li>
        <li className="nav-item mb-3">
          <a href="/earnings" className="nav-link text-white d-flex align-items-center">
            <FaDollarSign className="me-2" />
            {isSidebarOpen && 'Earnings'}
          </a>
        </li>
        <li className="nav-item mb-3">
          <a href="/enrolled-students" className="nav-link text-white d-flex align-items-center">
            <FaUsers className="me-2" />
            {isSidebarOpen && 'Enrolled Students'}
          </a>
        </li>
      </ul>

      <div
        className={`mt-auto mb-4 px-3 d-flex ${isSidebarOpen ? 'flex-row' : 'flex-column'} align-items-center`}
        style={{
          justifyContent: 'flex-start',
          gap: '10px', // Gives some space between the buttons
        }}
      >
        <a
          href="/profile"
          className="btn btn-outline-light d-flex align-items-center w-100"
          style={{
            height: '40px', // Set a consistent height for buttons
            justifyContent: 'flex-start',
            overflow: 'hidden', // Prevents overflow
          }}
        >
          {isSidebarOpen ? (
            <>
              <FaUser className="me-2" />
              Profile
            </>
          ) : (
            <FaUser />
          )}
        </a>

        <button
          className="btn btn-outline-light d-flex align-items-center w-100"
          onClick={onLogout}
          style={{
            height: '40px', // Ensure consistent height for both buttons
            justifyContent: 'flex-start',
            overflow: 'hidden', // Prevents overflow
          }}
        >
          {isSidebarOpen ? (
            <>
              <FaSignOutAlt className="me-2" />
              Logout
            </>
          ) : (
            <FaSignOutAlt />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

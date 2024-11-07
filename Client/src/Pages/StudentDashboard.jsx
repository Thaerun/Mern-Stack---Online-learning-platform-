import React, { useState } from 'react';
import HeaderStudent from '../Components/HeaderStudent';

const StudentDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('allCourses');

  const renderContent = () => {
    switch (activeTab) {
      case 'allCourses':
        return <div>All Courses Content</div>;
      case 'myCourses':
        return <div>My Courses Content</div>;
      case 'forums':
        return <div>Discussion Forums Content</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <HeaderStudent onLogout={onLogout} />

      {/* Navigation Tabs */}
      <div className="container mt-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'allCourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('allCourses')}
            >
              All Courses
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'myCourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('myCourses')}
            >
              My Courses
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'forums' ? 'active' : ''}`}
              onClick={() => setActiveTab('forums')}
            >
              Discussion Forums
            </button>
          </li>
        </ul>

        {/* Content based on selected tab */}
        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;

// TeacherGuidelines.js
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function TeacherGuidelines() {
  const guidelines = [
    "Create engaging and informative content to keep students motivated.",
    "Set clear learning objectives at the beginning of each course.",
    "Upload high-quality resources like videos, PDFs, and quizzes to enhance learning.",
    "Monitor student progress regularly and provide constructive feedback.",
    "Engage with students through comments, discussions, and live sessions.",
    "Ensure course materials are well-organized and easy to navigate.",
    "Use assessments and quizzes to evaluate student understanding periodically."
  ];

  return (
    <div>
      <Header />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Teacher Guidelines</h2>
        <div className="card p-4 shadow-lg" style={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <h4 className="text-center mb-4">Guidelines for Teaching on Learn Hub</h4>
          <ul className="list-group list-group-flush ">
            {guidelines.map((guideline, index) => (
              <li key={index} className="list-group-item">
                <span className="fw-bold">{index + 1}:</span> {guideline}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TeacherGuidelines;

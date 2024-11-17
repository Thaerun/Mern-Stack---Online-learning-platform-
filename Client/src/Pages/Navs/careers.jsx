// Careers.js
import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

function Careers() {
  const positions = [
    {
      title: "Frontend Developer Internship",
      location: "Remote",
      description: "Work with our team to create beautiful and responsive interfaces using HTML, CSS, and JavaScript frameworks.",
      skills: "HTML, CSS, JavaScript, React",
    },
    {
      title: "Python Developer Internship",
      location: "Remote",
      description: "Collaborate on backend services and data processing tasks with Python, contributing to efficient and scalable solutions.",
      skills: "Python, Django, REST APIs, Data Processing",
    },
    {
      title: "MERN Stack Developer Internship",
      location: "Remote",
      description: "Join us to develop full-stack applications using MongoDB, Express, React, and Node.js for end-to-end functionality.",
      skills: "MongoDB, Express, React, Node.js",
    }
  ];

  return (
    <div>
      <Header />

      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Careers at Learn Hub</h2>
        <p className="text-center mb-4">Join our team and help build the future of online learning. Explore exciting internship opportunities and apply today!</p>

        <div className="row">
          {positions.map((position, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100 shadow" style={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                <div className="card-body">
                  <h5 className="card-title">{position.title}</h5>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Location: {position.location}
                  </p>
                  <p className="card-text">{position.description}</p>
                  <p><strong>Skills:</strong> {position.skills}</p>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-primary w-100" style={{ borderRadius: '5px' }}>Apply Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Careers;

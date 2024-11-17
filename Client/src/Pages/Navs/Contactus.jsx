// ContactUs.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/contact', formData);
    alert('Query submitted successfully');
  };

  return (
    <div>
      <Header />
      <div className="container d-flex justify-content-center" style={{ marginTop: '50px', marginBottom: '60px' }}>
        <div className="card shadow" style={{width: '40%', padding: '20px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
          <h2 className="mb-4 text-center">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Query</label>
              <textarea
                name="query"
                className="form-control"
                rows="4"
                value={formData.query}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;

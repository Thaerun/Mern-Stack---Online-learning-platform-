// src/pages/Payment.js

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, courseName, price } = location.state || {};

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // After successful "payment," update purchasedCourses in the user's collection
        const email = localStorage.getItem('userEmail'); // Assume user email is stored in localStorage

        await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/addCourse`, {
          email,
          courseId
        });

        // Redirect to dashboard after successful payment
        navigate('/dashboard');
      } catch (error) {
        console.error("Error during payment processing:", error);
      }
    };

    processPayment();
  }, [courseId, navigate]);

  if (!courseId || !courseName || price === undefined) {
    return <div>Invalid course information.</div>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Processing payment for:</h2>
      <p>Course: <strong>{courseName}</strong></p>
      <p>Price: {price > 0 ? `₹${price.toFixed(2)}` : 'Free'}</p>
      <p>Please wait, this may take a few seconds...</p>
    </div>
  );
};

export default Payment;

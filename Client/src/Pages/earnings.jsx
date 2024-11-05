import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; // Import necessary elements

const Earnings = ( {onLogout} ) => {
  const [chartData, setChartData] = useState({});

  // Sample earnings data for display
  const earningsData = [
    { id: 1, title: 'React for Beginners', earnings: 250 },
    { id: 2, title: 'Advanced JavaScript', earnings: 150 },
    { id: 3, title: 'Integral Calculus', earnings: 300 },
    { id: 4, title: 'Number Theory', earnings: 200 },
  ];

  useEffect(() => {
    // Register necessary components for Chart.js
    Chart.register(ArcElement, Tooltip, Legend);
    
    // Prepare data for the pie chart
    const data = {
      labels: earningsData.map(course => course.title),
      datasets: [
        {
          data: earningsData.map(course => course.earnings),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
          ],
        },
      ],
    };

    // Update the chart data state
    setChartData(data);
  }, []); // Run only on mount

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-primary text-white p-4" style={{ width: '250px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <h2 className="text-center mb-4">Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <a href="/instructor-dashboard" className="nav-link text-white">
              My Courses
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="/create-course" className="nav-link text-white">
              Create a Course
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="/earnings" className="nav-link text-white">
              Earnings
            </a>
          </li>
        </ul>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5" style={{ marginLeft: '250px' }}>
        <h2 className="text-primary mb-4">Earnings Overview</h2>
        <div className="table-responsive" style={{ maxWidth: '600px' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Earnings ($)</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>${course.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pie Chart */}
        <div className="mt-5">
          <h3 className="text-primary mb-4">Earnings Distribution</h3>
          {chartData.labels ? (  // Check if chartData is populated
            <div style={{ width: '600px', height: '600px' }}> {/* Set the desired width and height */}
              <Pie data={chartData} />
            </div>
          ) : (
            <p>Loading chart...</p> // Fallback UI
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;

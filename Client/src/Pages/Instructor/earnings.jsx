import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Sidebar from '../../Components/SideBar';

const Earnings = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartData, setChartData] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Sample earnings data for display
  const earningsData = [
    { id: 1, title: 'React for Beginners', earnings: 250 },
    { id: 2, title: 'Advanced JavaScript', earnings: 150 },
    { id: 3, title: 'Integral Calculus', earnings: 300 },
    { id: 4, title: 'Number Theory', earnings: 200 },
  ];

  useEffect(() => {
    Chart.register(ArcElement, Tooltip, Legend);
    
    const data = {
      labels: earningsData.map(course => course.title),
      datasets: [
        {
          data: earningsData.map(course => course.earnings),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    };

    setChartData(data);
  }, []);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      else{
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className="flex-grow-1 p-5"
        style={{
          marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust dynamically based on sidebar width
          transition: 'margin-left 0.3s',
        }}
      >
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

        <div className="mt-5">
          <h3 className="text-primary mb-4">Earnings Distribution</h3>
          {chartData.labels ? (
            <div style={{ width: '600px', height: '600px' }}>
              <Pie data={chartData} />
            </div>
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;

import React, { useState, useEffect, useRef } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import UserProfileCard from '../components/UserProfileCard';
import { fetchStats } from '../apicalls/adminapi';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  });
  const [monthStats, setMonthStats] = useState([]);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchedAt = useRef(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchStats();

      if (!data) {
        throw new Error('No data received from server');
      }

      // Save to localStorage
      localStorage.setItem("adminStatusStats", JSON.stringify(data.statusStats));
      localStorage.setItem("adminMonthWiseStats", JSON.stringify(data.monthWiseStats));
      localStorage.setItem("adminFetchedAt", Date.now().toString());

      setStats({
        pending: data.statusStats?.pending || 0,
        in_progress: data.statusStats?.in_progress || 0,
        resolved: data.statusStats?.resolved || 0,
        rejected: data.statusStats?.rejected || 0
      });

      setMonthStats(data.monthWiseStats || []);
      lastFetchedAt.current = Date.now();

    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const now = Date.now();
  const cachedTime = localStorage.getItem("adminFetchedAt");

  if (cachedTime && now - parseInt(cachedTime, 10) < 5 * 60 * 1000) {
    // Load from localStorage
    const cachedStatus = JSON.parse(localStorage.getItem("adminStatusStats"));
    const cachedMonth = JSON.parse(localStorage.getItem("adminMonthWiseStats"));

    if (cachedStatus) {
      setStats({
        pending: cachedStatus?.pending || 0,
        in_progress: cachedStatus?.in_progress || 0,
        resolved: cachedStatus?.resolved || 0,
        rejected: cachedStatus?.rejected || 0
      });
    }

    if (cachedMonth) {
      setMonthStats(cachedMonth);
    }

    setLoading(false);
  } else {
    fetchData();
  }

  const interval = setInterval(fetchData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);

  const solvedData = {
    labels: ['Pending', 'In-Progress', 'Resolved', 'Rejected'],
    datasets: [{
      data: [
        stats.pending,
        stats.in_progress,
        stats.resolved,
        stats.rejected,
      ],
      backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
      hoverOffset: 4
    }]
  };

  const monthlyCounts = Array(12).fill(0);
  monthStats.forEach((entry) => {
    if (entry?.month) {
      const [year, month] = entry.month.split('-');
      const monthIndex = parseInt(month, 10) - 1;
      if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
        monthlyCounts[monthIndex] = Number(entry.total) || 0;
      }
    }
  });

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Complaints Submitted',
      data: monthlyCounts,
      backgroundColor: '#3B82F6',
      borderRadius: 4
    }]
  };
  const currentMonth = new Date().getMonth(); // 0 for Jan, 11 for Dec
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January case


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-800">Failed to load user data</p>
          <p className="text-gray-600 mt-1">Please refresh the page or check your connection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <UserProfileCard user={user} />

          <div className="w-full lg:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Active Cases */}
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-gray-500 text-sm font-medium">Total Active Cases</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {Number(stats.pending) + Number(stats.in_progress)}
                </p>
                <p className={`text-sm ${Number(monthlyCounts[currentMonth]) - Number(monthlyCounts[lastMonth]) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                  }`}>
                  {Number(monthlyCounts[currentMonth]) - Number(monthlyCounts[lastMonth]) > 0
                    ? `+${Number(monthlyCounts[currentMonth]) - Number(monthlyCounts[lastMonth])} more cases than last month`
                    : Number(monthlyCounts[currentMonth]) - Number(monthlyCounts[lastMonth]) < 0
                      ? `${Math.abs(Number(monthlyCounts[currentMonth]) - Number(monthlyCounts[lastMonth]))} fewer cases than last month`
                      : 'No change from last month'}
                </p>
              </div>

              {/* Pending Cases */}
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-gray-500 text-sm font-medium">Pending Cases</h3>
                <p className="text-2xl font-bold text-gray-800">{Number(stats.pending)}</p>
                <p className="text-yellow-500 text-sm">
                  {Number(stats.pending) > 0 ? 'Needs attention' : 'All clear'}
                </p>
              </div>

              {/* In Progress */}
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-gray-800">{Number(stats.in_progress)}</p>
                <p className="text-blue-500 text-sm">Being worked on</p>
              </div>

              {/* Resolved Cases */}
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-gray-500 text-sm font-medium">Resolved Cases</h3>
                <p className="text-2xl font-bold text-gray-800">{Number(stats.resolved)}</p>
                <p className="text-green-500 text-sm">
                  {Number(stats.resolved) > 0
                    ? `+${Math.round(
                      (Number(stats.resolved) /
                        (Number(stats.pending) +
                          Number(stats.in_progress) +
                          Number(stats.resolved) +
                          Number(stats.rejected))) * 100
                    )}% success`
                    : 'No resolved cases yet'}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
              <div className="h-64">
                <Bar
                  data={activityData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Status Distribution</h3>
                <div className="h-48">
                  <Doughnut
                    data={solvedData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                  <li className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case #{Math.floor(Math.random() * 5000)} resolved</p>
                      <p className="text-xs text-gray-500">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </li>
                  <li className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New case submitted</p>
                      <p className="text-xs text-gray-500">Yesterday at {new Date(Date.now() - 86400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </li>
                  <li className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case updated by officer</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
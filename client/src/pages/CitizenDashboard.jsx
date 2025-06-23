import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ProfileCard from '../components/ProfileCard';
import { getComplaint } from '../apicalls/citizenapi';
import { getToken, getUserId } from '../utils/utils';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import UserProfileCard from '../components/UserProfileCard';


const CitizenDashboard = () => {

  const dispatch = useDispatch();
  const complaints = useSelector(state => state.complaints.complaints);
  const user = useSelector(state => state.user.user);
  const loadedAt = useSelector(state => state.complaints.loadedAt);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const shouldFetch = !loadedAt || now - loadedAt > 5 * 60 * 1000;

    const fetchData = async () => {
      if (shouldFetch) {
        await getComplaint(dispatch);
      } else {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      getComplaint(dispatch);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, loadedAt]);



  const solvedCount = complaints.filter(c => c.status === 'resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const progressCount = complaints.filter(c => c.status === 'in-progress').length;
  const rejectedCount = complaints.filter(c => c.status === 'rejected').length;

  const solvedData = {
    labels: ['Resolved', 'Pending', 'In-Progress', 'Rejected'],
    datasets: [{
      data: [solvedCount, pendingCount, progressCount, rejectedCount],
      backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'], // green, yellow, blue, red
    }]
  };
  const monthlyCounts = Array(12).fill(0);
  complaints.forEach(c => {
    const date = new Date(c.created_at);
    const month = date.getMonth();
    monthlyCounts[month]++;
  });

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Complaints Submitted',
      data: monthlyCounts,
      backgroundColor: '#3B82F6',
    }]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p>Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-3">
      {showProfile && (
        <ProfileCard
          onClose={() => setShowProfile(!showProfile)}
          user={user}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <UserProfileCard
            setShowProfile={setShowProfile}
          />


          {/* Right Column - Stats (2/3) */}
          {/* Right Column - Stats (2/3) */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Active Complaint */}
              <div className="bg-yellow-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-yellow-600 text-sm font-medium">Active Complaints</h3>
                <p className="text-2xl font-bold text-yellow-800">{progressCount + pendingCount}</p>
              </div>

              {/* Active Cases (In Progress) */}
              <div className="bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-blue-600 text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-blue-800">{progressCount}</p>
              </div>

              {/* Resolved */}
              <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-green-600 text-sm font-medium">Resolved</h3>
                <p className="text-2xl font-bold text-green-800">{solvedCount}</p>
              </div>

              {/* Rejected */}
              <div className="bg-red-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-red-600 text-sm font-medium">Rejected</h3>
                <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
              </div>
            </div>


            {/* Charts Section */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
              <div className="h-64">
                <Bar
                  data={activityData}
                  options={{
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Status</h3>
                <div className="h-48">
                  <Doughnut
                    data={solvedData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case #2456 resolved</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New case submitted</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-yellow-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case #2451 requires attention</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CitizenDashboard;
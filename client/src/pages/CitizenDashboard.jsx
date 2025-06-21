import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ProfileCard from '../components/ProfileCard';
import { fetchUserDetails } from '../apicalls/citizenapi/api';
import { getToken, getUserId } from '../utils/utils';
import { toast } from 'react-toastify';

const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.error("User not logged in or token is invalid.");
          setLoading(false);
          return;
        }

        const result = await fetchUserDetails(token);
        if (result.success) {
          setUser(result.result);
        } else {
          toast.error(result.result || "Failed to load user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  // Sample data for charts
  const solvedData = {
    labels: ['Solved', 'Pending', 'Rejected'],
    datasets: [{
      data: [65, 15, 20],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
    }]
  };

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Problems Solved',
      data: [12, 19, 8, 15, 12, 17],
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {showProfile && (
        <ProfileCard
          onClose={() => setShowProfile(!showProfile)}
          user={user}
          setUser={setUser}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Profile (1/3) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="bg-indigo-600 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  <img
                    src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/no-profile-pic.png";
                    }}
                  />
                </div>
                <h2 className="text-xl font-semibold text-white mt-4">
                  {user?.name || "Citizen"}
                </h2>
                <p className="text-indigo-200 capitalize">{user?.role || "User"}</p>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-800">{user?.email || "Not available"}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="text-gray-800">{user?.phone_number || "Not available"}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-gray-800">
                    {user?.town || "City"}, {user?.district || "District"}, {user?.state || "State"}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="text-gray-800">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                {user?.verification_status === 'unverified' && (
                  <h2 className="font-medium text-red-500">Kindly verify your profile</h2>
                )}
                {user?.verification_status === 'pending' && (
                  <h2 className="font-medium text-blue-400 border border-green-600 rounded-sm p-3">
                    Your profile is currently under review. <br />
                    We’ll notify you once the verification process is complete.
                  </h2>
                )}


                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {user?.verification_status === 'unverified' ? 'Upload details for verification' : 'View profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Stats (2/3) */}
          {/* Right Column - Stats (2/3) */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-gray-500 text-sm font-medium">Problems Solved</h3>
                <p className="text-2xl font-bold text-gray-800">142</p>
                <p className="text-green-500 text-sm">+12% from last month</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-gray-500 text-sm font-medium">Active Cases</h3>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-yellow-500 text-sm">3 new today</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-gray-500 text-sm font-medium">Satisfaction</h3>
                <p className="text-2xl font-bold text-gray-800">92%</p>
                <p className="text-green-500 text-sm">Excellent</p>
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
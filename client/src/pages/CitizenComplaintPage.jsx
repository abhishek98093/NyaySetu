import React, { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { Button } from "@mui/material";
import CreateComplaint from '../components/CreateComplaint';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getComplaint } from '../apicalls/citizenapi';

const CitizenComplaintPage = () => {
  const user = useSelector(state => state.user.user);
  const {
    data: complaintList=[],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['complaints', user?.user_id],
    queryFn: () => getComplaint(dispatch), // 🔑 fetch function
    staleTime: 5 * 60 * 1000, // ✅ data remains fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // ✅ unused data stays in cache for 30 minutes
    refetchOnWindowFocus: false, // ✅ disable auto refetch on tab focus
    refetchOnReconnect: false,   // ✅ disable on reconnect
    refetchInterval: 5 * 60 * 1000, // ✅ auto refetch every 5 minutes
    retry: (failureCount, error) => {
      const isNetworkError = !error.response;
      const isServerError = error.response?.status >= 500;
      return (isNetworkError || isServerError) && failureCount < 2; // ✅ max 2 retries for network/server errors
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // ✅ exponential backoff capped at 5s
    onError: (error) => {
      toast.error(error.message || "Failed to load complaints");
      queryClient.invalidateQueries(['complaints', user?.user_id]);
    }
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComplaint, setNewComplaint] = useState(false);

  const handleClick = () => {
    setNewComplaint(!newComplaint);
  };

  const onClose = () => {
    setNewComplaint(!newComplaint);
  };
  



  const filteredComplaints = complaintList.filter(complaint => {
    const normalizedStatus = complaint.status.toLowerCase().replace('-', ' ');
    const normalizedTab = activeTab.toLowerCase().replace('-', ' ');
    
    const matchesTab = activeTab === 'all' || normalizedStatus === normalizedTab;
    const matchesSearch = complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Status counts for filter tabs - using normalized statuses
  const statusCounts = complaintList.reduce((acc, complaint) => {
    const normalizedStatus = complaint.status.toLowerCase().replace('-', ' ');
    acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, { all: 0 });

  // Map between display tabs and actual status values
  const statusMap = {
    'Pending': 'pending',
    'In Progress': 'in progress',
    'Resolved': 'resolved',
    'Rejected': 'rejected'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {newComplaint && (
        <CreateComplaint
          onClose={onClose}
        />
      )}

      <header className="bg-white shadow-sm">
        <div className="w-full bg-white shadow-lg rounded-b-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6"> {/* Reduced padding here */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          {/* Main heading for the page */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
            My Complaints
          </h1>
          {/* Button for filing a new complaint */}
          <button
            onClick={handleClick}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 flex items-center justify-center space-x-2"
          >
            {/* Plus icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>File New Complaint</span>
          </button>
        </div>
      </div>
    </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2">
                {['all', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map((tab) => {
                  const countKey = tab === 'all' ? 'all' : statusMap[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 md:px-4 md:py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      {tab} {tab !== 'all' && statusCounts[countKey] ? `(${statusCounts[countKey]})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? "No matching complaints" : "No complaints found"}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filter criteria"
                  : activeTab === 'all'
                    ? "You haven't filed any complaints yet"
                    : `You have no ${activeTab.toLowerCase()} complaints`}
              </p>
              <button
                onClick={handleClick}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                File New Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const complaintKey = complaint.complaint_id
                  ? `complaint-${complaint.complaint_id}`
                  : `temp-${Math.random().toString(36).substr(2, 9)}`;

                return (
                  <ComplaintCard
                    key={complaintKey}
                    complaint={{
                      ...complaint,
                      // Ensure status is properly formatted for the card component
                      status: complaint.status.toLowerCase()
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <div style={{
        position: 'fixed',
        right: '30px',
        bottom: '30px',
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          startIcon={<AddCommentIcon sx={{ fontSize: 32 }} />}
          onClick={handleClick}
          sx={{
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '28px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            textTransform: 'none',
            minWidth: '220px'
          }}
        >
          File New Complaint
        </Button>
      </div>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Complaint Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CitizenComplaintPage;
import React, { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';

const CitizenComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchComplaints = () => {
      setLoading(true);
      
      // Dummy data with rejected complaint example
      const dummyComplaints = [
        {
          id: 1001,
          title: 'Noise Complaint',
          description: 'Loud music playing after midnight from neighbor',
          status: 'Pending',
          date: '2023-07-15',
          category: 'Noise'
        },
        {
          id: 1002,
          title: 'Parking Violation',
          description: 'Vehicle parked in disabled spot without permit',
          status: 'Resolved',
          date: '2023-07-10',
          category: 'Parking'
        },
        {
          id: 1003,
          title: 'Unapproved Construction',
          description: 'Neighbor building structure without permit',
          status: 'Rejected',
          date: '2023-07-05',
          category: 'Construction',
          rejectionReason: 'Not under jurisdiction'
        }
      ];
      // const dummyComplaints = []; // Uncomment to test empty state

      setTimeout(() => {
        setComplaints(dummyComplaints);
        setLoading(false);
      }, 800);
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesTab = activeTab === 'all' || complaint.status === activeTab;
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Status counts for filter tabs
  const statusCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    acc.all++;
    return acc;
  }, { all: 0 });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Complaints</h1>
            <button className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors">
              + File New Complaint
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filter/Search Bar */}
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
                {['all', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 md:px-4 md:py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {tab} {tab !== 'all' && statusCounts[tab] ? `(${statusCounts[tab]})` : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complaint List */}
          {loading ? (
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
              <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                File New Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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
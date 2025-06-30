import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getPoliceComplaints } from '../apicalls/policeapi';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import ComplaintCard from '../components/ComplaintCard'; 
import InspectorAssignOfficer from '../components/InspectorAssignOfficer';

const InspectorComplaintPage = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [subInspectorList, setSubInspectorList] = useState([]); // Keep this for Inspector role
  const user = useSelector(state => state.user.user);

  const { data, isPending, isError, error } = useQuery({
  queryKey: ['stationComplaints', user?.user_id],
  queryFn: () => getPoliceComplaints(),
  onSuccess: (data) => {
    toast.success('Data fetched successfully');
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || err.message || "Error fetching data");
  },
  cacheTime: 5 * 60 * 1000,     // 5 minutes
  staleTime: 5 * 60 * 1000,     // 5 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchInterval: false,
  retry: 3,  // ✅ Retry only up to 3 times on failure
});
 useEffect(() => {
    if (data?.complaints) {
    setComplaintList(data.complaints);
    }
    if(data?.subInspectors){
        setSubInspectorList(data?.subInspectors);
    }
  }, [data]);
  

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaintList.filter(complaint => {
    const normalizedStatus = (complaint.status || '').toLowerCase().replace('-', ' ');
    const normalizedTab = activeTab.toLowerCase().replace('-', ' ');

    const matchesTab = activeTab === 'all' || normalizedStatus === normalizedTab;
    const matchesSearch = 
      (complaint.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const statusCounts = complaintList.reduce((acc, complaint) => {
    const normalizedStatus = (complaint.status || '').toLowerCase().replace('-', ' ');
    if (['pending', 'in progress', 'resolved', 'rejected'].includes(normalizedStatus)) {
        acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
    }
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, { 
      all: 0, 
      'pending': 0, 
      'in progress': 0, 
      'resolved': 0, 
      'rejected': 0 
  });

  const statusMap = {
    'Pending': 'pending',
    'In Progress': 'in progress',
    'Resolved': 'resolved',
    'Rejected': 'rejected'
  };

  if (isPending) return <LoadingPage status={'load'} message={'Getting complaints from backend, please wait'} />;
  if (isError) return <ErrorPage />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Station Complaints</h1>
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
                      {tab} {statusCounts[countKey] !== undefined ? `(${statusCounts[countKey]})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
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
                    ? "No complaints registered yet."
                    : `No ${activeTab.toLowerCase()} complaints.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredComplaints.map((complaint) => {
                const complaintKey = complaint.complaint_id
                  ? `complaint-${complaint.complaint_id}`
                  : `temp-${Math.random().toString(36).substr(2, 9)}`;

                return (
                  <ComplaintCard
                    key={complaintKey}
                    complaint={{
                      ...complaint,
                      status: (complaint.status || '').toLowerCase()
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* This section would display Sub-Inspector performance if needed on this page */}
          {/*
          {subInspectorList.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sub-Inspector Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subInspectorList.map(si => (
                  <div key={si.user_id} className="border p-4 rounded-md shadow-sm">
                    <p className="font-semibold">{si.name} (Badge: {si.badge_number})</p>
                    <p className="text-sm text-gray-600">Pending: {si.complaintCounts.pending}</p>
                    <p className="text-sm text-gray-600">In Progress: {si.complaintCounts['in-progress']}</p>
                    <p className="text-sm text-gray-600">Resolved: {si.complaintCounts.resolved}</p>
                    <p className="text-sm text-gray-600">Rejected: {si.complaintCounts.rejected}</p>
                    <p className="text-sm text-gray-800 font-bold">Total: {si.complaintCounts.total}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          */}
        </div>
      </main>

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

export default InspectorComplaintPage;
import React, { useState, useEffect } from 'react';
import { Search, Building, Badge, ChevronRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchComplaintsByBadge, fetchComplaintsByPincode } from '../apicalls/adminapi';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import { toast } from 'react-toastify';
import ComplaintCard from '../components/ComplaintCard'; 
const StatusBadge = ({ status }) => {
  const baseStyle = 'px-3 py-1 text-xs font-semibold rounded-full text-white capitalize';
  const statusStyles = {
    pending: 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    resolved: 'bg-green-500',
    rejected: 'bg-red-500',
  };
  const normalizedStatus = status?.toLowerCase();
  return (
    <span className={`${baseStyle} ${statusStyles[normalizedStatus] || 'bg-gray-400'}`}>
      {status}
    </span>
  );
};

const AdminPerformanceAnalyser = () => {
  const user = useSelector((state) => state.user.user);
  const [searchType, setSearchType] = useState('badge');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCases, setFilteredCases] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const {
    mutate: searchByBadge,
    isPending: badgeLoading,
  } = useMutation({
    mutationFn: ({ badgeNumber }) => fetchComplaintsByBadge({ badgeNumber }),
    onSuccess: (data) => {
      setFilteredCases(data.complaints || []);
      toast.success(data.message);
      setError(null);
    },
    onError: (err) => {
  const message = err?.response?.data?.message || 'Error fetching complaints';
  toast.error(message);
  setError(message); // Now set the error
  setFilteredCases([]);
},
  });

  const {
    mutate: searchByStation,
    isPending: stationLoading,
  } = useMutation({
    mutationFn: ({ pincode }) => fetchComplaintsByPincode({ pincode }),
    onSuccess: (data) => {
      setFilteredCases(data.complaints || []);
      toast.success(data.message);
      setError(null);
    },
    onError: (err) => {
  const message = err?.response?.data?.message || 'Error fetching complaints';
  toast.error(message);
  setError(message); // Now set the error
  setFilteredCases([]);
},
  });

 const handleSearch = (e) => {
  e.preventDefault();
  const trimmed = searchTerm.trim();

  if (!trimmed) return;

  setSearching(true);

  if (searchType === 'badge') {
    searchByBadge({ badgeNumber: trimmed });
  } else {
    // Validate pincode
    if (!/^\d{6}$/.test(trimmed)) {
      toast.error('Invalid pincode. Must be a 6-digit number.');
      setSearching(false);
      return;
    }

    searchByStation({ pincode: trimmed });
  }
};


  const handleReset = () => {
    setSearchTerm('');
    setFilteredCases([]);
    setError(null);
  };

  if (badgeLoading || stationLoading) {
    return <LoadingPage status="load" message="Loading data..." />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Performance Analyser</h1>
          <p className="text-slate-500 mt-2 text-lg">Analyse officer and station case performance.</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-shrink-0 w-full md:w-auto">
              <span className="text-sm font-semibold text-slate-600 mb-2 block">Search By:</span>
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setSearchType('badge')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${searchType === 'badge' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Badge size={16} /> Badge
                </button>
                <button
                  onClick={() => setSearchType('station')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${searchType === 'station' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Building size={16} /> Station
                </button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex-grow w-full flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Enter ${searchType === 'badge' ? 'Badge Number' : 'Station code'}...`}
                  className="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <Search size={18} /> Search
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-700">
              Case Results{' '}
              <span className="text-base font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                {filteredCases.length} found
              </span>
            </h2>
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              Reset Search
            </button>
          </div>

        {filteredCases.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredCases.map((complaint) => {
      const complaintKey = complaint.complaint_id
        ? `complaint-${complaint.complaint_id}`
        : `temp-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <ComplaintCard
          key={complaintKey}
          complaint={{
            ...complaint,
            status: (complaint.status || '').toLowerCase(),
          }}
        />
      );
    })}
  </div>
) : (
  <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md border border-slate-100">
    <Search size={48} className="mx-auto text-slate-300 mb-4" />
    <h3 className="text-xl font-semibold text-slate-700">No Cases Found</h3>
    <p className="text-slate-500 mt-2">
      Input record "{searchTerm}" and press Search.
      <br />
      Try a different search term or reset the search.
    </p>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default AdminPerformanceAnalyser;

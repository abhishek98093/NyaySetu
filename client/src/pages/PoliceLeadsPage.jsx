import React, { useState, useEffect } from 'react';
import PoliceLeadsCard from '../components/PoliceLeadsCard';
import { leadTitles } from '../safe/safe';
import { useQuery } from '@tanstack/react-query';
import { getFilteredLeads } from '../apicalls/policeapi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

const PoliceLeadsPage = () => {
  const [filters, setFilters] = useState({
    title: '',
    startDate: '',
    endDate: '',
    town: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [leads, setLeads] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');
  const user = useSelector(state => state.user.user);

  const { data, isFetching, isError, refetch, error } = useQuery({
    queryKey: ['leadsData', user?.user_id, filters],
    queryFn: () => getFilteredLeads({ data: filters }),
    enabled: false, // disabled by default
    retry: 3,
    cacheTime: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  // Update leads whenever data changes and is successful
  useEffect(() => {
    if (data?.leads) {
      console.log("Fetched data:", data);
      setLeads(data.leads);
      toast.success(`${data.leads.length} leads found successfully`);
      // Auto-collapse filters after successful fetch
      setShowFilters(false);
    }
  }, [data]);

  // Handle error state
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Error fetching data');
    }
  }, [isError, error]);

  // Sort leads
  const sortedLeads = [...leads].sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.incident_datetime) - new Date(a.incident_datetime);
      case 'date_asc':
        return new Date(a.incident_datetime) - new Date(b.incident_datetime);
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }

    try {
      await refetch();
    } catch (error) {
      console.error('Error during fetch:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      startDate: '',
      endDate: '',
      town: '',
      district: '',
      state: '',
      pincode: '',
      country: 'India',
    });
    setLeads([]); // Clear leads data
    toast.info('Filters cleared');
  };

  if (isFetching) {
    return <LoadingPage message="Fetching filtered data, it may take some time..." status="load" />;
  }

  if (isError) {
    return <ErrorPage message="Error fetching filtered data, please try again after some time." />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 text-blue-900">
      {/* Header */}
      <div className="w-full mb-4 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-blue-900">
          Find Leads for Your Case
        </h1>
        <p className="text-gray-600 text-center text-sm sm:text-base">
          Apply filters to narrow down reported leads
        </p>
      </div>

      {/* Filters Section */}
      <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white p-3 rounded-lg flex justify-between items-center transition-colors duration-200"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Apply Filter'}
            </span>
            <span className="text-lg ml-2">{showFilters ? '▲' : '▼'}</span>
          </button>
          
          <button
            onClick={handleClearFilters}
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">Title:</label>
                <select
                  name="title"
                  value={filters.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Titles</option>
                  {leadTitles.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">Start Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">End Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">Town:</label>
                <input 
                  type="text" 
                  name="town" 
                  value={filters.town} 
                  onChange={handleChange} 
                  placeholder="Enter town name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">District:</label>
                <input 
                  type="text" 
                  name="district" 
                  value={filters.district} 
                  onChange={handleChange} 
                  placeholder="Enter district name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">State:</label>
                <input 
                  type="text" 
                  name="state" 
                  value={filters.state} 
                  onChange={handleChange} 
                  placeholder="Enter state name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">Pincode:</label>
                <input 
                  type="text" 
                  name="pincode" 
                  value={filters.pincode} 
                  onChange={handleChange} 
                  placeholder="Enter pincode"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-bold text-sm text-gray-700 mb-1">Country:</label>
                <input 
                  type="text" 
                  name="country" 
                  value={filters.country} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly 
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <button 
                type="submit" 
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full">
        {leads.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-red-600 text-lg font-semibold mb-2">No leads found matching your criteria</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            {/* Sort and Results Count */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-gray-600">
                  Found <strong className="text-blue-900">{leads.length}</strong> leads
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                </select>
              </div>
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

              {sortedLeads.map(lead => (
                <PoliceLeadsCard key={lead.id} lead={lead} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PoliceLeadsPage;
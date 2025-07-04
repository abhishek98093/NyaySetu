import React, { useState, useEffect } from 'react';
import CriminalForm from '../components/CriminalForm';
import MissingPersonForm from '../components/MissingPersonForm';
import CriminalCard from '../components/CriminalCard';
import MissingPersonCard from '../components/MissingPersonCard';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getAllMissingAndCriminals } from '../apicalls/policeapi';
import { toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const PoliceListingPage = () => {
  const user = useSelector(state => state.user.user);
  const [dataType, setDataType] = useState('criminal'); 
  const [criminalFilterType, setCriminalFilterType] = useState('name');
  const [criminalFilterValue, setCriminalFilterValue] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [criminalData, setCriminalData] = useState([]);
  const [missingData, setMissingData] = useState([]);
  const [missingFilterType, setMissingFilterType] = useState('name');
  const [missingFilterValue, setMissingFilterValue] = useState('');
  const [addCriminal, setAddCriminal] = useState(false);
  const [addMissing, setAddMissing] = useState(false);

  const { data: allMissingData, isPending: allMissingPending, isError: allMissingError, error } = useQuery({
    queryKey: ['allMissingAndCriminals', user?.user_id],
    queryFn: () => getAllMissingAndCriminals(), 
    onSuccess: (data) => {
      console.log("Fetched data:", data);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to fetch data");
    },
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });

  useEffect(() => {
    if (allMissingData?.missing_persons) {
      setMissingData(allMissingData.missing_persons);
    }
    if (allMissingData?.criminals) {
      setCriminalData(allMissingData.criminals);
    }
  }, [allMissingData]);

  useEffect(() => {
    applyFilters();
  }, [dataType, criminalFilterType, criminalFilterValue, missingFilterType, missingFilterValue, criminalData, missingData]);

  const applyFilters = () => {
    let currentFilteredData = [];

    if (dataType === 'criminal' || dataType === 'all') {
      let criminalsToDisplay = criminalData;
      if (criminalFilterValue && dataType === 'criminal') {
        criminalsToDisplay = criminalsToDisplay.filter(c => {
          if (criminalFilterType === 'name') {
            return c.name.toLowerCase().includes(criminalFilterValue.toLowerCase());
          } else if (criminalFilterType === 'pincode') {
            return c.pincode.includes(criminalFilterValue);
          }
          return true;
        });
      }
      currentFilteredData = [...currentFilteredData, ...criminalsToDisplay.map(c => ({ ...c, type: 'criminal' }))];
    }

    if (dataType === 'missing' || dataType === 'all') {
      let missingToDisplay = missingData;
      if (missingFilterValue && dataType === 'missing') {
        missingToDisplay = missingToDisplay.filter(m => {
          if (missingFilterType === 'name') {
            return m.name.toLowerCase().includes(missingFilterValue.toLowerCase());
          } else if (missingFilterType === 'pincode') {
            return m.pincode.includes(missingFilterValue);
          }
          return true;
        });
      }
      currentFilteredData = [...currentFilteredData, ...missingToDisplay.map(m => ({ ...m, type: 'missing' }))];
    }

    setFilteredListings(currentFilteredData);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
    if (e.target.value !== 'criminal') {
      setCriminalFilterValue('');
    }
  };

  const handleCriminalSubmit = (formData) => {
    console.log('Criminal data submitted:', formData);
    toast.success('Criminal data submitted successfully!');
    setAddCriminal(false);
  };

  const handleMissingSubmit = (formData) => {
    console.log('Missing Person data submitted:', formData);
    toast.success('Missing Person data submitted successfully!');
    setAddMissing(false);
  };

  if (allMissingPending) return <LoadingPage status={'load'} message={'list is being fetched from backend, please wait...'}/>;
  if (allMissingError) return <ErrorPage error={error} />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pb-16 sm:pb-20">
      <header className="bg-white shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Public Listing & Data Entry</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!addCriminal && !addMissing && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto flex-shrink-0">
                    <label htmlFor="dataType" className="font-semibold text-gray-700 text-sm sm:text-base">Show:</label>
                    <select
                      id="dataType"
                      value={dataType}
                      onChange={handleDataTypeChange}
                      className="block w-full p-1.5 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="all">All</option>
                      <option value="criminal">Wanted Criminals</option>
                      <option value="missing">Missing Persons</option>
                    </select>
                  </div>

                  {(dataType === 'criminal') && (
                    <>
                      <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto flex-shrink-0">
                        <label htmlFor="criminalFilterType" className="font-semibold text-gray-700 text-sm sm:text-base">Filter Criminals By:</label>
                        <select
                          id="criminalFilterType"
                          value={criminalFilterType}
                          onChange={(e) => setCriminalFilterType(e.target.value)}
                          className="block w-full p-1.5 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        >
                          <option value="name">Name</option>
                          <option value="pincode">Pincode</option>
                        </select>
                      </div>

                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="criminalFilterValue"
                          placeholder={`Search by ${criminalFilterType}...`}
                          value={criminalFilterValue}
                          onChange={(e) => setCriminalFilterValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </>
                  )}
                  {(dataType === 'missing') && (
                    <>
                      <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto flex-shrink-0">
                        <label htmlFor="missingFilterType" className="font-semibold text-gray-700 text-sm sm:text-base">
                          Filter Missing By:
                        </label>
                        <select
                          id="missingFilterType"
                          value={missingFilterType}
                          onChange={(e) => setMissingFilterType(e.target.value)}
                          className="block w-full p-1.5 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        >
                          <option value="name">Name</option>
                          <option value="pincode">Pincode</option>
                        </select>
                      </div>

                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="missingFilterValue"
                          placeholder={`Search by ${missingFilterType}...`}
                          value={missingFilterValue}
                          onChange={(e) => setMissingFilterValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredListings.length > 0 ? (
                  filteredListings.map((item) =>
                    item.type === 'criminal' ? (
                      <CriminalCard key={item.criminal_id} criminal={item} />
                    ) : (
                      <MissingPersonCard key={item.missing_id} missing={item} />
                    )
                  )
                ) : (
                  <div className="col-span-full bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                    <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">No results found</h3>
                    <p className="mt-2 text-gray-500 text-sm sm:text-base">Adjust your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {addCriminal && (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <CriminalForm 
                setAddCriminal={setAddCriminal} 
              />
            </div>
          )}

          {addMissing && (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <MissingPersonForm 
                setAddMissing={setAddMissing}
              />
            </div>
          )}
        </div>
      </main>

      {/* Fixed action buttons at bottom right */}
      {!addCriminal && !addMissing && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-3 z-10">
          <button
            onClick={() => setAddCriminal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-colors duration-200 ease-in-out flex items-center justify-center"
            title="Add Criminal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="sr-only">Add Criminal</span>
          </button>
          <button
            onClick={() => setAddMissing(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-colors duration-200 ease-in-out flex items-center justify-center"
            title="Add Missing Person"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="sr-only">Add Missing Person</span>
          </button>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <p className="text-center text-gray-500 text-sm sm:text-base">
            © {new Date().getFullYear()} Public Listing Page
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PoliceListingPage;
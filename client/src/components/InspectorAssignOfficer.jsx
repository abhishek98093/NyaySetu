import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { assignOfficer, getPoliceComplaints } from '../apicalls/policeapi';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import { useQueryClient } from '@tanstack/react-query';
const AssignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a1 1 0 00-1 1v6H3a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 00-1-1z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const InspectorAssignOfficer = ({ complaint, setAssignOff }) => {
    const queryClient = useQueryClient();
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(true); // Show dropdown initially
  const dropdownRef = useRef(null);
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
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: false,
    retry: 3,
  });

  const subInspectorList = useMemo(() => {
    return data?.subInspectors || [];
  }, [data]);

  const selectedOfficer = useMemo(() => {
    return subInspectorList.find(si => si.police_id === parseInt(selectedOfficerId));
  }, [selectedOfficerId, subInspectorList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOfficer = (officerId) => {
    setSelectedOfficerId(officerId);
    setDropdownOpen(false);
  };

  const assignOfficerMutation = useMutation({
    mutationFn: ({ complaint_id, officer_id }) => assignOfficer({ complaint_id, officer_id }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['stationComplaints', user?.user_id]);
      setAssignOff(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Error assigning officer");
    }
  });

  const handleAssign = () => {
    if (!selectedOfficerId) {
      toast.error("Please select an officer first");
      return;
    }
    assignOfficerMutation.mutate({ 
      complaint_id: complaint?.complaint_id, 
      officer_id: selectedOfficerId 
    });
  };

  const getEfficiency = (officer) => {
    const total = officer.complaintCounts.total || 1;
    const resolved = officer.complaintCounts.resolved || 0;
    const rejected = officer.complaintCounts.rejected || 0;
    return Math.round(((resolved + rejected) / total) * 100);
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-blue-600';
    if (efficiency >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPendingCaseColor = (count) => {
    return count >= 3 ? 'text-red-600 font-bold' : 'text-green-600 font-bold';
  };
  if (isPending || assignOfficerMutation.isPending) {
  return <LoadingPage status="load" message="The status of the complaint is updating..." />;
}

 if (isError) return <ErrorPage error={error} />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assign Officer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complaint #{complaint?.complaint_id || 'C-123'}
            </p>
          </div>
          <button 
            onClick={() => setAssignOff(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Officer Dropdown - Always visible */}
        <div className="relative mb-6" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sub-Inspector
          </label>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
          >
            {selectedOfficer ? (
              <div className="flex items-center gap-3">
                <img 
                  src={selectedOfficer.profile_picture_url} 
                  alt={selectedOfficer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">{selectedOfficer.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">Select an officer</span>
            )}
            <ChevronDownIcon />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
              {subInspectorList.map((si) => {
                const efficiency = getEfficiency(si);
                return (
                  <div
                    key={si.police_id}
                    onClick={() => handleSelectOfficer(si.police_id)}
                    className="cursor-pointer p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                  >
                    <img 
                      src={si.profile_picture_url} 
                      alt={si.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{si.name}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Badge: {si.badge_number}</span>
                        <span className={getPendingCaseColor(si.complaintCounts.total-si.complaintCounts.resolved-si.complaintCounts.rejected)}>
                          {si.complaintCounts.total-si.complaintCounts.resolved-si.complaintCounts.rejected} pending
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Officer Details */}
        {selectedOfficer && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <img 
                src={selectedOfficer.profile_picture_url} 
                alt={selectedOfficer.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-800">{selectedOfficer.name}</h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {selectedOfficer.badge_number}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedOfficer.complaintCounts.pending >= 3 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedOfficer.complaintCounts.total-selectedOfficer.complaintCounts.rejected-selectedOfficer.complaintCounts.resolved} pending
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Clearance rate:</span>
                <span className={`font-bold ${getEfficiencyColor(getEfficiency(selectedOfficer))}`}>
                  {getEfficiency(selectedOfficer)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${getEfficiency(selectedOfficer)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setAssignOff(false)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedOfficerId || assignOfficerMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {assignOfficerMutation.isPending ? (
              'Assigning...'
            ) : (
              <>
                <AssignIcon />
                Assign Officer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectorAssignOfficer;
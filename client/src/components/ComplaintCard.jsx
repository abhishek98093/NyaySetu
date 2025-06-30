import React, { useState } from 'react';
import ViewFullComplaint from './ViewFullComplaint';
import ComplaintDelete from './ComplaintDelete';
import { useSelector } from 'react-redux';
import InspectorAssignOfficer from './InspectorAssignOfficer';
const ComplaintCard = ({ complaint }) => {
  const [viewFull, setViewFull] = useState(false);
  const [newDelete, setDelete] = useState(false);
  const user = useSelector(state => state.user.user);
  const policeDetails = useSelector(state => state.user.policeDetails);
  const [assignOff,setAssignOff]=useState(false);
  const isPolice = Boolean(policeDetails?.rank);
  const isInspector = policeDetails?.rank === 'Inspector';

  const normalizedStatus = complaint.status
    .toLowerCase()
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const statusConfig = {
    'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: '⏳', badge: 'bg-yellow-100 text-yellow-800' },
    'In Progress': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: '🛠️', badge: 'bg-blue-100 text-blue-800' },
    'Resolved': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', icon: '✅', badge: 'bg-green-100 text-green-800' },
    'Rejected': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: '❌', badge: 'bg-red-100 text-red-800' }
  };

  const status = statusConfig[normalizedStatus] || {
    bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', icon: 'ℹ️', badge: 'bg-gray-100 text-gray-800'
  };

 

  const handleViewCaseFile = () => {
    console.log("Open case file for complaint_id:", complaint.complaint_id);
    // Navigate to case file view page
  };

  return (
    <div className={`border rounded-lg overflow-hidden mb-6 ${status.border} ${status.bg} transition-all hover:shadow-lg`}>
      {viewFull && (
        <ViewFullComplaint
          complaint={complaint}
          setViewFull={setViewFull}
        />
      )}
      {newDelete && (
        <ComplaintDelete
          complaint={complaint}
          setDelete={setDelete}
        />
      )}
      {assignOff && (
        <InspectorAssignOfficer
        complaint={complaint}
        setAssignOff={setAssignOff}
        />
      )};

      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badge}`}>
                {complaint.crime_type}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{complaint.description}</p>
          </div>

          <div className="flex flex-col items-end gap-1 min-w-[120px]">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.badge}`}>
              <span>{status.icon}</span>
              {normalizedStatus}
            </span>
            <span className="text-xs text-gray-500">
              Filed: {new Date(complaint.crime_datetime).toLocaleDateString()}
            </span>
          </div>
        </div>

        {(complaint.status === 'in-progress' || complaint.status === 'rejected') && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-r p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Police Remarks</h4>
                <p className="text-sm text-blue-700 mt-1">{complaint.remark}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Complaint ID: #{complaint.complaint_id}</span>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1" onClick={() => setViewFull(!viewFull)}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>

            {isInspector && complaint.status === 'pending' && (
              <button onClick={()=>setAssignOff((prev)=>!prev)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1">
                👮 Assign Officer
              </button>
            )}

            {!isPolice && complaint.status === 'pending' && (
              <button onClick={() => setDelete((prev) => !prev)} className="px-4 py-2 bg-white hover:bg-gray-50 text-red-600 border border-red-300 text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1">
                ❌ Cancel Complaint
              </button>
            )}

            {(complaint.status === 'in-progress' || complaint.status === 'resolved') && (
              <button onClick={handleViewCaseFile} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1">
                📁 View Case File
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;

import React from 'react';

const ComplaintCard = ({ complaint }) => {
  // Status configuration
  const statusConfig = {
    'Pending': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: '⏳',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'In Progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: '🛠️',
      badge: 'bg-blue-100 text-blue-800'
    },
    'Resolved': {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: '✅',
      badge: 'bg-green-100 text-green-800'
    },
    'Rejected': {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: '❌',
      badge: 'bg-red-100 text-red-800'
    }
  };

  const status = statusConfig[complaint.status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: 'ℹ️',
    badge: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className={`border rounded-lg overflow-hidden mb-6 ${status.border} ${status.bg} transition-all hover:shadow-lg`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.badge}`}>
                {complaint.category}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{complaint.description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-1 min-w-[120px]">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.badge}`}>
              <span>{status.icon}</span>
              {complaint.status}
            </span>
            <span className="text-xs text-gray-500">
              Filed: {new Date(complaint.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Police Remarks */}
        {complaint.policeRemarks && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-r p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Police Remarks</h4>
                <p className="text-sm text-blue-700 mt-1">{complaint.policeRemarks}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {complaint.status === 'Rejected' && complaint.rejectionReason && (
          <div className="mt-3 bg-red-50 border-l-4 border-red-400 rounded-r p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Rejection Reason</h4>
                <p className="text-sm text-red-700 mt-1">{complaint.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Complaint ID: #{complaint.id}</span>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            
            {complaint.status === 'Pending' && (
              <button className="px-4 py-2 bg-white hover:bg-gray-50 text-red-600 border border-red-300 text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Complaint
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
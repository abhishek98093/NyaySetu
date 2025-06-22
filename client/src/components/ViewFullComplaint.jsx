import React from 'react';

const ViewFullComplaint = ({ complaint, setViewFull }) => {
  // Handle missing complaint data
  if (!complaint) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-500 text-center">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium">Error</h3>
            <p className="mt-1 text-sm">Complaint data is missing or unavailable.</p>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setViewFull(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Status configuration
  const statusConfig = {
    'pending': {
      displayText: 'Pending',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: '⏳'
    },
    'in-progress': {
      displayText: 'In Progress',
      badge: 'bg-blue-100 text-blue-800',
      icon: '🛠️'
    },
    'resolved': {
      displayText: 'Resolved',
      badge: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    'rejected': {
      displayText: 'Rejected',
      badge: 'bg-red-100 text-red-800',
      icon: '❌'
    }
  };

  const status = statusConfig[complaint.status] || {
    displayText: 'Unknown',
    badge: 'bg-gray-100 text-gray-800',
    icon: 'ℹ️'
  };

  // Format location information
  const formatLocation = () => {
    const parts = [];
    if (complaint.location_address) parts.push(complaint.location_address);
    if (complaint.town) parts.push(complaint.town);
    if (complaint.district) parts.push(complaint.district);
    if (complaint.state) parts.push(complaint.state);
    if (complaint.pincode) parts.push(complaint.pincode);
    if (complaint.country && complaint.country !== 'India') parts.push(complaint.country);
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setViewFull(false)}
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Complaint Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{complaint.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.badge}`}>
                  <span>{status.icon}</span>
                  {status.displayText}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  {complaint.crime_type}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex flex-col items-end mr-10">
              <span>Complaint ID: #{complaint.complaint_id}</span>
              <span>Filed: {new Date(complaint.created_at).toLocaleString()}</span>
              {complaint.updated_at && (
                <span>Last updated: {new Date(complaint.updated_at).toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {complaint.description || 'No description provided'}
                </p>
              </div>

              {/* Incident Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Incident Details</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p className="text-gray-800">{formatLocation() || 'Location not specified'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <p className="text-gray-800">
                        {complaint.crime_datetime 
                          ? new Date(complaint.crime_datetime).toLocaleString() 
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Police Remarks */}
              {complaint.remark && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Police Remarks</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r p-4">
                    <p className="text-blue-800 whitespace-pre-line">{complaint.remark}</p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {Array.isArray(complaint.proof_urls) && complaint.proof_urls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Attachments</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complaint.proof_urls.map((url, index) => (
                      <div key={index} className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                        {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={url} 
                              alt={`Proof ${index + 1}`} 
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxNmw0LjU4Ni00LjU4NmEyIDIgMCAwMTIuODI4IDBMMTYgMTZtLTItMmwxLjU4Ni0xLjU4NmEyIDIgMCAwMTIuODI4IDBMMjAgMTRtLTYtNmguMDFNNiAyMGgxMmEyIDIgMCAwMDItMlY2YTIgMiAwIDAwLTItMkg2YTIgMiAwIDAwLTIgMnYxMmEyIDIgMCAwMDIgMnoiPjwvcGF0aD48L3N2Zz4=';
                              }}
                            />
                            <div className="p-2 text-center text-xs text-gray-600 truncate">
                              Image {index + 1}
                            </div>
                          </a>
                        ) : (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 h-full"
                          >
                            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs mt-2 text-gray-600 text-center truncate w-full px-1">
                              Document {index + 1}
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFullComplaint;
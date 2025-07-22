import React from 'react';
import { crimeFacts } from '../safe/safe';
const LoadingPage = ({ status, message }) => {
  // Array of 20 crime facts about India
  

  // Get a random fact
  const randomFact = crimeFacts[Math.floor(Math.random() * crimeFacts.length)];

  let statusText = "";
  let colorClass = "";
  let spinnerColor = "";

  switch (status) {
    case "load":
      statusText = message || "Loading...";
      colorClass = "text-blue-600";
      spinnerColor = "border-blue-600";
      break;
    case "fetch":
      statusText = message || "Fetching data...";
      colorClass = "text-green-600";
      spinnerColor = "border-green-600";
      break;
    case "delete":
      statusText = message || "Deleting...";
      colorClass = "text-red-600";
      spinnerColor = "border-red-600";
      break;
    default:
      statusText = message || "Processing...";
      colorClass = "text-gray-600";
      spinnerColor = "border-gray-600";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
        <div 
          className={`w-16 h-16 border-8 ${spinnerColor} border-t-transparent rounded-full animate-spin mb-6`}
          style={{ animationDuration: '1s' }}
        />
        <p className={`text-xl font-semibold ${colorClass} mb-6`}>{statusText}</p>
        
        <div className="text-center border-t pt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Did you know?</p>
          <p className="text-gray-700">{randomFact}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
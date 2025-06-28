// Error.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = ({ message = "Something went wrong!" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <AlertTriangle size={64} className="text-red-600" />
      <h2 className="mt-4 text-2xl font-bold text-red-700">Oops!</h2>
      <p className="mt-2 text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default ErrorPage;

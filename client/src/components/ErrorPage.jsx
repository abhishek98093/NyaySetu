import React from 'react';
// Inline SVG for AlertTriangle (no external library needed)
const AlertTriangle = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

/**
 * A generic error page component.
 * Displays an error icon, a heading, and a customizable message.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.message="Something went wrong!"] - The error message to display.
 * If no message is provided, a default message will be shown.
 */
const ErrorPage = ({ message = "Something went wrong!" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full text-center">
        <AlertTriangle size={80} className="text-red-600 mb-6" />
        <h2 className="mt-4 text-3xl font-extrabold text-red-800">Oops! An Error Occurred</h2>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          {message}
        </p>
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

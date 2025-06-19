// import React, { useEffect } from 'react';

// const ICONS = {
//   success: (
//     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   ),
//   error: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path d="M12 9v4m0 4h.01m9.93-7a10 10 0 11-19.86 0 10 10 0 0119.86 0z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   ),
//   warning: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path d="M12 9v2m0 4h.01M10.29 3.86l-7.7 13.33A1.5 1.5 0 003.8 19h16.4a1.5 1.5 0 001.3-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   )
// };

// const AlertBox = ({ type, title, description, onClose }) => {
//   const borderColor = {
//     success: 'border-green-400',
//     error: 'border-red-400',
//     warning: 'border-yellow-400'
//   }[type];

//   useEffect(() => {
//     if (!onClose) return; // Don't set timer if no onClose provided
    
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`bg-white inline-flex space-x-3 p-3 text-sm rounded border ${borderColor} shadow-md max-w-md`}>
//       <div>{ICONS[type]}</div>
//       <div>
//         <h3 className="text-gray-700 font-medium">{title}</h3>
//         {description && <p className="text-gray-500">{description}</p>}
//       </div>
//     </div>
//   );
// };

// export default AlertBox;
import { useEffect } from "react";

const ICONS = {
  success: <span>✅</span>,
  error: <span>❌</span>,
  warning: <span>⚠️</span>,
};

const AlertBox = ({ type = "success", title, description, onClose }) => {
  useEffect(() => {
    if (!onClose) return; // Only set timer if onClose exists
    
    const timer = setTimeout(() => {
      onClose(); // Call onClose directly after timeout
    }, 3000);
    
    return () => clearTimeout(timer); // Clean up on unmount
  }, [onClose]); // Dependency array with onClose

  return (
    <div className={`bg-white p-4 rounded shadow border-l-4 ${
      type === 'success' ? 'border-green-500' : 
      type === 'error' ? 'border-red-500' : 'border-yellow-500'
    } fixed top-5 right-5 z-50 min-w-[300px] animate-fade-in`}>
      <div className="flex items-start space-x-3">
        <div>{ICONS[type]}</div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
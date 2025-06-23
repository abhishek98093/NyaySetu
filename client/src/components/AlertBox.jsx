
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
import React, { useState } from 'react';

// Inline SVG for the ShieldCheck icon (from lucide-react)
const ShieldCheckIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

// Inline SVG for the X icon (from lucide-react)
const XIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);


/**
 * A responsive privacy notice component that displays as a modal overlay.
 * @param {object} props - The component props.
 * @param {boolean} props.isVisible - Controls the visibility of the prompt.
 * @param {function} props.onClose - Function to call when the prompt is dismissed.
 * @returns {JSX.Element|null} The rendered component or null if not visible.
 */
const PrivacyPrompt = ({ isVisible, onClose }) => {
    // If not visible, don't render anything
    if (!isVisible) {
        return null;
    }

    return (
        // The main container, acting as a modal overlay
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-heading"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 animate-fadeIn"
        >
            {/* The modal content card */}
            <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-2xl shadow-xl transform transition-all duration-300 animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close privacy notice"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                {/* Header Section */}
                <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-green-500" />
                    <h2 id="privacy-heading" className="ml-3 text-2xl font-bold text-gray-800">
                        Your Privacy Matters
                    </h2>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-gray-600">
                    <p>
                        Your data is 100% safe and secure. We strictly follow privacy-first
                        practices and do not share your personal information with third parties.
                    </p>
                    <p>
                        We also provide an anonymous reporting feature, allowing you to share feedback
                        or report issues without revealing your identity.
                    </p>
                </div>

                 {/* Action Button */}
                 <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                        I Understand
                    </button>
                </div>
            </div>
            {/* Adding keyframes for simple animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default PrivacyPrompt;
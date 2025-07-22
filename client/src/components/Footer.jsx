import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import PrivacyPrompt from './PrivacyPrompt';

const Footer = () => {
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    const handleClosePrompt = () => {
        setIsPromptVisible(false);
    };

    const handleShowPrompt = () => {
        setIsPromptVisible(true);
    };

    return (
        <>
            {/* The PrivacyPrompt component is now here, outside the main flow */}
            <PrivacyPrompt
                isVisible={isPromptVisible}
                onClose={handleClosePrompt}
            />

            <footer className="bg-gray-100 border-t border-gray-300 text-gray-600 px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full">
                <div className="flex flex-col md:flex-row justify-between gap-12 pb-10 border-b border-gray-400/20">
                    
                    {/* Logo & Description */}
                    <div className="md:max-w-md">
                        <Link to='/' className="flex items-center gap-2 font-bold text-2xl text-blue-600 mb-4">
                            <Shield className="h-8 w-8" />
                            <span>Nyay Setu</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-700">
                            Nyay Setu is a community-driven crime reporting platform empowering citizens to anonymously submit leads, report crimes, and bridge the gap with law enforcement to build a safer society for all.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col md:flex-row gap-12 w-full md:w-auto">
                        
                        {/* Quick Links */}
                        <div>
                            <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
                                <li><Link to="/about" className="hover:text-blue-600 transition">About Us</Link></li>
                                {/* FIXED: "Privacy Policy" is now a button styled like a link inside the list */}
                                <li>
                                    <button 
                                        onClick={handleShowPrompt} 
                                        className="hover:text-blue-600 transition text-left w-full"
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom Note */}
                <p className="text-center text-xs md:text-sm text-gray-500 mt-6 pb-6">
                    © 2025 Nyay Setu. All rights reserved.
                </p>
            </footer>
        </>
    );
};

export default Footer;
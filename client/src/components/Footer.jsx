import React from 'react';
import logo from '../assets/Nyay-setu-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 text-gray-600 px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-12 pb-10 border-b border-gray-400/20">
        {/* Logo & Description */}
        <div className="md:max-w-md">
          <img className="h-10 mb-4" src={logo} alt="Nyay Setu Logo" />
          <p className="text-sm leading-relaxed text-gray-700">
            Our mission is to empower every citizen with a transparent, secure, and accessible platform to report crimes in real time. By bridging the gap between the community and law enforcement, we ensure that every voice is heard and every report is acted upon with integrity.
          </p>
        </div>

        {/* Navigation & Newsletter */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Links */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition">Home</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-sm mb-4">
              Get the latest updates and alerts delivered directly to your inbox.
            </p>
            <div className="flex items-center gap-2">
              <input
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-center text-xs md:text-sm text-gray-500 mt-6 pb-6">
        © 2025 Nyay Setu. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

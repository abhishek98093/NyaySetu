import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
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

        {/* Navigation & Newsletter */}
        <div className="flex flex-col md:flex-row gap-12 w-full md:w-auto">
          
          {/* Quick Links */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm w-full">
            <h2 className="font-semibold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-sm mb-4">
              Get the latest crime alerts and platform updates directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition w-full sm:w-auto">
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

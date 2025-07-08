import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">About Our Platform</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Who We Are</h2>
        <p className="text-gray-700">
          We are a community-driven platform focused on enabling citizens to report complaints, missing persons, and criminal sightings efficiently.
          Our mission is to bridge the gap between the public, police officers, and administrators to ensure a safer society.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">What We Do</h2>
        <p className="text-gray-700">
          Users can submit leads with media evidence, police officers can verify and update complaint statuses, and admins manage the entire system
          including user and police accounts to ensure integrity and trust.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
        <p className="text-gray-700">
          To build a transparent and collaborative ecosystem where every citizen feels empowered to report, and authorities can act promptly with verified information.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
        <p className="text-gray-700">
          For support, queries, or feedback, please reach out at <span className="text-blue-600">nyaysetu.foru@gmail.com</span>. Your suggestions are valuable in improving our services.
        </p>
      </div>
    </div>
  );
};

export default About;

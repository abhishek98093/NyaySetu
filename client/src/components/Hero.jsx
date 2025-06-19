import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const messages = [
    "verified citizen alerts",
    "location-based reports",
    "community-police sync",
    "real-time tracking",
    "transparent reporting",
  ];
  const [Index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [Index]);

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 xl:px-32 bg-[url('/src/assets/hero-bg.png')] bg-no-repeat bg-cover bg-center h-screen text-left">
      
      {/* Top Line */}
      <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-4 rounded-full bg-[#49B9FF]/50 px-3.5 py-1 mt-5" >
        Safety Starts With You
      </p>

      {/* Main Title */}
      <div className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-snug">
        <span className="text-gray-800">Creating safer streets with </span>
        <span
          className={`inline-block transition-opacity duration-500 text-indigo-600 font-bold ${
            fade ? 'animate-fade-in-left opacity-100' : 'animate-fade-out-right opacity-0'
          }`}
        >
          {messages[Index]}
        </span>
      </div>

      {/* Bottom Line */}
      <p className="text-gray-600 text-sm md:text-base mb-10 max-w-xl">
        Your reports help authorities respond faster and better.
      </p>

    </div>
  );
};

export default Hero;

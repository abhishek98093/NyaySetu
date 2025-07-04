// import React, { useEffect, useState } from 'react';
// import { ShieldCheck, Users, Link2 } from 'lucide-react';
// // Simple SVG illustration component
// const ShieldIllustration = () => (
//   <div className="relative">
//     <ShieldCheck className="w-full h-auto text-blue-500 opacity-20 scale-125" strokeWidth={0.5} />
//     <div className="absolute inset-0 flex items-center justify-center">
//       <div className="w-4/5 h-4/5 bg-white/60 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center">
//         <Users className="w-1/2 h-1/2 text-blue-600 opacity-80" strokeWidth={1.5} />
//       </div>
//     </div>
//   </div>
// );
// // Hero Section Component
// const Hero = () => {
//   const messages = [
//   "Empowering Indian Citizens",
//   "Fostering Community Trust",
//   "Bridging Police and Public",
//   "Building Safer Communities",
//   "Real-Time Safety Updates",
// ];


//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fade, setFade] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFade(false);
//       setTimeout(() => {
//         setCurrentIndex(prev => (prev + 1) % messages.length);
//         setFade(true);
//       }, 500);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [messages.length]);

//   return (
//     <div className="relative font-sans bg-gray-50 min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background blobs */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
//         <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-6 md:px-12 text-center md:text-left">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-12">

//           {/* Left Content */}
//           <div className="md:w-1/2 lg:w-3/5">
//             <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
//               <ShieldCheck className="text-blue-600 h-5 w-5" />
//               <span className="text-sm font-semibold text-gray-700">
//                 India's Trusted Safety Network
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
//               A New Era of&nbsp;
//               <span
//                 className={`inline-block transition-opacity duration-500 ease-in-out text-blue-600 ${
//                   fade ? 'opacity-100' : 'opacity-0'
//                 }`}
//               >
//                 {messages[currentIndex]}
//               </span>
//             </h1>

//             <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mb-10">
//               Join a nationwide movement to enhance safety and collaboration in your community. Report incidents,
//               receive alerts, and work together for a more secure tomorrow.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
//               <button
//                 onClick={() => window.location.href = '/signup'}
//                 className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               >
//                 Join the Revolution
//                 <Users className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
//               </button>
//               <button
//                 onClick={() => window.location.href = '/login'}
//                 className="group inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
//               >
//                 Report an Incident
//                 <Link2 className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
//               </button>
//             </div>
//           </div>

//           {/* Right Visual */}
//           <div className="hidden md:block md:w-1/2 lg:w-2/5">
//             <ShieldIllustration />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simple SVG illustration component
const ShieldIllustration = () => (
  <div className="relative">
    <ShieldCheck className="w-full h-auto text-blue-500 opacity-20 scale-125" strokeWidth={0.5} />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4/5 h-4/5 bg-white/60 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center">
        <Users className="w-1/2 h-1/2 text-blue-600 opacity-80" strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  const messages = [
    "Reporting Crimes Made Easy",
    "Bridge Between Citizens and Police",
    "Track Missing People Effortlessly",
    "Submit Anonymous Crime Leads",
    "Strengthening Community Safety",
    "Submit Leads, Earn Appreciation",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
        setFade(true);
      }, 800);
    }, 4800);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="relative font-sans bg-gray-50 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left Content */}
          <div className="md:w-1/2 lg:w-3/5">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
              <ShieldCheck className="text-blue-600 h-5 w-5" />
              <span className="text-sm font-semibold text-gray-700">
                Community-Driven Crime Reporting System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Secure Platform For&nbsp;
              <span
                className={`inline-block transition-opacity duration-500 ease-in-out text-blue-600 ${
                  fade ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {messages[currentIndex]}
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mb-10">
              Report crimes, submit crucial leads, and help track missing people. Connect with your local police and community to build a safer society, together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
                <Users className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="group inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                Continue To Report
                <Link2 className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:block md:w-1/2 lg:w-2/5">
            <ShieldIllustration />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

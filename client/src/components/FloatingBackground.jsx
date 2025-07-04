// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// // --- Inline Icon Components ---
// const ShieldIcon = () => (
//   <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
//     <path d="M10 2.25c-4.28 0-8 3.033-8 7.333 0 3.133 2.543 5.967 6 6.95V18c0 .552.448 1 1 1h2c.552 0 1-.448 1-1v-1.467c3.457-.983 6-3.817 6-6.95 0-4.3-3.72-7.333-8-7.333zM10 16.5c-3.313 0-6-2.467-6-5.167S6.687 6.167 10 6.167s6 2.467 6 5.167-2.687 5.166-6 5.166z" />
//   </svg>
// );

// const MagnifyingGlassIcon = () => (
//   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//   </svg>
// );

// const EyeIcon = () => (
//   <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
//     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
//     <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 4.5 10 4.5s6.268.443 9.542 5.5c0 0-3.732 5.057-9.542 5.5S.458 10 .458 10zm17.084 0c-2.423-3.34-6.42-3.824-7.542-3.824S4.84 6.66 2.416 10c2.424 3.34 6.42 3.824 7.542 3.824s5.118-.484 7.542-3.824z" clipRule="evenodd"></path>
//   </svg>
// );

// const FingerprintIcon = () => (
//   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5S10.328 13 9.5 13 8 12.328 8 11.5z"></path>
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 14.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5S6 16.433 6 14.5z"></path>
//   </svg>
// );

// // --- Icons array ---
// const icons = [ShieldIcon, MagnifyingGlassIcon, EyeIcon, FingerprintIcon];

// const FloatingBackground = () => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!loaded) return null;

//   return (
//     <div className="absolute inset-0 -z-10 overflow-hidden">
//       {Array.from({ length: 20 }).map((_, index) => {
//         const Icon = icons[Math.floor(Math.random() * icons.length)];
//         const size = 60 + Math.random() * 100;

//         return (
//           <motion.div
//             key={index}
//             className="absolute text-blue-300"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               width: `${size}px`,
//               height: `${size}px`,
//               opacity: 0.08,
//             }}
//             animate={{
//               y: [0, -20, -10, 10, 0],
//               x: [0, 10, -10, 5, 0],
//               rotate: [0, 15, -10, 10, 0],
//             }}
//             transition={{
//               duration: 20 + Math.random() * 20,
//               repeat: Infinity,
//               ease: "linear",
//               delay: Math.random() * 5,
//             }}
//           >
//             <Icon />
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// export default FloatingBackground;
import React from 'react';
import { FaShieldAlt, FaUserShield, FaSearch, FaEye, FaFingerprint, FaExclamationTriangle, FaBalanceScale, FaMapMarkerAlt } from 'react-icons/fa';

const FloatingBackground = () => {
  const icons = [
    { Component: FaShieldAlt, style: 'top-[10%] left-[5%] text-purple-400 text-5xl' },
    { Component: FaUserShield, style: 'top-[20%] right-[10%] text-blue-400 text-4xl' },
    { Component: FaSearch, style: 'top-[30%] left-[20%] text-yellow-400 text-3xl' },
    { Component: FaEye, style: 'top-[40%] right-[5%] text-red-400 text-5xl' },
    { Component: FaFingerprint, style: 'bottom-[20%] left-[10%] text-gray-400 text-4xl' },
    { Component: FaExclamationTriangle, style: 'bottom-[10%] right-[20%] text-orange-400 text-3xl' },
    { Component: FaBalanceScale, style: 'bottom-[30%] left-[25%] text-green-400 text-5xl' },
    { Component: FaMapMarkerAlt, style: 'bottom-[5%] left-[40%] text-teal-400 text-5xl' },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {icons.map(({ Component, style }, i) => (
        <Component
          key={i}
          className={`absolute ${style} opacity-50 animate-floating`}
        />
      ))}
    </div>
  );
};

export default FloatingBackground;

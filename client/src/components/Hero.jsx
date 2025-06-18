import React from 'react'
import { useEffect,useState } from 'react';

const Hero = () => {
  const messages = [
    "Report a crime anonymously and safely.",
    "Contribute to a safer society.",
    "Bridge the gap between citizens and authorities.",
    "Your voice matters. Raise it now.",
    "Nyay Setu – Justice at your fingertips.",
    "Together, we make our neighborhoods safer."
  ];

  const [Index,setIndex]=useState(0);
 useEffect(()=>{
  const timeout=setTimeout(()=>{
    setIndex((prev)=>(prev+1)%messages.length)
  },3000);
  return ()=>clearTimeout(timeout);
 },[Index]);
  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/hero-bg.png")] bg-no-repeat bg-cover bg-center h-screen'>
      {/* Add content here, like headings or buttons */}
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-green text-center transition-opacity duration-1000 ease-in-out h-24 flex items-center justify-center">
      <span className="fade-in">{messages[Index]}</span>
      </div>
      <div className="flex gap-4">
        <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full">Login</button>
        <button className="bg-white text-indigo-600 hover:bg-gray-200 px-6 py-2 rounded-full">Signup</button>
      
    </div>
    </div>
  )
}

export default Hero

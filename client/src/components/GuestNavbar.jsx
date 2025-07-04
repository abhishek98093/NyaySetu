import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const GuestNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/landingpage' || location.pathname === '/';
  const isLoginPage = location.pathname.includes("login");
  const isSignupPage = location.pathname.includes("signup");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const navClasses = `
    fixed top-0 left-0 w-full flex items-center justify-between
    px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out z-50
    ${isScrolled ? "bg-white/80 shadow-md backdrop-blur-lg py-3" : "bg-transparent py-5"}
  `;

  const renderButtons = () => {
    if (isHomePage) {
      return (
        <>
          <button onClick={() => navigate('/login')} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-300">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Sign Up
          </button>
        </>
      );
    }
    if (isLoginPage) {
      return (
        <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Sign Up
        </button>
      );
    }
    if (isSignupPage) {
      return (
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Login
        </button>
      );
    }
    return null;
  };

  return (
    <nav className={navClasses}>
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to='/' className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Shield className="h-8 w-8" />
          <span>Nyay Setu</span>
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {renderButtons()}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`
        fixed top-0 left-0 w-full h-screen bg-white text-gray-800
        flex flex-col items-center justify-center gap-8
        transition-transform duration-500 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)}>
          <X className="h-7 w-7" />
        </button>

        <div className="flex flex-col gap-8 text-center">
          {isHomePage && (
            <>
              <button onClick={() => navigate('/login')} className="text-2xl font-semibold">Login</button>
              <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-semibold">Sign Up</button>
            </>
          )}
          {isLoginPage && (
            <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-semibold">Sign Up</button>
          )}
          {isSignupPage && (
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-semibold">Login</button>
          )}
          {!isHomePage && (
            <button onClick={() => navigate('/')} className="text-2xl font-semibold">Home</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;

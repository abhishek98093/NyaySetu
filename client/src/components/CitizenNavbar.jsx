import { useNavigate } from 'react-router-dom';
import logo from '../assets/Nyay-setu-logo.svg';
import menuicon from '../assets/menu-icon.png';
import closemenu from '../assets/close.png';
import React from 'react';

const CitizenNavbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Complaint Section', path: '/' },
        { name: 'Missing Section', path: '/' },
        { name: 'Criminal Sighting', path: '/' },
        { name: 'Info Section', path: '/' },
        { name: 'About', path: '/' }
    ];

    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    }

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 bg-indigo-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
            
            {/* Logo */}
            <img
                src={logo}
                alt="logo"
                className={`h-9 cursor-pointer ${isScrolled && "invert opacity-80"}`}
                onClick={() => navigate('/')}
            />

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(link.path)}
                        className={`group flex flex-col gap-0.5 focus:outline-none ${isScrolled ? "text-gray-700" : "text-white"}`}
                    >
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </button>
                ))}
                <button
                    onClick={() => navigate('/citizendashboard')}
                    className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                >
                    Dashboard
                </button>
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <button
                    onClick={() => navigate('/citizendashboard')}
                    className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
                >
                    Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <img
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    src={menuicon}
                    alt="menu-icon"
                    className={`${isScrolled && "invert"} h-4`}
                />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={closemenu} alt="menu-icon" className="h-4 w-4" />
                </button>

                {navLinks.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            navigate(link.path);
                            setIsMenuOpen(false);
                        }}
                        className="focus:outline-none"
                    >
                        {link.name}
                    </button>
                ))}

                <button
                    onClick={() => {
                        navigate('/citizendashboard');
                        setIsMenuOpen(false);
                    }}
                    className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                >
                    Dashboard
                </button>

                <button
                    onClick={() => {
                        navigate('/citizendashboard');
                        setIsMenuOpen(false);
                    }}
                    className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                >
                    Profile
                </button>
                <button
                    onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                    }}
                    className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default CitizenNavbar;
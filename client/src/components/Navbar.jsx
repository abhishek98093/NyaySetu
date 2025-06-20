import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PoliceNavbar from './PoliceNavbar';
import CitizenNavbar from './CitizenNavbar';
import AdminNavbar from './AdminNavbar';
import GuestNavbar from './GuestNavbar';
import { getToken, isValidToken, getRole } from '../utils/utils';

const Navbar = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        token: null,
        valid: false,
        role: null,
        initialized: false
    });

    // Get current token value
    const currentToken = getToken();

    // Effect that runs whenever the token changes
    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            setAuthState({
                token,
                valid: token ? isValidToken() : false,
                role: token ? getRole() : null,
                initialized: true
            });
        };

        // Initial check
        checkAuth();

        // Set up storage event listener as fallback
        const storageListener = () => checkAuth();
        window.addEventListener('storage', storageListener);

        return () => {
            window.removeEventListener('storage', storageListener);
        };
    }, [currentToken]); // ← Token as dependency

    // Instant logout handling
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        // No need to manually update state - the effect will handle it
    };

    if (!authState.initialized) {
        return null;
    }

    if (!authState.token || !authState.valid) {
        return <GuestNavbar />;
    }

    switch (authState.role?.toLowerCase()) {
        case 'citizen':
            return <CitizenNavbar onLogout={handleLogout} />;
        case 'admin':
            return <AdminNavbar onLogout={handleLogout} />;
        case 'police':
            return <PoliceNavbar onLogout={handleLogout} />;
        default:
            return <GuestNavbar />;
    }
};

export default Navbar;
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import profileIcon from '../assets/profile.svg';
import calendarIcon from '../assets/calendar.svg';
import './Header.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Header: React.FC<{ 
  isLoggedIn: boolean; 
  handleLogout: () => void; 
  openSignIn: () => void; 
  openRegister: () => void; 
}> = ({ isLoggedIn, handleLogout, openSignIn, openRegister }) => {
  const location = useLocation();
  const darkModeContext = useContext(DarkModeContext);
  if (!darkModeContext) {
    throw new Error('DarkModeContext must be used within a DarkModeProvider');
  }
  const { darkMode } = darkModeContext;
  const [username, setUsername] = useState<string | null>(null);

  // Fetch user profile data when isLoggedIn changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!isLoggedIn || !token) {
        setUsername(null);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.email); // Adjust according to your backend response
        } else {
          console.error('Failed to fetch user profile:', response.status, response.statusText);
          setUsername(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUsername(null);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn]); // Runs whenever the login state changes

  // Ensure the header is not displayed on the calendar page
  if (location.pathname === '/calendar') {
    return null;
  }

  return (
    <header className={`app-header ${darkMode ? 'dark-mode' : ''}`}>
      {/* Left Section */}
      <div className="header-left">
        <span className="app-header-logo">Cashlite</span>
      </div>

      {/* Center Section */}
      <div className="header-center">
        <Link to="/calendar">
          <img
            src={calendarIcon}
            alt="Calendar"
            className={`header-icon ${darkMode ? 'dark-icon' : ''}`}
          />
        </Link>
        <span className="header-date">October 2024</span>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <img
              src={profileIcon}
              alt="Profile"
              className={`header-icon ${darkMode ? 'dark-icon' : ''}`}
            />
            <span className="header-username">{username}</span>
            <button className="header-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <button className="header-btn" onClick={openSignIn}>
              Log In
            </button>
            <button className="header-btn" onClick={openRegister}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

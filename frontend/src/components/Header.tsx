import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext
import profileIcon from '../assets/profile.svg';
import calendarIcon from '../assets/calendar.svg';
import './Header.css';

const Header: React.FC<{ isLoggedIn: boolean, handleLogout: () => void, openSignIn: () => void, openRegister: () => void }> = ({ isLoggedIn, handleLogout, openSignIn, openRegister }) => {
  const location = useLocation(); // Get current route
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state

  // Do not render the header on the calendar page
  if (location.pathname === '/calendar') {
    return null;
  }

  return (
    <header className={`app-header ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-left">
        <span className='app-header-logo'>Cashlite</span>

        {isLoggedIn && (
          <>
            <img src={profileIcon} alt="Profile" className="header-icon" />
            <button className="header-btn" onClick={handleLogout}>Log Out</button>
          </>
        )}
      </div>

      <div className="header-center">
        <Link to="/calendar">
          <img src={calendarIcon} alt="Calendar" className="header-icon" />
        </Link>
        <span>October 2024</span>
      </div>

      <div className="header-right">
        {!isLoggedIn ? (
          <>
            <button className="header-btn" onClick={openSignIn}>Log In</button>
            <button className="header-btn" onClick={openRegister}>Register</button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;

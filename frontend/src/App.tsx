import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Upcoming from './pages/Upcoming';
import Calendar from './pages/Calendar';
import Header from './components/Header';
import SignInModal from './components/SignInModal';
import RegisterModal from './components/RegisterModal';

const App = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);  // State for SignIn modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);  // State for Register modal
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track if the user is logged in

  const handleLogout = () => {
    setIsLoggedIn(false); // Handle logout
  };

  return (
    <Router>
      {/* Pass the modal open functions to Header */}
      <Header 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        openSignIn={() => setIsSignInOpen(true)} 
        openRegister={() => setIsRegisterOpen(true)} 
      />

      {/* Modals for Sign In and Register */}
      {isSignInOpen && (
        <SignInModal closeModal={() => setIsSignInOpen(false)} />
      )}

      {isRegisterOpen && (
        <RegisterModal closeModal={() => setIsRegisterOpen(false)} />
      )}

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="upcoming" element={<Upcoming />} />
      </Routes>
    </Router>
  );
};

export default App;

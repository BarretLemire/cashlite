import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upcoming from "./pages/Upcoming";
import Calendar from "./pages/Calendar";
import Header from "./components/Header";
import SignInModal from "./components/SignInModal";
import RegisterModal from "./components/RegisterModal";
import { DarkModeProvider } from "./context/DarkModeContext";

const App: React.FC = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false); // State for SignIn modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State for Register modal
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken") // Determine initial login state from localStorage
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token on logout
    setIsLoggedIn(false); // Update login state
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set user as logged in after successful login
    setIsSignInOpen(false); // Close the SignIn modal
  };

  return (
    <DarkModeProvider>
      <Router>
        <Header
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          openSignIn={() => setIsSignInOpen(true)}
          openRegister={() => setIsRegisterOpen(true)}
        />

        {/* Modals for Sign In and Register */}
        {isSignInOpen && (
          <SignInModal
            closeModal={() => setIsSignInOpen(false)}
            onLoginSuccess={handleLoginSuccess} // Pass the login success handler
          />
        )}

        {isRegisterOpen && (
          <RegisterModal closeModal={() => setIsRegisterOpen(false)} />
        )}

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="upcoming" element={<Upcoming />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;

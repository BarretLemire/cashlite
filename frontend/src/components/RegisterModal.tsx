import React, { useState, useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext
import './Modal.css';

const RegisterModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh on form submission
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    console.log("Registering:", { email, password });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    closeModal();
  };

  return (
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Re-enter Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <label>
            <input type="checkbox" /> Remember me
          </label>

          <button type="submit" className="modal-btn">Register</button>
        </form>

        <button onClick={closeModal} className="close-modal">X</button>
      </div>
    </div>
  );
};

export default RegisterModal;

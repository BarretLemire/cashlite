import React, { useState, useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext
import './Modal.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const RegisterModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh on form submission
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setSuccessMessage("User registered successfully. Please log in.");
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setTimeout(closeModal, 2000); // Close modal after 2 seconds
      } else {
        const error = await response.json();
        setErrorMessage(`Error: ${error.detail || 'Failed to register.'}`);
      }
    } catch (error) {
      setErrorMessage('Error: Unable to connect to the server.');
    }
  };

  return (
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <h2>Register</h2>

        {successMessage ? ( // Display success message if present
          <p className="success-message">{successMessage}</p>
        ) : (
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
        )}

        <button onClick={closeModal} className="close-modal">X</button>
      </div>
    </div>
  );
};

export default RegisterModal;

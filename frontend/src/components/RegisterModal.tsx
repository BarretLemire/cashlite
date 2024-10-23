import React, { useState } from 'react';
import './Modal.css';

const RegisterModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh on form submission
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Proceed with registration logic (e.g., send data to backend)
    console.log("Registering:", { email, password });
    // Clear form and error message
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          {/* Email Field */}
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Re-enter Password Field */}
          <label>Re-enter Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Display error if passwords don't match */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Remember me Checkbox */}
          <label>
            <input type="checkbox" /> Remember me
          </label>

          {/* Submit Button */}
          <button type="submit" className="modal-btn">Register</button>
        </form>

        {/* Close Modal Button */}
        <button onClick={closeModal} className="close-modal">X</button>
      </div>
    </div>
  );
};

export default RegisterModal;

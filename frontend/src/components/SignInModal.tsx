import React, { useContext, useState } from 'react';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext
import './Modal.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const SignInModal: React.FC<{ closeModal: () => void; onLoginSuccess: () => void }> = ({
  closeModal,
  onLoginSuccess,
}) => {
  const darkModeContext = useContext(DarkModeContext);
  if (!darkModeContext) {
    throw new Error('DarkModeContext must be used within a DarkModeProvider');
  }
  const { darkMode } = darkModeContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.access_token); // Store the token in localStorage
      localStorage.setItem('userId', data.user_id); // Assuming the backend response includes user_id
      onLoginSuccess(); // Notify parent component of successful login
    } catch (err) {
      setError((err as Error).message || "Failed to log in");
    }
  };

  return (
    <div className={`modal-overlay ${darkMode ? "dark-mode" : ""}`}>
      <div className="modal-content">
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
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

          <label>
            <input type="checkbox" /> Remember me
          </label>

          <button type="submit" className="modal-btn">
            Log In
          </button>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </form>
        <button onClick={closeModal} className="close-modal">
          X
        </button>
      </div>
    </div>
  );
};

export default SignInModal;

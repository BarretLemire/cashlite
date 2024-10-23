import React from 'react';
import './Modal.css';

const SignInModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Log In</h2>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <label>
            <input type="checkbox" /> Remember me
          </label>
          
          <button type="submit" className="modal-btn">Log In</button>
          <a href="#" className="forgot-password">Forgot password?</a>
        </form>
        <button onClick={closeModal} className="close-modal">X</button>
      </div>
    </div>
  );
};

export default SignInModal;

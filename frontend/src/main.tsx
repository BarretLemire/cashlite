// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new createRoot from react-dom/client
import App from './App';
import './index.css';

const container = document.getElementById('root'); // Get the root element
const root = ReactDOM.createRoot(container!); // Create a root instance

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

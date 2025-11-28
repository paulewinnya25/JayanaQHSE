import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Intercepter les erreurs supplémentaires au niveau de React
const originalError = console.error;
console.error = function(...args) {
  const message = args[0]?.toString() || '';
  const fullMessage = args.map(arg => String(arg)).join(' ');
  
  // Ignorer les erreurs SVG viewBox
  if ((message.includes('attribute viewBox') && message.includes('Expected number')) ||
      (fullMessage.includes('attribute viewBox') && fullMessage.includes('Expected number'))) {
    return;
  }
  
  // Ignorer les erreurs WebSocket
  if (message.includes('WebSocket is already in CLOSING') || 
      message.includes('WebSocket is already in CLOSED') ||
      fullMessage.includes('WebSocket is already in CLOSING') || 
      fullMessage.includes('WebSocket is already in CLOSED')) {
    return;
  }
  
  originalError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);






import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Hide splash screen after 2.5 seconds
const splashScreen = document.getElementById('splash-screen');
if (splashScreen) {
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    // Remove from DOM after transition for performance
    splashScreen.addEventListener('transitionend', () => splashScreen.remove());
  }, 2500);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
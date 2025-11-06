import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Splash screen logic
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  // Hide splash screen after a delay to show the animation
  setTimeout(() => {
    if (splash) {
      splash.classList.add('hidden');
      // Remove from DOM after transition to prevent it from interfering
      setTimeout(() => {
        splash.remove();
      }, 750); // This duration should match the CSS transition time
    }
  }, 2500); // 2.5 seconds total display time
});

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
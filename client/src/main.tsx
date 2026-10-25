import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { App } from './App';
import './index.css';

// Automatically route relative API and upload requests to backend server on mobile platforms or when VITE_API_URL is configured
if (Capacitor.isNativePlatform() || import.meta.env.VITE_API_URL) {
  const API_HOST = (import.meta.env.VITE_API_URL || (Capacitor.isNativePlatform() ? 'http://10.0.2.2:5001' : '')).replace(/\/$/, '');
  if (API_HOST) {
    const originalFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string') {
        if (input.startsWith('/api') || input.startsWith('/uploads')) {
          return originalFetch(`${API_HOST}${input}`, init);
        }
      } else if (input instanceof Request) {
        const url = new URL(input.url, window.location.href);
        if (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads')) {
          return originalFetch(new Request(`${API_HOST}${url.pathname}${url.search}`, input), init);
        }
      }
      return originalFetch(input, init);
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


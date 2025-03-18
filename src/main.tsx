import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handler for rendering issues
const root = document.getElementById('root');

if (root) {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render the application:', error);
    
    // Fallback render in case of error
    root.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>AblEats</h1>
        <p>There was a problem loading the application. Please refresh the page or try again later.</p>
      </div>
    `;
  }
} else {
  console.error('Root element not found in the document');
}

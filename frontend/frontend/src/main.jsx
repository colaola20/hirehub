// Entry point for the React application
import { StrictMode } from 'react'; // Enables additional checks and warnings for descendants
import { createRoot } from 'react-dom/client'; // React 18+ root API
import './index.css'; // Global styles
import App from './App.jsx'; // Main App component

// Create a React root and render the App component inside StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

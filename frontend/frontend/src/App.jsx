// Import global styles for the app
import './App.css';
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import the page components
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import ForgotPassword from './pages/forgot_password';
import UserDashboard from './pages/UserDashboard';

// Import helpers
import OAuthHandler from './components/OAuthHandler';
import ProtectedRoute from './components/ProtectedRoute';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Root App component that renders the Login and Registration pages
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
        
          {/* Protected dashboard route */}
          <Route
            path="/:username"
            element={
              <>
                {/* Handles ?token=...&username=... from LinkedIn/Google/GitHub */}
                <OAuthHandler />
                <ProtectedRoute>
                <UserDashboard />
                </ProtectedRoute>
              </>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

// Export App as the default export
export default App;

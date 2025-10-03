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


// Root App component that renders the Login and Registration pages
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />

        {/* OAuth handler route: reads token & redirects */}
        <Route path="/oauth" element={<OAuthHandler />} />

        {/* Protected dashboard route */}
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Export App as the default export
export default App;

// Import global styles for the app
import './App.css';
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Import the page components
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import ForgotPassword from './pages/forgot_password';

import JobDetails from "./components/JobDetailsModal.jsx";

import JobsList from './pages/JobsList.jsx'

import UserDashboard from './pages/UserDashboard';
import ResumeForm from './pages/ResumeForm';



// Import helpers
import OAuthHandler from './components/OAuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/reset_password.jsx';



// Root App component that renders the Login and Registration pages
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/resume_form" element={<ResumeForm />} />
      

        {/* OAuth handler route: reads token & redirects */}
        <Route path="/oauth" element={<OAuthHandler />} />

          <Route path="/dev-dashboard" element={<UserDashboard />} />
       

        {/* Protected dashboard route */}
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <UserDashboard />
              <JobDetails />
            </ProtectedRoute>
          }
        >
          <Route index element = {<JobsList/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

// Export App as the default export
export default App;

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
import Profile from './pages/Profile.jsx';
import JobDashboard from './pages/Job_Dashboard.jsx';


// Import helpers
import OAuthHandler from './components/OAuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/reset_password.jsx';
import Settings from './pages/Setting.jsx'
import Notifications from './pages/Notifications.jsx'
import Documents from './pages/Documents.jsx'
import ContactPage from "./pages/contact_us.jsx";


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
        <Route path="/contact_us" element={<ContactPage  />} />
  

        {/* OAuth handler route: reads token & redirects */}
        <Route path="/oauth" element={<OAuthHandler />} />
        <Route path="/dev-dashboard" element={<UserDashboard />} />
       
      <Route
          path="/job_dashboard"
          element={
            <ProtectedRoute>
              <JobDashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected dashboard route */}
        <Route 
          path="/:username"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobsList/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="settings" element={<Settings/>} />
          <Route path="documents" element={<Documents/>} />
        </Route>
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

// Export App as the default export
export default App;

// Import global styles for the app
import './App.css';
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import the Login page component
import Login from './Login';
// Import the Registration page component
import Registration_Page from './Registration_Page';

// Root App component that renders the Login and Registration pages
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration_Page />} />
      </Routes>
    </Router>
  );
}

// Export App as the default export
export default App;


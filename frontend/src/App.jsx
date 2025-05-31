import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing imports
import LoginForm from './components/Signup/LoginPage';
import SignupForm from './components/Signup/SignupForm';
import LandingPage from './Pages/LandingPage';

// Dashboard page 
import Dashboard from './Pages/Dashboard/Dashboard';
import AdminLogin from './components/Signup/AdminLogin';

// user dashboard
import UserDashboard from './Pages/Dashboarduser/dashboarduser';
import ChatBot from './Pages/Dashboarduser/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        {/*routes */}
        <Route path="/Home" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* Dashboardroutes */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/dashboard/contact" element={<Contact />} />
        <Route path="/dashboard/history" element={<History />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/settings" element={<Settings />} /> */}
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;

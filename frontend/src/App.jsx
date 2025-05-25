import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing imports
import LoginForm from './components/Signup/LoginPage';
import SignupForm from './components/Signup/SignupForm';
import LandingPage from './Pages/LandingPage';

// Dashboard page 
import Dashboard from './Pages/Dashboard/Dashboard';
import AdminLogin from './components/Signup/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/*routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* Dashboardroutes */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/dashboard/contact" element={<Contact />} />
        <Route path="/dashboard/history" element={<History />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/settings" element={<Settings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

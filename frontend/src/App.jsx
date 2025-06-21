import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing imports

// Existing imports
import LoginForm from './components/Signup/LoginPage';
import SignupForm from './components/Signup/SignupForm';
import LandingPage from './Pages/LandingPage';

// Dashboard page 
import Dashboard from './Pages/Dashboard/Dashboard';
import AdminLogin from './components/Signup/AdminLogin';
import ProtectedRoutes from './components/PretiectedRoutes';

// user dashboard
import UserDashboard from './Pages/Dashboarduser/dashboarduser';
import ChatBot from './Pages/Dashboarduser/Chatbot';
import {
  initialPosts,
  sidebarItems,
  platformColors,
  getPlatformIcon

} from './Pages/Dashboarduser/Constants';
import { CalendarView, HistoryView, PostDetailsModal } from './Pages/Dashboarduser/CalenderandHistory';
import { PostForm, HistoryFilterModal } from './Pages/Dashboarduser/form';


//form after signup
import ExForm from './Pages/exploringform';
import Events from './Pages/Dashboard/Events';

// payment pages
import SuccessPage from './Pages/SuccessPage';
import CancelPage from './Pages/CancelPage';
import PricingPage from './Pages/PricingPage';
import BillingPage from './Pages/Dashboard/billing'; 


function App() {
  return (
    <Router>
      <Routes>
        {/*routes */}
        {/*routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* payments  */}
        <Route path="/cancel" element={<SuccessPage />} />
        <Route path="/sucess" element={<CancelPage />} />
        <Route path="/Pricing" element={<PricingPage />} />
        <Route path="/b" element={<BillingPage />} />

        <Route path="/dashboard" element={
          // <ProtectedRoutes>
          <Dashboard />
          // </ProtectedRoutes>
        } />
        <Route path="/events" element={<Events />} />
        <Route path="/userDashboard" element={
          // <ProtectedRoutes>
          <UserDashboard />
          // </ProtectedRoutes>
        } />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/post-details" element={<PostDetailsModal />} />
        <Route path="/post-form" element={<PostForm />} />
        <Route path="/history-filter" element={<HistoryFilterModal />} />
        <Route path="/ex" element={<ExForm />} />
        {sidebarItems.map((item, index) => (
          <Route key={index} path={item.path} element={<item.component />} />
        ))}

      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginForm from './components/Signup/LoginPage';
import SignupForm from './components/Signup/SignupForm';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import AdminLogin from './components/Signup/AdminLogin';
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
import ExForm from './Pages/exploringform';
import Events from './Pages/Dashboard/Events';
import SuccessPage from './Pages/SuccessPage';
import CancelPage from './Pages/CancelPage';
import PricingPage from './Pages/PricingPage';
import BillingPage from './Pages/Dashboard/billing';
import NotFound from './Pages/NotFound';
import AdminOnly from './routes/AdminOnly';
import ConnectedOnly from './routes/ConnectedOnly';
import UserOnly from './routes/UserOnly';
import AlreadyConnected from './routes/AlreadyConnected';
import BillingPage2 from './Pages/BillingPage2';
import ProfileRequired from './routes/ProfileRequired';
import NotificationsPage from './Pages/Dashboard/NotificationsPage';
import TokensPage from './Pages/Dashboard/TokensPage';
import CheckoutPage from './Pages/BillingPage2';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AlreadyConnected />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
        </Route>

        {/* <Route path="/Pricing" element={<PricingPage />} /> */}
        {/* <Route path="/b" element={<BillingPage />} /> */}
        {/* <Route path="/c" element={<BillingPage2 />} /> */}

        <Route element={<ConnectedOnly />}>
          <Route path="/profile" element={<ExForm />} />
          <Route element={<UserOnly />}>
            <Route element={<ProfileRequired />}>
              <Route path="/Pricing" element={<CheckoutPage />} />
              <Route path="/userDashboard" element={<UserDashboard />} />
            </Route>
          </Route>
          <Route element={<AdminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/Tokens" element={<TokensPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/post-details" element={<PostDetailsModal />} />
            <Route path="/post-form" element={<PostForm />} />
            <Route path="/history-filter" element={<HistoryFilterModal />} />
          </Route>
        </Route>
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/sucess" element={<SuccessPage />} />
        <Route path="*" element={<NotFound />} />
        {/* {sidebarItems.map((item, index) => (
          <Route key={index} path={item.path} element={<item.component />} />
        ))} */}

      </Routes>
    </Router>
  );
}

export default App;

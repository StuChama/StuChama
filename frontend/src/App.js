import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignupForm from './components/SignUpForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import HomePage from './pages/Homepage/HomePage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import MemberPage from './pages/MemberPage/MemberPage';
import ChairpersonDashboard from './pages/ChairpersonDashboard/ChairpersonDashboard';
import TreasurerDashboard from './pages/TreasurerDashboard/TreasurerDashboard'; // ✅ Add this import

import { UserProvider } from './context/UserContext';

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/chama/:chamaId/member" element={<MemberPage />} />
      <Route path="/chama/:chamaId/chairperson" element={<ChairpersonDashboard />} />
      <Route path="/chama/:chamaId/treasurer" element={<TreasurerDashboard />} /> {/* ✅ Add this line */}
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppWrapper />
      </Router>
    </UserProvider>
  );
}

export default App;

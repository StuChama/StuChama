import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SignupForm from './components/SignUpForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import HomePage from './components/HomePage';

const Dashboard = ({ user }) => (
  user ? <h1>Welcome, {user.full_name}!</h1> : <h2>Please log in first</h2>
);

function AppWrapper() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

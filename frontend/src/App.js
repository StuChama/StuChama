// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboardPage from './pages/UserDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboardPage />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;

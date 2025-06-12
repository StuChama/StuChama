// src/pages/DashboardPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ChamaGrid from '../components/ChamaGrid/ChamaGrid';

function UserDashboardPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onNavigate={(page) => console.log("Go to", page)} />
      <div style={{ flex: 1, background: 'var(--light-beige)', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--black)' }}>MY CHAMAS</h1>
        <ChamaGrid />
      </div>
    </div>
  );
}

export default UserDashboardPage;

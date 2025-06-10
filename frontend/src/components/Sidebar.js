import React from 'react';
import '../App.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://i.pravatar.cc/150?img=1" alt="User" />
      </div>
      <nav>
        <button className="nav-btn">🏠 Home</button>
        <button className="nav-btn">⚙️ Settings</button>
        <button className="nav-btn">🚪 Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;

import React from "react";
import "./userDashboard.css"; // Link to the CSS file

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img
          src="/path/to/profile.jpg"
          alt="User"
          className="profile-pic"
        />
        <nav className="nav-links">
          <button className="nav-button active">
            <span className="material-icons">home</span> HOME
          </button>
          <button className="nav-button">
            <span className="material-icons">settings</span> SETTINGS
          </button>
          <button className="nav-button">
            <span className="material-icons">logout</span> LOGOUT
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <button className="back-button">
          <span className="material-icons">undo</span> BACK
        </button>

        <h1 className="main-title">MY CHAMAS</h1>

        <div className="chamas-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="chama-card"></div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="action-btn">CREATE CHAMA</button>
          <button className="action-btn">JOIN CHAMA</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

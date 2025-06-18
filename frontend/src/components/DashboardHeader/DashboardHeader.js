// src/components/DashboardHeader/DashboardHeader.js
import React from 'react';
import styles from './DashboardHeader.module.css';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../assets/return (1).png'; // ← Back icon image

const DashboardHeader = ({ title, userName }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/'); // 👈 go to homepage
  };
  
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.userGreeting}>
          Welcome, <span className={styles.userName}>{userName}</span>!
        </div>
        
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backIcon} alt="Back" className={styles.backIcon} />
          <span className={styles.backText}>Home</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
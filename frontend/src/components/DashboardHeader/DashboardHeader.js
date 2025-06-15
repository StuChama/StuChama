import React from 'react';
import styles from './DashboardHeader.module.css';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../assets/return (1).png'; // ← Back icon image

const DashboardHeader = ({ title, collapsed, userName}) => {
  const navigate = useNavigate();
   const handleBack = () => {
    navigate('/'); // 👈 go to homepage
  };
  return (
    <header className={`${styles.dashboardHeader} ${collapsed ? styles.collapsed : ''}`}>
      <h1>{title}</h1>
      <div className={styles.userActions}>
          
        <span>Welcome, {userName}!</span>

        <button className={styles.backButton} onClick={handleBack}>
          <img src={backIcon} alt="Back" className={styles.backIcon} />
          <span className={styles.backText}>Back</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;

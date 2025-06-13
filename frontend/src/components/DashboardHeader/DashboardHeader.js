import React from 'react';
import styles from './DashboardHeader.module.css';

const DashboardHeader = ({ title, collapsed, userName }) => {
  return (
    <header className={`${styles.dashboardHeader} ${collapsed ? styles.collapsed : ''}`}>
      <h1>{title}</h1>
      <div className={styles.userActions}>
        <span>Welcome, {userName}!</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
// src/components/DashboardHeader/DashboardHeader.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { FaBell } from 'react-icons/fa'; // 👈 using react-icons
import styles from './DashboardHeader.module.css';
import backIcon from '../../assets/return (1).png';

const DashboardHeader = ({ title, userName }) => {
  const { currentUser } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleBack = () => navigate('/');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/${currentUser?.user_id}`);
        const data = await res.json();
        setNotifications(data || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    if (currentUser?.user_id) {
      fetchNotifications();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.notificationWrapper} ref={dropdownRef}>
          <FaBell className={styles.bellIcon} onClick={() => setShowDropdown(!showDropdown)} />

          {showDropdown && (
            <div className={styles.dropdown}>
              <h4 className={styles.dropdownTitle}>Notifications</h4>
              {notifications.length > 0 ? (
                notifications.map((note, index) => (
                  <div key={index} className={styles.notificationItem}>
                    {note.message}
                  </div>
                ))
              ) : (
                <div className={styles.noNotifications}>No new notifications</div>
              )}
            </div>
          )}
        </div>

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

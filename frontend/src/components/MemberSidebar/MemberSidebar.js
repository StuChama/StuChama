import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MemberSidebar.module.css';

// Import icons from local assets
import profilePic from '../../assets/user.png';
import groupDetailsIcon from '../../assets/details (1).png';
import groupProgressIcon from '../../assets/progress.png';
import fineManagementIcon from '../../assets/fine (1).png';
import logoutIcon from '../../assets/logout1.png';

const MemberSidebar = ({ activeTab, setActiveTab, userName = "Mary Magdalene" }) => {
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    if (key === 'logout') {
      navigate('/');
    } else {
      setActiveTab(key);
    }
  };

  const menuItems = [
    { key: 'groupDetails', label: 'Group Details', icon: groupDetailsIcon },
    { key: 'groupProgress', label: 'Group Progress', icon: groupProgressIcon },
    { key: 'fineManagement', label: 'Fine Management', icon: fineManagementIcon },
    { key: 'logout', label: 'Log Out', icon: logoutIcon },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <img src={profilePic} alt="Profile" className={styles.profileImage} />
        <div className={styles.userName}>{userName}</div>
        <span className={styles.roleLabel}>Member</span>
      </div>
      <div className={styles.menuSection}>
        <ul className={styles.sidebarMenu}>
          {menuItems.map(({ key, label, icon }) => (
            <li
              key={key}
              className={`${styles.menuItem} ${activeTab === key ? styles.active : ''}`}
              onClick={() => handleTabClick(key)}
            >
              <img src={icon} alt={`${label} icon`} className={styles.icon} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberSidebar;

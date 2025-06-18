// src/components/Sidebar/Sidebar.js
import React, { useContext, useState } from 'react'; // Added useState import
import styles from './Sidebar.module.css';
import { UserContext } from '../../context/UserContext';

// Icons - update paths as needed
import homeIcon from '../../assets/black home icon.png';
import settingsIcon from '../../assets/setting (1).png';
import createChamaIcon from '../../assets/add.png';
import joinChamaIcon from '../../assets/user.png';
import logoutIcon from '../../assets/logout.png';
import logoutIconHover from '../../assets/logout1.png';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { currentUser } = useContext(UserContext);
  const [hoveredTab, setHoveredTab] = useState(null);

  const menuItems = [
    { tab: 'home', label: 'Home', icon: homeIcon },
    { tab: 'settings', label: 'Settings', icon: settingsIcon },
    { tab: 'create-chama', label: 'Create Chama', icon: createChamaIcon },
    { tab: 'join-chama', label: 'Join Chama', icon: joinChamaIcon },
  ];

  const handleItemClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* User Profile */}
      <div className={styles.userProfile}>
        <div className={styles.profileImage}>
          <img
            src={currentUser?.profile_picture || 'https://i.pravatar.cc/150?img=1'}
            alt="Profile"
            className={styles.profileIcon}
          />
        </div>

        {!collapsed && currentUser && (
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{currentUser.full_name}</h3>
            <p className={styles.userRole}>Member</p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <div className={styles.sidebarHeader}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* Menu Items */}
      <ul className={styles.sidebarMenu}>
        {menuItems.map(({ tab, label, icon }) => (
          <li
            key={tab}
            className={`${styles.menuItem} ${
              activeTab === tab ? styles.active : ''
            }`}
            onClick={() => handleItemClick(tab)}
            onMouseEnter={() => setHoveredTab(tab)}
            onMouseLeave={() => setHoveredTab(null)}
            title={label}
          >
            <img
              src={icon}
              alt={label}
              className={styles.icon}
            />
            {!collapsed && <span className={styles.label}>{label}</span>}
          </li>
        ))}

        {/* Logout */}
        <li
          className={styles.menuItem}
          onClick={() => setActiveTab('logout')}
          onMouseEnter={() => setHoveredTab('logout')}
          onMouseLeave={() => setHoveredTab(null)}
          title="Logout"
        >
          <img
            src={hoveredTab === 'logout' ? logoutIconHover : logoutIcon}
            alt="Logout"
            className={styles.icon}
          />
          {!collapsed && <span className={styles.label}>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
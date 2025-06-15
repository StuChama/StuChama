import React, { useContext, useState } from 'react';
import styles from './Sidebar.module.css';
import { UserContext } from '../../context/UserContext';

// Icons: default + hover versions
import homeIcon from '../../assets/black home icon.png';
import homeIconHover from '../../assets/black home icon.png';

import settingsIcon from '../../assets/setting.png';
import settingsIconHover from '../../assets/setting (1).png';

import createChamaIcon from '../../assets/add (1).png';
import createChamaIconHover from '../../assets/add.png';

import joinChamaIcon from '../../assets/user (1).png';
import joinChamaIconHover from '../../assets/user.png';

import logoutIcon from '../../assets/logout.png';
import logoutIconHover from '../../assets/logout1.png';

import userIcon from '../../assets/image.png'; // Profile picture

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { currentUser } = useContext(UserContext);
  const [hoveredTab, setHoveredTab] = useState(null);

  const handleItemClick = (tabName) => {
    setActiveTab(tabName);
  };

  const menuItems = [
    {
      tab: 'home',
      label: 'Home',
      defaultIcon: homeIcon,
      hoverIcon: homeIconHover,
    },
    {
      tab: 'settings',
      label: 'Settings',
      defaultIcon: settingsIcon,
      hoverIcon: settingsIconHover,
    },
    {
      tab: 'create-chama',
      label: 'Create Chama',
      defaultIcon: createChamaIcon,
      hoverIcon: createChamaIconHover,
    },
    {
      tab: 'join-chama',
      label: 'Join Chama',
      defaultIcon: joinChamaIcon,
      hoverIcon: joinChamaIconHover,
    },
    {
      tab: 'logout',
      label: 'Logout',
      defaultIcon: logoutIcon,
      hoverIcon: logoutIconHover,
    },
  ];

  const logoutItem = menuItems.find((item) => item.tab === 'logout');
  const otherItems = menuItems.filter((item) => item.tab !== 'logout');

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* User Profile */}
      <div className={styles.userProfile}>
        <div className={styles.profileImage}>
          <img src={userIcon} alt="User" className={styles.profileIcon} />
        </div>

        {!collapsed && currentUser && (
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{currentUser.full_name}</h3>
            <p className={styles.userEmail}>{currentUser.email}</p>
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
        {otherItems.map(({ tab, label, defaultIcon, hoverIcon }) => (
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
              src={hoveredTab === tab ? hoverIcon : defaultIcon}
              alt={label}
              className={styles.icon}
            />
            {!collapsed && <span className={styles.label}>{label}</span>}
          </li>
        ))}

        {/* Logout */}
        {logoutItem && (
          <li
            key={logoutItem.tab}
            className={`${styles.menuItem} ${
              activeTab === logoutItem.tab ? styles.active : ''
            }`}
            onClick={() => handleItemClick(logoutItem.tab)}
            onMouseEnter={() => setHoveredTab(logoutItem.tab)}
            onMouseLeave={() => setHoveredTab(null)}
            title={logoutItem.label}
          >
            <img
              src={
                hoveredTab === logoutItem.tab
                  ? logoutItem.hoverIcon
                  : logoutItem.defaultIcon
              }
              alt={logoutItem.label}
              className={styles.icon}
            />
            {!collapsed && (
              <span className={styles.label}>{logoutItem.label}</span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;

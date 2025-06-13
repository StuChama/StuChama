import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const handleItemClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && <h2>MY CHAMAS</h2>}
        <button 
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      
      <ul className={styles.sidebarMenu}>
        <li 
          className={`${styles.menuItem} ${activeTab === 'home' ? styles.active : ''}`}
          onClick={() => handleItemClick('home')}
        >
          {collapsed ? 'H' : 'HOME'}
        </li>
        
        <li 
          className={`${styles.menuItem} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => handleItemClick('settings')}
        >
          {collapsed ? 'S' : 'SETTINGS'}
        </li>
        
        <li 
          className={`${styles.menuItem} ${activeTab === 'logout' ? styles.active : ''}`}
          onClick={() => handleItemClick('logout')}
        >
          {collapsed ? 'L' : 'LOGOUT'}
        </li>
        
        <li 
          className={`${styles.menuItem} ${activeTab === 'create-chama' ? styles.active : ''}`}
          onClick={() => handleItemClick('create-chama')}
        >
          {collapsed ? 'C' : 'CREATE CHAMA'}
        </li>
        
        <li 
          className={`${styles.menuItem} ${activeTab === 'join-chama' ? styles.active : ''}`}
          onClick={() => handleItemClick('join-chama')}
        >
          {collapsed ? 'J' : 'JOIN CHAMA'}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
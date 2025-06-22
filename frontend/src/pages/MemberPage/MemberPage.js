// src/pages/MemberPage/MemberPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import GroupDetails from '../../components/GroupDetails/GroupDetails';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import MyFines from '../../components/MyFines/MyFines';
import { UserContext } from '../../context/UserContext';
import styles from './MemberPage.module.css';
import { useNavigate } from 'react-router-dom';

// Import icons
import groupIcon from '../../assets/details (1).png';
import progressIcon from '../../assets/roadmap (1).png';
import fineIcon from '../../assets/fine (1).png';
import logoutIcon from '../../assets/logout.png';
import logoutIconHover from '../../assets/logout1.png';

const MemberPage = () => {
  const { chamaId } = useParams();
  const { currentUser, clearToken } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('groupDetails');
  const [chamaData, setChamaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchChamaData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups/${chamaId}`);
        if (!response.ok) throw new Error('Failed to fetch chama data');
        const data = await response.json();
        setChamaData(data);
      } catch (error) {
        console.error('Error fetching chama data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChamaData();
  }, [chamaId]);

  const logout = () => {
    clearToken();
    navigate('/');
  };

  const renderContent = () => {
    if (loading) return <div className={styles.loading}>Loading chama details...</div>;
    if (!chamaData) return <div className={styles.error}>Chama not found</div>;
    
    switch (activeTab) {
      case 'groupDetails':
        return <GroupDetails chamaId={chamaId} />;
      case 'groupProgress':
        return <GroupProgress chamaId={chamaId} />;
      case 'myFines':
        return <MyFines chamaId={chamaId} userId={currentUser.id} />;
      default:
        return <GroupDetails chamaId={chamaId} />;
    }
  };

  const menuItems = [
    {
      tab: 'groupDetails',
      label: 'Group Details',
      icon: groupIcon,
    },
    {
      tab: 'groupProgress',
      label: 'Group Progress',
      icon: progressIcon,
    },
    {
      tab: 'myFines',
      label: 'My Fines',
      icon: fineIcon,
    },
  ];

  return (
    <div className={styles.memberPageContainer}>
      {/* Member Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
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
              onClick={() => setActiveTab(tab)}
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
            onClick={() => (logout())}
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
      </aside>

      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MemberPage;
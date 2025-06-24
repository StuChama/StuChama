import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import GroupDetails from './ChairpersonGroupDetails';
import BackButton from '../../components/BackButton/BackButton';
import Rules from './Rules';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import FineManagement from '../../components/FineManagement/FineManagement';
import MyFines from '../../components/MyFines/MyFines';

// Import icons
import groupIcon from '../../assets/details (1).png';
import progressIcon from '../../assets/roadmap (1).png';
import fineIcon from '../../assets/fine (1).png';
import myFinesIcon from '../../assets/fine (1).png';
import rulesIcon from '../../assets/book (1).png';
import logoutIcon from '../../assets/logout.png';
import logoutIconHover from '../../assets/logout1.png';

import styles from './ChairpersonDashboard.module.css';

const ChairpersonDashboard = () => {
  const { chamaId } = useParams();
  const { currentUser, clearToken } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('GroupDetails');
  const [group, setGroup] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   const fetchGroup = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}`);

      const contentType = res.headers.get('Content-Type');
      if (!res.ok) {
        const errorText = contentType?.includes('application/json')
          ? await res.json()
          : await res.text();
        throw new Error(errorText || 'Failed to fetch group');
      }

      const data = await res.json();
      setGroup(data);
    } catch (err) {
      console.error('Error fetching group:', err.message);
    }
  };

  fetchGroup();
}, [chamaId]);

  const renderContent = () => {
    switch (activeTab) {
      case 'GroupDetails':
        return <GroupDetails chamaId={chamaId} />;
      case 'GroupProgress':
        return <GroupProgress chamaId={chamaId} isChairperson={true} />;
      case 'FineManagement':
        return <FineManagement chamaId={chamaId} />;
      case 'MyFines':
        return <MyFines chamaId={chamaId} userId={currentUser.id} />;
      case 'Rules':
        return <Rules chamaId={chamaId} />;
      default:
        return null;
    }
  };
const logout = () => {
    clearToken();
    navigate('/');
  };
  const menuItems = [
    {
      tab: 'GroupDetails',
      label: 'Group Details',
      icon: groupIcon,
    },
    {
      tab: 'GroupProgress',
      label: 'Group Progress',
      icon: progressIcon,
    },
    {
      tab: 'FineManagement',
      label: 'Fine Management',
      icon: fineIcon,
    },
    {
      tab: 'MyFines',
      label: 'My Fines',
      icon: myFinesIcon,
    },
    {
      tab: 'Rules',
      label: 'Rules',
      icon: rulesIcon,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
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
              <p className={styles.userRole}>Chairperson</p>
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

      <main className={styles.mainPanel}>
        <h2 className={styles.groupTitle}>{group?.group_name}</h2>
        

        <div className={styles.contentWrapper}>
          <BackButton />
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ChairpersonDashboard;
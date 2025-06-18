import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';


import GroupDetails from './ChairpersonGroupDetails';
import Rules from './Rules';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import FineManagement from '../../components/FineManagement/FineManagement';
import MyFines from '../../components/MyFines/MyFines';

import styles from './ChairpersonDashboard.module.css';

const ChairpersonDashboard = () => {
  const { chamaId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('GroupDetails');
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:3001/groups/${chamaId}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error('Error fetching group:', err);
      }
    };

    fetchGroup();
  }, [chamaId]);

  const renderContent = () => {
    switch (activeTab) {
      case 'GroupDetails':
        return <GroupDetails chamaId={chamaId} />;
      case 'GroupProgress':
        return <GroupProgress chamaId={chamaId} />;
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

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <img
            src={currentUser?.profile_picture || 'https://i.pravatar.cc/150?img=1'}
            alt="Profile"
            className={styles.profileImage}
          />
          <h3>{currentUser?.full_name}</h3>
          <p>Chairperson</p>
        </div>
        <nav className={styles.nav}>
          <button onClick={() => setActiveTab('GroupDetails')} className={activeTab === 'GroupDetails' ? styles.active : ''}>Group Details</button>
          <button onClick={() => setActiveTab('GroupProgress')} className={activeTab === 'GroupProgress' ? styles.active : ''}>Group Progress</button>
          <button onClick={() => setActiveTab('FineManagement')} className={activeTab === 'FineManagement' ? styles.active : ''}>Fine Management</button>
          <button onClick={() => setActiveTab('MyFines')} className={activeTab === 'MyFines' ? styles.active : ''}>My Fines</button>
          <button onClick={() => setActiveTab('Rules')} className={activeTab === 'Rules' ? styles.active : ''}>Rules</button>
          <button onClick={() => window.location.href = '/'} className={styles.logoutButton}>Log Out</button>
        </nav>
      </aside>

      <main className={styles.mainPanel}>
        <h2>{group?.group_name}</h2>
        {renderContent()}
      </main>
    </div>
  );
};

export default ChairpersonDashboard;
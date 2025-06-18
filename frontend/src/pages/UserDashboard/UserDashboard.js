// src/pages/UserDashboard/UserDashboard.js

import React, { useState, useEffect , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import ChamaGrid from '../../components/ChamaGrid/ChamaGrid';
import CreateChamaModal from '../../components/CreateChamaModal/CreateChamaModal';
import JoinChamaModal from '../../components/JoinChamaModal/JoinChamaModal';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { currentUser, clearToken } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserChamas = async () => {
      try {
        setLoading(true);
        const groupsRes = await fetch('http://localhost:3001/groups');
        if (!groupsRes.ok) throw new Error('Failed to fetch groups');
        const groups = await groupsRes.json();

        const userChamas = [];

        for (const group of groups) {
          const membershipRes = await fetch(
            `http://localhost:3001/group_members?group_id=${group.id}&user_id=${currentUser.user_id}`
          );

          if (!membershipRes.ok) {
            console.warn(`Failed to fetch membership for group ${group.id}`);
            continue;
          }

          const membership = await membershipRes.json();

          if (membership.length > 0) {
            userChamas.push({
              ...group,
              userRole: membership[0].role
            });
          }
        }

        setChamas(userChamas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChamas();
  }, [currentUser, showCreateModal, showJoinModal]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create-chama') setShowCreateModal(true);
    else if (tab === 'join-chama') setShowJoinModal(true);
    else if (tab === 'logout') logout();
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Dashboard';
      case 'settings': return 'Settings';
      case 'create-chama': return 'Create New Chama';
      case 'join-chama': return 'Join a Chama';
      default: return 'Dashboard';
    }
  };

  const handleCreateChama = async (chamaData) => {
    try {
      const res = await fetch('http://localhost:3001/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: chamaData.name,
          description: chamaData.description,
          created_by: currentUser.user_id,
          created_at: new Date().toISOString(),
          group_code: `CHA${Math.floor(1000 + Math.random() * 9000)}`
        })
      });

      if (!res.ok) throw new Error('Failed to create chama');
      const newGroup = await res.json();

      await fetch('http://localhost:3001/group_members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          group_id: newGroup.id,
          role: 'Chairperson',
          joined_at: new Date().toISOString()
        })
      });

      setShowCreateModal(false);
      setActiveTab('home');
    } catch (err) {
      console.error('Error creating chama:', err);
    }
  };

  const handleJoinChama = async (joinData) => {
    try {
      const chamaRes = await fetch(`http://localhost:3001/groups?group_code=${joinData.code}`);
      if (!chamaRes.ok) throw new Error('Failed to find chama');
      const chamas = await chamaRes.json();

      if (chamas.length === 0) {
        throw new Error('No chama found with that code');
      }

      const chama = chamas[0];

      await fetch('http://localhost:3001/group_members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          group_id: chama.id,
          role: 'Member',
          joined_at: new Date().toISOString()
        })
      });

      setShowJoinModal(false);
      setActiveTab('home');
    } catch (err) {
      console.error('Error joining chama:', err);
      alert(err.message);
    }
  };

  const handleChamaClick = (chama) => {
    if (chama.userRole === 'Chairperson') {
      navigate(`/chama/${chama.id}/chairperson`);
    } else if (chama.userRole === 'Treasurer') {
      navigate(`/chama/${chama.id}/treasurer`);
    } else {
      navigate(`/chama/${chama.id}/member`);
    }
  };

  const logout = () => {
    clearToken();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className={styles.loadingContainer}>
        <p>Please log in to view this page</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={styles.dashboardContent}>
        <DashboardHeader
          title={getPageTitle()}
          collapsed={collapsed}
          userName={currentUser.full_name}
        />

        <main className={styles.mainContent}>
          {activeTab === 'home' && (
            <>
              {loading && <div className={styles.loadingContainer}><p>Loading your chamas...</p></div>}
              {!loading && error && <div className={styles.errorContainer}><p>Error: {error}</p></div>}
              {!loading && !error && (
                <ChamaGrid chamas={chamas} onChamaClick={handleChamaClick} />
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsPage}>
              <h2>Account Settings</h2>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <img
                    src={currentUser.profile_picture || 'https://i.pravatar.cc/150?img=3'}
                    alt="User avatar"
                  />
                </div>
                <div className={styles.userDetails}>
                  <h3>{currentUser.full_name}</h3>
                  <p>{currentUser.email}</p>
                  <p>{currentUser.phone_number}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateChamaModal
          onClose={() => {
            setShowCreateModal(false);
            setActiveTab('home');
          }}
          onCreate={handleCreateChama}
        />
      )}

      {showJoinModal && (
        <JoinChamaModal
          onClose={() => {
            setShowJoinModal(false);
            setActiveTab('home');
          }}
          onJoin={handleJoinChama}
        />
      )}
    </div>
  );
};

export default UserDashboard;

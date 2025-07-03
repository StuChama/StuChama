// src/pages/UserDashboard/UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import ChamaGrid from '../../components/ChamaGrid/ChamaGrid';
import CreateChamaModal from '../../components/CreateChamaModal/CreateChamaModal';
import JoinChamaModal from '../../components/JoinChamaModal/JoinChamaModal';
import styles from './UserDashboard.module.css';
import {
  fetchGroups,
  fetchUserMembership,
  createGroup,
  joinGroup
} from '../../services/chamaService';

const UserDashboard = () => {
  const { currentUser, clearToken } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  });
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser) {
      setEditedUser({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || ''
      });
    }

    const fetchUserChamas = async () => {
      try {
        setLoading(true);
        const groups = await fetchGroups();
        const userChamas = [];

        for (const group of groups) {
          const membership = await fetchUserMembership(group.group_id, currentUser.user_id);
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

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    setIsProfileUpdating(true);
    setProfileUpdateError('');

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${currentUser.user_id}/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedUser)
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        window.location.reload();
      } else {
        setProfileUpdateError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileUpdateError('Network error. Please try again.');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleCreateChama = async (chamaData) => {
    try {
      await createGroup({
        group_name: chamaData.name,
        description: chamaData.description,
        created_by: currentUser.user_id
      });

      setShowCreateModal(false);
      setActiveTab('home');
    } catch (err) {
      alert('Error creating chama');
    }
  };
  const handleJoinChama = async (joinData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups?group_code=${joinData.code}`);
      if (!res.ok) throw new Error('Failed to find chama with that code');
      const found = await res.json();
      if (found.length === 0) throw new Error('No chama matches the code');

      await joinGroup({
        user_id: currentUser.user_id,
        group_id: found[0].group_id,
        role: 'Member'
      });

      setShowJoinModal(false);
      setActiveTab('home');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create-chama') setShowCreateModal(true);
    else if (tab === 'join-chama') setShowJoinModal(true);
    else if (tab === 'logout') logout();
  };

  const handleChamaClick = (chama) => {
    if (chama.userRole === 'Chairperson') {
      navigate(`/chama/${chama.group_id}/chairperson`);
    } else if (chama.userRole === 'Treasurer') {
      navigate(`/chama/${chama.group_id}/treasurer`);
    } else {
      navigate(`/chama/${chama.group_id}/member`);
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
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`${styles.dashboardContent} ${collapsed ? styles.collapsed : ''}`}>
        <DashboardHeader title="Dashboard" userName={currentUser.full_name} />
        <main className={styles.mainContent}>
          {activeTab === 'home' && (
            <>
              {loading ? (
                <div className={styles.loadingContainer}><p>Loading your chamas...</p></div>
              ) : error ? (
                <div className={styles.errorContainer}><p>Error: {error}</p></div>
              ) : (
                <ChamaGrid chamas={chamas} onChamaClick={handleChamaClick} />
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsPage}>
              <div className={styles.settingsHeader}>
                <h2 className={styles.settingsTitle}>Account Settings</h2>
                <div className={styles.settingsUnderline}></div>
              </div>

              <div className={styles.userProfileSection}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarWrapper}>
                    <img src={currentUser.profile_picture || 'https://i.pravatar.cc/150?img=2'} alt="User avatar" className={styles.userAvatar} />
                    <div className={styles.avatarOverlay}><span className={styles.avatarText}>Change</span></div>
                  </div>
                </div>
                <div className={styles.userDetails}>
                  {isEditing ? (
                    <div className={styles.editForm}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" value={editedUser.full_name} onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })} className={styles.editInput} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} className={styles.editInput} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input type="tel" value={editedUser.phone_number} onChange={(e) => setEditedUser({ ...editedUser, phone_number: e.target.value })} className={styles.editInput} />
                      </div>
                      {profileUpdateError && <div className={styles.errorMessage}>{profileUpdateError}</div>}
                      <div className={styles.editActions}>
                        <button type="button" className={styles.saveButton} onClick={handleUpdateProfile} disabled={isProfileUpdating}>
                          {isProfileUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className={styles.cancelEditButton} onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={styles.userName}>{currentUser.full_name}</h3>
                      <p className={styles.userEmail}>{currentUser.email}</p>
                      <p className={styles.userPhone}>{currentUser.phone_number || 'No phone number'}</p>
                      <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.uploadCard}>
                <h3 className={styles.uploadTitle}>Update Profile Picture</h3>
                <p className={styles.uploadSubtitle}>Upload a JPEG, PNG, or GIF file (max 2MB)</p>
                <form className={styles.uploadForm} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData();
                  formData.append('profile_picture', e.target.profile_picture.files[0]);
                  try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${currentUser.user_id}/profile-picture`, {
                      method: 'PUT',
                      body: formData
                    });
                    if (res.ok) {
                      alert('Profile picture updated successfully!');
                      window.location.reload();
                    } else {
                      alert('Upload failed. Please try again.');
                    }
                  } catch (err) {
                    alert('Something went wrong. Please try again.');
                  }
                }}>
                  <div className={styles.uploadArea}>
                    <label htmlFor="profile_picture" className={styles.uploadLabel}>
                      <div className={styles.uploadIcon}>📁</div>
                      <div className={styles.uploadText}>
                        <span className={styles.browseText}>Click to browse</span>
                        <span className={styles.dragText}>or drag & drop files</span>
                      </div>
                    </label>
                    <input type="file" name="profile_picture" id="profile_picture" accept="image/*" className={styles.uploadInput} required />
                  </div>
                  <div className={styles.uploadActions}>
                    <button type="submit" className={styles.uploadButton}>Upload Image</button>
                    <button type="button" className={styles.cancelButton} onClick={() => document.getElementById('profile_picture').value = ''}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      {showCreateModal && <CreateChamaModal onClose={() => { setShowCreateModal(false); setActiveTab('home'); }} onCreate={handleCreateChama} />}
      {showJoinModal && <JoinChamaModal onClose={() => { setShowJoinModal(false); setActiveTab('home'); }} onJoin={handleJoinChama} />}
    </div>
  );
};

export default UserDashboard;

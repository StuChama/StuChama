import React, { useEffect, useState } from 'react';
import styles from './ChairpersonGroupDetails.module.css';

const ChairpersonGroupDetails = ({ chamaId }) => {
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const groupRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}`);
        if (!groupRes.ok) throw new Error('Failed to fetch group details');
        const groupData = await groupRes.json();
        setGroupDetails(groupData);

        const membersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/members`);
        if (!membersRes.ok) throw new Error('Failed to fetch members');
        const membersData = await membersRes.json();

        setMembers(membersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chamaId]);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) {
      alert('Please enter both name and role');
      return;
    }

    try {
      const searchRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/search?name=${encodeURIComponent(newMember.name)}`);
      const users = await searchRes.json();
      if (!users.length) throw new Error('User not found');

      const userId = users[0].user_id;

      const addRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, group_id: chamaId, role: newMember.role })
      });

      if (!addRes.ok) throw new Error('Failed to add member');

      const added = await addRes.json();
      setMembers(prev => [...prev, { ...added, full_name: newMember.name }]);
      setNewMember({ name: '', role: '' });
      setIsAddingMember(false);
    } catch (err) {
      console.error('Error adding member:', err);
      alert(err.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove member');

      setMembers((prev) => prev.filter((m) => m.user_id !== memberId));
    } catch (err) {
      console.error('Error removing member:', err);
      alert('Failed to remove member');
    }
  };

  const handleAppointTreasurer = async (memberId) => {
    if (!window.confirm('Are you sure you want to appoint this member as treasurer?')) return;

    try {
      const existingTreasurer = members.find((m) => m.role === 'Treasurer');

      if (existingTreasurer) {
        const demoteRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/members/${existingTreasurer.user_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'Member', group_id: chamaId }),
        });

        if (!demoteRes.ok) throw new Error('Failed to demote existing treasurer');
      }

      const promoteRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Treasurer', group_id: chamaId }),
      });

      if (!promoteRes.ok) throw new Error('Failed to appoint treasurer');

      setMembers(prev => prev.map(m => {
        if (m.user_id === memberId) return { ...m, role: 'Treasurer' };
        if (m.role === 'Treasurer') return { ...m, role: 'Member' };
        return m;
      }));
    } catch (err) {
      console.error('Error appointing treasurer:', err);
      alert('Failed to appoint treasurer');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading group details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Group Details</h2>
        <div className={styles.titleUnderline}></div>
      </div>

      {groupDetails && (
        <div className={styles.groupInfoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Group Name:</span>
            <span className={styles.infoValue}>{groupDetails.group_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Description:</span>
            <span className={styles.infoValue}>{groupDetails.description}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Members Count:</span>
            <span className={styles.infoValue}>{members.length}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Group Code:</span>
            <span className={styles.infoCode}>{groupDetails.group_code}</span>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Members</h3>
          <button 
            className={styles.addMemberButton}
            onClick={() => setIsAddingMember(!isAddingMember)}
          >
            {isAddingMember ? 'Cancel' : '+ Add Member'}
          </button>
        </div>

        {isAddingMember && (
          <div className={styles.addMemberCard}>
            <h4 className={styles.addMemberTitle}>Add New Member</h4>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Role</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className={styles.inputField}
              >
                <option value="">Select Role</option>
                <option value="Member">Member</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Secretary">Secretary</option>
              </select>
            </div>
            <button 
              className={styles.addButton} 
              onClick={handleAddMember}
              disabled={!newMember.full_name || !newMember.role}
            >
              Add to Group
            </button>
          </div>
        )}

        <div className={styles.memberGrid}>
          

          {members.map((member) => (
            <div key={member.user_id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInitial}>
                  {member.full_name.charAt(0)}
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{member.full_name}</span>
                  <span className={member.role === 'Treasurer' ? styles.treasurerRole : styles.memberRole}>
                    {member.role}
                  </span>
                </div>
              </div>

              <div className={styles.memberActions}>
                {member.role !== 'Treasurer' && member.role !== 'Chairperson' && (
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleAppointTreasurer(member.user_id)}
                  >
                    Appoint Treasurer
                  </button>
                )}
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveMember(member.user_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChairpersonGroupDetails;

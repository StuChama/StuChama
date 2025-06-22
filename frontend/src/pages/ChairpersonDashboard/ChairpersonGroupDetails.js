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
        // Fetch group details
        const groupRes = await fetch(`http://localhost:3001/groups/${chamaId}`);
        if (!groupRes.ok) throw new Error('Failed to fetch group details');
        const groupData = await groupRes.json();
        setGroupDetails(groupData);

        // Fetch group members
        const membersRes = await fetch(`http://localhost:3001/group_members?group_id=${chamaId}`);
        if (!membersRes.ok) throw new Error('Failed to fetch members');
        const membersData = await membersRes.json();

        // Fetch related users
        const userIds = membersData.map((m) => m.user_id);
        const usersRes = await fetch(`http://localhost:3001/users?id=${userIds.join('&id=')}`);
        if (!usersRes.ok) throw new Error('Failed to fetch user details');
        const usersData = await usersRes.json();

        const userMap = new Map(usersData.map((u) => [u.id, u.full_name]));

        const detailed = membersData.map((m) => ({
          ...m,
          name: userMap.get(m.user_id) || 'Unknown',
        }));

        setMembers(detailed);
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

    // Here you'd normally search for an existing user and use their `user_id`
    // For now, simulate it by creating a new user (if necessary) or skipping this step
    alert('This feature needs backend integration with user lookup');
    setIsAddingMember(false);
    setNewMember({ name: '', role: '' });
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/group_members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        throw new Error('Failed to remove member');
      }
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
        const demoteRes = await fetch(`http://localhost:3001/group_members/${existingTreasurer.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'Member' }),
        });

        if (!demoteRes.ok) throw new Error('Failed to demote existing treasurer');
      }

      const promoteRes = await fetch(`http://localhost:3001/group_members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Treasurer' }),
      });

      if (!promoteRes.ok) throw new Error('Failed to appoint treasurer');

      // Update local state
      setMembers(prev => prev.map(m => {
        if (m.id === memberId) return {...m, role: 'Treasurer'};
        if (m.role === 'Treasurer') return {...m, role: 'Member'};
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
              disabled={!newMember.name || !newMember.role}
            >
              Add to Group
            </button>
          </div>
        )}

        <div className={styles.memberGrid}>
          {members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInitial}>
                  {member.name.charAt(0)}
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{member.name}</span>
                  <span className={member.role === 'Treasurer' ? styles.treasurerRole : styles.memberRole}>
                    {member.role}
                  </span>
                </div>
              </div>
              
              <div className={styles.memberActions}>
                {member.role !== 'Treasurer' && member.role !== 'Chairperson' && (
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleAppointTreasurer(member.id)}
                  >
                    Appoint Treasurer
                  </button>
                )}
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveMember(member.id)}
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
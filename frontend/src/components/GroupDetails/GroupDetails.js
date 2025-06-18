import React, { useEffect, useState } from 'react';
import styles from './GroupDetails.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../BackButton/BackButton';

const GroupDetails = () => {
  const { chamaId } = useParams();
  const [group, setGroup] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  const handleLeaveChama = () => {
    if (window.confirm('Are you sure you want to leave the group? This action cannot be undone.')) {
      alert('You have left the group.');
      // Implement PATCH or DELETE logic to remove user from group_members
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Fetch group details
        const groupRes = await axios.get(`http://localhost:3001/groups/${chamaId}`);
        
        // Fetch rules
        const rulesRes = await axios.get(`http://localhost:3001/rules?group_id=${chamaId}`);
        
        // Fetch group members
        const membersRes = await axios.get(`http://localhost:3001/group_members?group_id=${chamaId}`);
        
        // Fetch user details for each member
        const userIds = membersRes.data.map(member => member.user_id);
        const usersRes = await axios.get(`http://localhost:3001/users?id=${userIds.join('&id=')}`);
        
        // Create a user map for quick lookup
        const userMap = new Map();
        usersRes.data.forEach(user => {
          userMap.set(user.id, user);
        });
        
        // Combine member data with user details
        const membersWithDetails = membersRes.data.map(member => ({
          id: member.id,
          userId: member.user_id,
          role: member.role,
          name: userMap.get(member.user_id)?.full_name || 'Unknown Member',
          joinedAt: member.joined_at
        }));

        setGroup(groupRes.data);
        setRules(rulesRes.data);
        setMembers(membersWithDetails);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('Failed to load group details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [chamaId]);

  if (loading) return <div className={styles.loading}>Loading group information...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!group) return <div className={styles.error}>No group found.</div>;

  return (
    <div className={styles.container}>
      <BackButton onClick={handleBack} />

      <h2 className={styles.groupName}>{group.group_name}</h2>
      <p className={styles.groupCode}>Group Code: {group.group_code}</p>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Description</h3>
          <p className={styles.cardContent}>{group.description || 'No description available'}</p>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Members</h3>
          <div className={styles.membersList}>
            {members.length === 0 ? (
              <p>No members found</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className={styles.memberItem}>
                  <div className={styles.memberAvatar}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Group Rules</h3>
          {rules.length === 0 ? (
            <p className={styles.noRules}>No rules added yet.</p>
          ) : (
            <ul className={styles.rulesList}>
              {rules.map((rule) => (
                <li key={rule.id} className={styles.ruleItem}>
                  <div className={styles.ruleBullet}></div>
                  <span>{rule.rule_description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleLeaveChama} className={styles.leaveButton}>
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;
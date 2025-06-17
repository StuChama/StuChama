import React, { useEffect, useState } from 'react';
import styles from './GroupDetails.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../BackButton/BackButton';

const GroupDetails = () => {
  const { chamaId } = useParams(); // chamaId is actually group_id
  const [group, setGroup] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  const handleLeaveChama = () => {
    if (window.confirm('Are you sure you want to leave the group?')) {
      alert('You have left the group.');
      // Implement PATCH or DELETE logic to remove user from group_members
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupRes = await axios.get(`http://localhost:3001/groups/${chamaId}`);
        const rulesRes = await axios.get(`http://localhost:3001/rules?group_id=${chamaId}`);

        setGroup(groupRes.data);
        setRules(rulesRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load group details.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [chamaId]);

  if (loading) return <p>Loading group info...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>No group found.</p>;

  return (
    <div className={styles.container}>
      <BackButton onClick={handleBack} />

      <h2 className={styles.groupName}>{group.group_name}</h2>

      <div className={styles.infoBox}>
        <h3>Description</h3>
        <p>{group.description}</p>
      </div>

      <div className={styles.infoBox}>
        <h3>Group Code</h3>
        <p>{group.group_code}</p>
      </div>

      <div className={styles.infoBox}>
        <h3>Rules</h3>
        {rules.length === 0 ? (
          <p>No rules added yet.</p>
        ) : (
          <ul>
            {rules.map((rule) => (
              <li key={rule.id}>{rule.rule_description}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.leaveContainer}>
        <button onClick={handleLeaveChama} className={styles.leaveButton}>
          Leave Chama
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;

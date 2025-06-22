import React, { useState, useEffect, useContext } from 'react';
import styles from './GroupProgress.module.css';

import ContributionButton from '../ContributionButton/ContributionButton';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router-dom';

const GroupProgress = () => {
  const { chamaId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [group, setGroup] = useState(null);
  const [goal, setGoal] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [allContributions, setAllContributions] = useState([]);
  const [showContribution, setShowContribution] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Group info
        const groupRes = await fetch(`http://localhost:3001/groups/${chamaId}`);
        const groupData = await groupRes.json();

        // 2. Goal info for the group
        const goalRes = await fetch(`http://localhost:3001/goals?group_id=${chamaId}`);
        const [goalData] = await goalRes.json();
        

        // 3. User's contributions to that goal
        const contribRes = await fetch(`http://localhost:3001/contributions?goal_id=${goalData?.id}&user_id=${currentUser.user_id}`);
        const contribList = await contribRes.json();
        

        const allContribRes = await fetch(`http://localhost:3001/contributions?goal_id=${goalData?.id}`);
        const allContribList = await allContribRes.json();
        setAllContributions(allContribList);

        setGroup(groupData);
        setGoal(goalData);
        setContributions(contribList);
      } catch (err) {
        console.error('Error loading group progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chamaId, currentUser]);

  if (loading) return <div className={styles.loading}>Loading progress data...</div>;
  if (!group) return <div className={styles.error}>Group not found</div>;

  const totalGroupContribution = allContributions.reduce((sum, c) => sum + c.amount, 0);
  const progressPercent = goal ? Math.min(100, Math.round((totalGroupContribution / goal.target_amount) * 100)) : 0;

  return (
    <div className={styles.groupProgressContainer}>
      

      <div className={styles.header}>
        <h2 className={styles.groupName}>{group.group_name}</h2>
        <p className={styles.subtitle}>CHAMA GOAL PROGRESS</p>
        
        {goal && (
          <div className={styles.progressInfo}>
            <div className={styles.amounts}>
              <span className={styles.currentAmount}>KES {totalGroupContribution.toLocaleString()}</span>
              <span className={styles.targetAmount}>/ KES {goal.target_amount.toLocaleString()}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              >
                <div className={styles.progressLabel}>{progressPercent}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          {goal && (
            <>
              <div className={styles.cardSection}>
                <h3 className={styles.cardTitle}>Deadline</h3>
                <p className={styles.cardValue}>{new Date(goal.deadline).toLocaleDateString()}</p>
              </div>
              
              <div className={styles.cardSection}>
                <h3 className={styles.cardTitle}>Next Payment</h3>
                <p className={styles.cardValue}>–</p>
              </div>
              
              <div className={styles.cardSection}>
                <h3 className={styles.cardTitle}>Amount Due</h3>
                <p className={styles.cardValue}>KES {(goal.target_amount / 10).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.paymentTitle}>Payment History</h3>
          {contributions.length > 0 ? (
            <ul className={styles.historyList}>
              {contributions.map((c) => (
                <li key={c.id} className={styles.historyItem}>
                  <span className={styles.historyDate}>{new Date(c.contributed_at).toLocaleDateString()}</span>
                  <span className={styles.historyAmount}>KES {c.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noRecords}>No payment records available</p>
          )}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.contributeButton} onClick={() => setShowContribution(true)}>
          Contribute to Goal
        </button>
      </div>

      {showContribution && <ContributionButton onClose={() => setShowContribution(false)} goalId={goal?.id} />}
    </div>
  );
};

export default GroupProgress;
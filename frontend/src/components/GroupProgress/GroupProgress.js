import React, { useState, useEffect, useContext } from 'react';
import styles from './GroupProgress.module.css';
import ContributionButton from '../ContributionButton/ContributionButton';
import { UserContext } from '../../context/UserContext';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const GroupProgress = ({ chamaId, isChairperson }) => {
  const { currentUser } = useContext(UserContext);
  const [group, setGroup] = useState(null);
  const [goal, setGoal] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [allContributions, setAllContributions] = useState([]);
  const [showContribution, setShowContribution] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState({ target_amount: '', deadline: '' });

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const groupRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}`);
        const groupData = await groupRes.json();
        setGroup(groupData);

        const goalRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/goals?group_id=${chamaId}`);
        const goalJson = await goalRes.json();
        const goalData = Array.isArray(goalJson) && goalJson.length > 0 ? goalJson[0] : null;
        setGoal(goalData);
        if (goalData) setEditGoal(goalData);

        if (goalData?.goal_id) {
          const contribRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/contributions?goal_id=${goalData.goal_id}&user_id=${currentUser.user_id}`
          );
          const contribList = await contribRes.json();
          setContributions(Array.isArray(contribList) ? contribList : []);

          const allContribRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/contributions?goal_id=${goalData.goal_id}`
          );
          const allContribList = await allContribRes.json();
          setAllContributions(Array.isArray(allContribList) ? allContribList : []);
        } else {
          setContributions([]);
          setAllContributions([]);
        }
      } catch (err) {
        console.error('Error loading group progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chamaId, currentUser]);

  const handleDeleteGoal = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this goal? This cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals/${goal.goal_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete goal');

      setGoal(null);
      setEditGoal({ target_amount: '', deadline: '' });
      setContributions([]);
      setAllContributions([]);
      setIsEditing(false);
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const method = goal ? 'PATCH' : 'POST';
      const url = goal
        ? `${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals/${goal.goal_id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: chamaId,
          target_amount: editGoal.target_amount,
          deadline: editGoal.deadline,
          goal_name: group?.group_name || 'Unnamed Goal',
        }),
      });

      if (!res.ok) throw new Error('Failed to save goal');

      const updatedGoal = await res.json();
      setGoal(updatedGoal);
      setEditGoal(updatedGoal);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving goal:', err);
      alert('Failed to save goal');
    }
  };

  const totalGroupContribution = Array.isArray(allContributions)
    ? allContributions.reduce((sum, c) => sum + Number(c.amount), 0)
    : 0;

  const progressPercent = goal
    ? Math.min(100, Math.round((totalGroupContribution / Number(goal.target_amount)) * 100))
    : 0;

  if (loading) return <div className={styles.loading}>Loading progress data...</div>;
  if (!group) return <div className={styles.error}>Group not found</div>;

  return (
    <div className={styles.groupProgressContainer}>
      <div className={styles.header}>
        <h2 className={styles.groupName}>{group.group_name}</h2>
        <p className={styles.subtitle}>CHAMA GOAL PROGRESS</p>

        {goal && (
          <div className={styles.progressInfo}>
            <div className={styles.amounts}>
              <span className={styles.currentAmount}>
                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(totalGroupContribution)}
              </span>
              <span className={styles.targetAmount}>
                / {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(Number(goal.target_amount))}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}>
                <div className={styles.progressLabel}>{progressPercent}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          {goal ? (
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
                <p className={styles.cardValue}>
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(goal.target_amount / 10)}
                </p>
              </div>
            </>
          ) : (
            <div className={styles.noGoal}>
              <div className={styles.noGoalIcon}>🎯</div>
              <p className={styles.noGoalText}>No goal set for this group yet.</p>
              {isChairperson && <p className={styles.addPrompt}>Add a goal using the form below</p>}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.paymentTitle}>Payment History</h3>
          {Array.isArray(contributions) && contributions.length > 0 ? (
            <ul className={styles.historyList}>
              {contributions.map((c) => (
                <li key={c.id} className={styles.historyItem}>
                  <span className={styles.historyDate}>{new Date(c.contributed_at).toLocaleDateString()}</span>
                  <span className={styles.historyAmount}>
                    {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(Number(c.amount))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noRecords}>No payment records available</p>
          )}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.contributeButton}
          onClick={() => setShowContribution(true)}
          disabled={!goal}
        >
          Contribute to Goal
        </button>
      </div>

      {showContribution && goal && (
        <ContributionButton onClose={() => setShowContribution(false)} groupId={chamaId} goalId={goal.goal_id} />
      )}

      {isChairperson && (
        <div className={styles.goalManagement}>
          <div className={styles.goalManagementHeader}>
            <h3>{goal ? 'Manage Group Goal' : 'Create Group Goal'}</h3>
            {goal && !isEditing && (
              <div className={styles.goalActions}>
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Goal
                </button>
                <button className={styles.deleteButton} onClick={handleDeleteGoal}>
                  <FaTrash /> Delete Goal
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateGoal} className={styles.goalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="target_amount">Target Amount (KES)</label>
                <input
                  type="number"
                  id="target_amount"
                  value={editGoal.target_amount}
                  onChange={(e) => setEditGoal({ ...editGoal, target_amount: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  value={editGoal.deadline ? editGoal.deadline.slice(0, 10) : ''}
                  onChange={(e) => setEditGoal({ ...editGoal, deadline: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> {goal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          ) : !goal && !isEditing ? (
            <div className={styles.addGoalPrompt}>
              <p>Your group doesn't have a goal yet. Create one to track progress.</p>
              <button className={styles.addGoalButton} onClick={() => setIsEditing(true)}>
                Create Group Goal
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GroupProgress;

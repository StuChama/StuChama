// src/components/GroupProgress/GroupProgress.js

import React, { useState, useEffect, useContext } from 'react';
import styles from './GroupProgress.module.css';
import ContributionButton from '../ContributionButton/ContributionButton';
import { UserContext } from '../../context/UserContext';
import { getPaymentSchedule } from '../../services/chamaService';
import { FaEdit, FaTrash, FaSave, FaTimes,FaBell, FaInfoCircle } from 'react-icons/fa';

const GroupProgress = ({ chamaId, isChairperson }) => {
  const { currentUser } = useContext(UserContext);

  const [group, setGroup]                 = useState(null);
  const [goal, setGoal]                   = useState(null);
  const [contributions, setContributions] = useState([]);
  const [allContributions, setAllContributions] = useState([]);
  const [showContribution, setShowContribution] = useState(false);
  const [loading, setLoading]             = useState(true);

  const [isEditing, setIsEditing]         = useState(false);
  const [editGoal, setEditGoal]           = useState({ target_amount: '', deadline: '' });

  const [schedule, setSchedule]           = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  // ─── Fetch group, goal & contributions ──────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Group
        const gRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}`);
        const gJson = await gRes.json();
        setGroup(gJson);

        // Goal
        const goalRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/goals?group_id=${chamaId}`);
        const goalArr = await goalRes.json();
        const goalObj = Array.isArray(goalArr) && goalArr.length > 0 ? goalArr[0] : null;
        setGoal(goalObj);
        if (goalObj) setEditGoal(goalObj);

        // Contributions (self and all)
        if (goalObj?.goal_id) {
          const [selfRes, allRes] = await Promise.all([
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/contributions?goal_id=${goalObj.goal_id}&user_id=${currentUser.user_id}`),
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/contributions?goal_id=${goalObj.goal_id}`)
          ]);
          const selfData = await selfRes.json();
          const allData  = await allRes.json();
          setContributions(Array.isArray(selfData) ? selfData : []);
          setAllContributions(Array.isArray(allData) ? allData : []);
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

  // ─── Fetch payment schedule once the goal is loaded ────────────────────────
  useEffect(() => {
    if (!goal) return;
    setLoadingSchedule(true);
    getPaymentSchedule(chamaId)
      .then(plan => setSchedule(plan))
      .catch(err => console.error(err))
      .finally(() => setLoadingSchedule(false));
  }, [goal, chamaId]);

  const nextSlot = schedule.find(slot => new Date(slot.due_date) > new Date());

  // ─── Goal management handlers ─────────────────────────────────────────────
  const handleDeleteGoal = async () => {
    if (!window.confirm('Are you sure you want to delete this goal? This cannot be undone.')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals/${goal.goal_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setGoal(null);
      setEditGoal({ target_amount: '', deadline: '' });
      setContributions([]);
      setAllContributions([]);
      setIsEditing(false);
    } catch {
      alert('Failed to delete goal');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const method = goal ? 'PATCH' : 'POST';
      const url    = goal
        ? `${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals/${goal.goal_id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/chamas/goals`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: chamaId,
          target_amount: editGoal.target_amount,
          deadline: editGoal.deadline,
          goal_name: group?.group_name || 'Unnamed Goal',
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setGoal(updated);
      setEditGoal(updated);
      setIsEditing(false);
    } catch {
      alert('Failed to save goal');
    }
  };

  // ─── Progress calculations ────────────────────────────────────────────────
  const totalGroupContribution = allContributions.reduce((sum, c) => sum + Number(c.amount), 0);
  const progressPercent = goal
    ? Math.min(100, Math.round((totalGroupContribution / Number(goal.target_amount)) * 100))
    : 0;

  if (loading) return <div className={styles.loading}>Loading progress data...</div>;
  if (!group)  return <div className={styles.error}>Group not found</div>;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.groupProgressContainer}>
      {/* Header & progress bar */}
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

      {/* Cards for schedule or no-goal and payment history */}
      <div className={styles.cardsContainer}>
        {/* Schedule / No Goal */}
        <div className={styles.card}>
        {goal ? (
          <div className={styles.scheduleSection}>
            <div className={styles.scheduleHeader}>
              <h3>Payment Schedule</h3>
              <div className={styles.scheduleNotice}>
                <FaInfoCircle /> View upcoming payment dates
              </div>
            </div>
            
            {loadingSchedule ? (
              <p className={styles.loadingText}>Loading payment schedule...</p>
            ) : (
              <div className={styles.scheduleContainer}>
                <div className={styles.scheduleLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.upcomingIndicator}></div>
                    <span>Upcoming Payment</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.completedIndicator}></div>
                    <span>Completed</span>
                  </div>
                </div>
                
                <ul className={styles.scheduleList}>
                  {schedule.map(slot => {
                    const isNext = nextSlot && slot.installment_no === nextSlot.installment_no;
                    const isPast = new Date(slot.due_date) < new Date();
                    
                    return (
                      <li 
                        key={slot.schedule_id} 
                        className={`${styles.scheduleItem} ${isNext ? styles.nextDue : ''} ${isPast ? styles.pastDue : ''}`}
                      >
                        <div className={styles.installmentInfo}>
                          <span className={styles.installmentNumber}>#{slot.installment_no}</span>
                          <span className={styles.dueDate}>
                            {new Date(slot.due_date).toLocaleDateString('en-KE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className={styles.amountContainer}>
                          <span className={styles.amountLabel}>Amount:</span>
                          <span className={styles.amountValue}>
                            KES {slot.amount_per_member.toFixed(2)}
                          </span>
                        </div>
                        
                        {isNext && (
                          <div className={styles.upcomingBadge}>
                            <FaBell /> Upcoming
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          ) : (
            <div className={styles.noGoal}>
              <div className={styles.noGoalIcon}>🎯</div>
              <p className={styles.noGoalText}>No goal set for this group yet.</p>
              {isChairperson && (
                <p className={styles.addPrompt}>Add a goal using the form below</p>
              )}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className={styles.card}>
          <h3 className={styles.paymentTitle}>Payment History</h3>
          {contributions.length > 0 ? (
            <ul className={styles.historyList}>
              {contributions.map(c => (
                <li key={c.id} className={styles.historyItem}>
                  <span className={styles.historyDate}>
                    {new Date(c.contributed_at).toLocaleDateString()}
                  </span>
                  <span className={styles.historyAmount}>
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: 'KES'
                    }).format(Number(c.amount))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noRecords}>No payment records available</p>
          )}
        </div>
      </div>

      {/* Contribute button */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.contributeButton}
          onClick={() => setShowContribution(true)}
          disabled={!goal}
        >
          Contribute to Goal
        </button>
      </div>

      {/* Contribution modal */}
      {showContribution && goal && (
        <ContributionButton
          onClose={() => setShowContribution(false)}
          groupId={chamaId}
          goalId={goal.goal_id}
        />
      )}

      {/* Chairperson goal management */}
      {isChairperson && (
        <div className={styles.goalManagement}>
          <div className={styles.goalManagementHeader}>
            <h3>{goal ? 'Manage Group Goal' : 'Create Group Goal'}</h3>
            {goal && !isEditing && (
              <div className={styles.goalActions}>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit Goal
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={handleDeleteGoal}
                >
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
                  onChange={e =>
                    setEditGoal({ ...editGoal, target_amount: e.target.value })
                  }
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
                  onChange={e =>
                    setEditGoal({ ...editGoal, deadline: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> {goal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          ) : !goal && !isEditing ? (
            <div className={styles.addGoalPrompt}>
              <p>Your group doesn't have a goal yet. Create one to track progress.</p>
              <p>Ensure every member has joined the group before creating a goal.</p>
              <button
                className={styles.addGoalButton}
                onClick={() => setIsEditing(true)}
              >
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

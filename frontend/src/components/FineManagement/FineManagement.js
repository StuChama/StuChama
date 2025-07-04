import React, { useEffect, useState } from 'react';
import styles from './FineManagement.module.css';
import { FaPlus, FaUser, FaMoneyBillWave, FaPen, FaCheck } from 'react-icons/fa';

function FineManagement({ chamaId }) {
  const [fines, setFines] = useState([]);
  const [members, setMembers] = useState([]);
  const [showAddFineModal, setShowAddFineModal] = useState(false);
  const [newFine, setNewFine] = useState({
    userId: '',
    amount: '',
    reason: '',
    status: 'Unpaid'
  });
  const [editFine, setEditFine] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Extracted so it can be reused after delete
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const finesRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/fines`);
      const finesData = await finesRes.json();

      const membersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/members`);
      const membersData = await membersRes.json();

      const enrichedFines = finesData.map(fine => {
        const member = membersData.find(m => m.user_id === fine.user_id);
        return { ...fine, memberName: member ? member.full_name : 'Unknown Member' };
      });

      setFines(enrichedFines);
      setMembers(membersData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chamaId]);

  const handleAddFine = () => {
    setShowAddFineModal(true);
    setNewFine({
      userId: '',
      amount: '',
      reason: '',
      status: 'Unpaid'
    });
  };

  const handleSubmitFine = async (e) => {
    e.preventDefault();

    if (!newFine.userId || !newFine.amount || !newFine.reason) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/fines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: newFine.userId,
          amount: newFine.amount,
          reason: newFine.reason,
          status: newFine.status,
          group_id: chamaId
        })
      });

      if (!response.ok) throw new Error('Failed to add fine');

      await fetchData(); // Refresh fines list
      setShowAddFineModal(false);
      setError('');
    } catch (err) {
      console.error('Error adding fine:', err);
      setError('Failed to add fine. Please try again.');
    }
  };

  const handleMarkPaid = async (fineId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      });

      if (!response.ok) throw new Error('Failed to update fine');

      await fetchData(); // Refresh fines list
    } catch (err) {
      console.error('Error updating fine:', err);
      setError('Failed to update fine status.');
    }
  };

  const handleEditFine = (fine) => {
    setEditFine(fine);
    setNewFine({
      userId: fine.user_id.toString(),
      amount: fine.amount.toString(),
      reason: fine.reason,
      status: fine.status
    });
    setShowAddFineModal(true);
  };

  const handleUpdateFine = async (e) => {
    e.preventDefault();

    if (!newFine.userId || !newFine.amount || !newFine.reason) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${editFine.fine_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(newFine.userId),
          amount: parseFloat(newFine.amount),
          reason: newFine.reason,
          status: newFine.status,
          group_id: chamaId
        })
      });

      if (!response.ok) throw new Error('Failed to update fine');

      await fetchData();
      setShowAddFineModal(false);
      setEditFine(null);
      setError('');
    } catch (err) {
      console.error('Error updating fine:', err);
      setError('Failed to update fine. Please try again.');
    }
  };

  const handleDeleteFine = async (fineId) => {
    if (!window.confirm('Are you sure you want to delete this fine?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fineId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete fine');

      await fetchData(); // ✅ Refresh the data without page reload
    } catch (err) {
      console.error('Error deleting fine:', err);
      setError('Failed to delete fine.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Fine Management</h2>
        <button className={styles.addButton} onClick={handleAddFine}>
          <FaPlus className={styles.plusIcon} /> Add Fine
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading fines...</p>
        </div>
      ) : (
        <div className={styles.fineGrid}>
          {fines.length === 0 ? (
            <div className={styles.noFines}>
              <div className={styles.noFinesIcon}>📋</div>
              <p>No fines recorded yet</p>
              <button className={styles.addFirstButton} onClick={handleAddFine}>
                Add First Fine
              </button>
            </div>
          ) : (
            fines.map((fine) => (
              <div
                key={fine.fine_id}
                className={`${styles.fineCard} ${fine.status === 'Paid' ? styles.paid : ''}`}
              >
                <div className={styles.fineHeader}>
                  <div className={styles.memberInfo}>
                    <FaUser className={styles.userIcon} />
                    <span className={styles.memberName}>
                      {fine.memberName || fine.full_name || 'Unknown Member'}
                    </span>
                  </div>
                  <div className={styles.fineAmount}>
                    <FaMoneyBillWave className={styles.moneyIcon} />
                    KES {fine.amount}
                  </div>
                </div>

                <div className={styles.fineDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Reason:</span>
                    <span className={styles.detailValue}>{fine.reason}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${fine.status === 'Paid' ? styles.paidStatus : styles.unpaidStatus}`}>
                      {fine.status}
                    </span>
                  </div>
                </div>

                <div className={styles.fineActions}>
                  {fine.status !== 'Paid' && (
                    <button
                      className={`${styles.actionButton} ${styles.payButton}`}
                      onClick={() => handleMarkPaid(fine.fine_id)}
                    >
                      <FaCheck /> Mark Paid
                    </button>
                  )}
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditFine(fine)}
                  >
                    <FaPen /> Edit
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteFine(fine.fine_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddFineModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editFine ? 'Edit Fine' : 'Add New Fine'}</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowAddFineModal(false);
                  setEditFine(null);
                }}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={editFine ? handleUpdateFine : handleSubmitFine}
              className={styles.modalForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="member">Member</label>
                <select
                  id="member"
                  value={newFine.userId}
                  onChange={(e) => setNewFine({ ...newFine, userId: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="">Select a member</option>
                  {members.map(member => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="amount">Amount (KES)</label>
                <input
                  type="number"
                  id="amount"
                  value={newFine.amount}
                  onChange={(e) => setNewFine({ ...newFine, amount: e.target.value })}
                  className={styles.formInput}
                  placeholder="Enter fine amount"
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  value={newFine.reason}
                  onChange={(e) => setNewFine({ ...newFine, reason: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="Enter reason for the fine"
                  rows="3"
                />
              </div>

              {error && <div className={styles.formError}>{error}</div>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAddFineModal(false);
                    setEditFine(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editFine ? 'Update Fine' : 'Add Fine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FineManagement;

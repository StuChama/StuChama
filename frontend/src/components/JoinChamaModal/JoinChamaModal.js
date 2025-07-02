// src/components/JoinChamaModal/JoinChamaModal.js

import React, { useState, useContext } from 'react';
import styles from './JoinChamaModal.module.css';
import { joinGroup } from '../../services/chamaService';
import { UserContext } from '../../context/UserContext';

const JoinChamaModal = ({ onClose, onJoin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, loadingUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prevent submission until user data is available
    if (loadingUser || !currentUser) {
      setError('User data is still loading. Please try again in a moment.');
      setLoading(false);
      return;
    }

    try {
      // Pass group_code and the logged-in user's ID to the service
      await joinGroup({
        group_code: code.trim(),
        user_id: currentUser.user_id
      });

      // Notify parent and close on success
      onJoin();
      onClose();
    } catch (err) {
      // Show the exact error message thrown by the service
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Join a Chama</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <p className={styles.errorText}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="code">Group Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${loading ? styles.disabledBtn : ''}`}
              disabled={loading}
            >
              {loading ? 'Joining…' : 'Join Chama'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinChamaModal;

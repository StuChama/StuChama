// src/components/ContributionButton/ContributionButton.js

import React, { useState, useContext } from 'react';
import styles from './ContributionButton.module.css';
import { UserContext } from '../../context/UserContext';

const ContributionButton = ({ onClose, groupId, goalId, amount, fineId }) => {
  const { currentUser } = useContext(UserContext);
  const [mpesaAmount, setMpesaAmount] = useState(amount || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');       // 'Pending' | 'Success' | 'Failed'
  const [error, setError]   = useState('');

  // Polling helper for querying M-Pesa status
  const checkStatus = async (checkoutId) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/mpesa/query`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutRequestID: checkoutId })
      }
    );
    if (!res.ok) throw new Error('Failed to query payment status');
    const { status, message } = await res.json();
    return { status, message };
  };

  // Update the fine(s) in your system
  const markFineAsPaid = async () => {
    if (fineId === 'all') {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chamas/member/groups/${groupId}/fines?user_id=${currentUser.user_id}&status=Unpaid`
      );
      const fines = await res.json();
      for (const fine of fines) {
        await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fine.fine_id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Paid' })
          }
        );
      }
    } else if (fineId) {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fineId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Paid' })
        }
      );
    }
  };

  const handleMpesaSubmit = async () => {
    if (!currentUser?.phone_number) {
      alert("No phone number found. Please update your profile.");
      return;
    }
    setIsSubmitting(true);
    setError('');
    setStatus('');

    try {
      // 1) Initiate STK Push
      const pushRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/mpesa/stk-push`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: currentUser.phone_number,
            amount: mpesaAmount,
            user_id: currentUser.user_id,
            group_id: groupId,
            goal_id: goalId || null,
            fine_id: fineId || null
          })
        }
      );

      const pushData = await pushRes.json();
      if (!pushRes.ok) {
        throw new Error(pushData.error || 'Failed to initiate STK Push');
      }

      const { CheckoutRequestID } = pushData;
      setStatus('Pending');
      alert(`STK Push sent. Please enter your PIN to pay KES ${mpesaAmount}.`);

      // 2) Poll until no longer Pending
      let result;
      do {
        await new Promise(r => setTimeout(r, 5000)); // wait 5s
        try {
          result = await checkStatus(CheckoutRequestID);
        } catch (pollErr) {
          console.error('Status poll error:', pollErr);
          // you might choose to break or retry
          continue;
        }
        setStatus(result.status);
      } while (result.status === 'Pending');

      // 3) Handle final status
      if (result.status === 'Success') {
        alert('Payment successful!');
        if (fineId) {
          await markFineAsPaid();
        } else {
          // if you want to refresh contributions you could call a prop callback here
        }
        onClose();
        window.location.reload();

      } else {
        alert(`Payment failed: ${result.message || 'Please try again.'}`);
      }

    } catch (err) {
      console.error('STK Push error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Pay via M-Pesa</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.paymentSection}>
          <div className={styles.inputGroup}>
            <label>Enter Amount (KES)</label>
            <input
              type="number"
              value={mpesaAmount}
              onChange={(e) => setMpesaAmount(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <button
            className={styles.actionButton}
            onClick={handleMpesaSubmit}
            disabled={isSubmitting || !mpesaAmount}
          >
            {isSubmitting ? 'Processing…' : 'PAY VIA M-PESA'}
          </button>

          {status && (
            <p className={styles.statusText}>
              Status: <strong>{status}</strong>
            </p>
          )}
          {error && (
            <p className={styles.errorText}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionButton;

// ContributionButton.js (updated)
import React, { useState, useContext } from 'react';
import styles from './ContributionButton.module.css';
import { UserContext } from '../../context/UserContext';

const ContributionButton = ({ onClose, groupId, goalId, amount, fineId }) => {
  const { currentUser } = useContext(UserContext);
  const [mpesaAmount, setMpesaAmount] = useState(amount || '');
  const [paybillCode, setPaybillCode] = useState('');
  const [showMpesa, setShowMpesa] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markFineAsPaid = async () => {
    try {
      if (fineId === 'all') {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/member/groups/${groupId}/fines`, {
          params: { user_id: currentUser.user_id, status: 'Unpaid' }
        });
        const fines = await res.json();
        for (const fine of fines) {
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fine.fine_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Paid' })
          });
        }
      } else if (fineId) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/fines/${fineId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Paid' })
        });
      }
    } catch (err) {
      console.error('Failed to update fine status:', err);
    }
  };

  const handleMpesaSubmit = async () => {
    if (!currentUser?.phone_number) {
      alert("No phone number found. Please update your profile.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mpesa/stk-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentUser.phone_number,
          amount: mpesaAmount,
          user_id: currentUser.user_id,
          group_id: groupId,
          goal_id: goalId || null,
          fine_id: fineId || null, 
          group_name: currentUser.group_name || 'Chama Group',
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`STK Push sent. Check your phone to pay KES ${mpesaAmount}.`);
        await markFineAsPaid();
      } else {
        alert(`STK Push failed. ${data.error || 'Please ensure you are using a Safaricom line.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('STK Push failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaybillSubmit = async () => {
    try {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 1500));
      alert(`M-Pesa code ${paybillCode} submitted for confirmation.`);
      await markFineAsPaid();
    } catch (err) {
      console.error('Paybill submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Contribution Methods</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tabButton} ${showMpesa ? styles.activeTab : ''}`} onClick={() => setShowMpesa(true)}>Auto M-Pesa</button>
          <button className={`${styles.tabButton} ${!showMpesa ? styles.activeTab : ''}`} onClick={() => setShowMpesa(false)}>Paybill</button>
        </div>

        {showMpesa ? (
          <div className={styles.paymentSection}>
            <div className={styles.inputGroup}>
              <label>Enter Amount (KES)</label>
              <input type="number" value={mpesaAmount} onChange={(e) => setMpesaAmount(e.target.value)} className={styles.inputField} />
            </div>
            <button className={`${styles.actionButton} ${styles.payButton}`} onClick={handleMpesaSubmit} disabled={isSubmitting || !mpesaAmount}>
              {isSubmitting ? 'Processing...' : 'PAY VIA M-PESA'}
            </button>
          </div>
        ) : (
          <div className={styles.paymentSection}>
            <div className={styles.staticInfo}>
              <div className={styles.staticField}><span className={styles.fieldLabel}>Paybill:</span> <span className={styles.fieldValue}>123456</span></div>
              <div className={styles.staticField}><span className={styles.fieldLabel}>Account No:</span> <span className={styles.fieldValue}>{groupId}</span></div>
            </div>
            <div className={styles.inputGroup}>
              <label>Enter M-Pesa Code</label>
              <input type="text" value={paybillCode} onChange={(e) => setPaybillCode(e.target.value)} className={styles.inputField} />
            </div>
            <button className={`${styles.actionButton} ${styles.submitButton}`} onClick={handlePaybillSubmit} disabled={isSubmitting || !paybillCode}>
              {isSubmitting ? 'Verifying...' : 'SUBMIT PAYMENT'}
            </button>
          </div>
        )}

        <div className={styles.infoNote}><p>Transactions may take 1–2 minutes to process</p></div>
      </div>
    </div>
  );
};

export default ContributionButton;

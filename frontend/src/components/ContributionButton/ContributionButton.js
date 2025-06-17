// src/components/ContributionButton/ContributionButton.js
import React, { useState } from 'react';
import styles from './ContributionButton.module.css';

const ContributionButton = ({ onClose }) => {
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [paybillCode, setPaybillCode] = useState('');
  const [showMpesa, setShowMpesa] = useState(true); // toggle between payment types

  const handleMpesaSubmit = () => {
    alert(`Auto M-Pesa payment of ${mpesaAmount} initiated.`);
    // TODO: integrate with M-Pesa API
  };

  const handlePaybillSubmit = () => {
    alert(`M-Pesa code ${paybillCode} submitted for confirmation.`);
    // TODO: process manual payment confirmation
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Contribution Methods</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${showMpesa ? styles.active : ''}`}
            onClick={() => setShowMpesa(true)}
          >
            Pay via M-Pesa Automatically
          </button>
          <button
            className={`${styles.tabButton} ${!showMpesa ? styles.active : ''}`}
            onClick={() => setShowMpesa(false)}
          >
            Pay via Paybill
          </button>
        </div>

        {showMpesa ? (
          <div className={styles.paymentSection}>
            <label>Enter Amount</label>
            <input
              type="number"
              placeholder="Amount (KES)"
              value={mpesaAmount}
              onChange={(e) => setMpesaAmount(e.target.value)}
            />
            <button className={styles.payButton} onClick={handleMpesaSubmit}>
              PAY
            </button>
          </div>
        ) : (
          <div className={styles.paymentSection}>
            <div className={styles.staticField}>
              <label>Paybill:</label>
              <span>123456</span>
            </div>
            <div className={styles.staticField}>
              <label>Account No:</label>
              <span>YourChamaID</span>
            </div>
            <label>Enter M-Pesa Code</label>
            <input
              type="text"
              placeholder="e.g. QW12ER34TY"
              value={paybillCode}
              onChange={(e) => setPaybillCode(e.target.value)}
            />
            <button className={styles.submitButton} onClick={handlePaybillSubmit}>
              SUBMIT
            </button>
          </div>
        )}

        <button className={styles.backButton} onClick={onClose}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ContributionButton;

import React, { useState } from 'react';
import styles from './ContributionButton.module.css';

const ContributionButton = ({ onClose }) => {
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [paybillCode, setPaybillCode] = useState('');
  const [showMpesa, setShowMpesa] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMpesaSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Auto M-Pesa payment of KES ${mpesaAmount} initiated. Check your phone.`);
    }, 1500);
  };

  const handlePaybillSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`M-Pesa code ${paybillCode} submitted for confirmation.`);
    }, 1500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Contribution Methods</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${showMpesa ? styles.activeTab : ''}`}
            onClick={() => setShowMpesa(true)}
          >
            Auto M-Pesa
          </button>
          <button
            className={`${styles.tabButton} ${!showMpesa ? styles.activeTab : ''}`}
            onClick={() => setShowMpesa(false)}
          >
            Paybill
          </button>
        </div>

        {showMpesa ? (
          <div className={styles.paymentSection}>
            <div className={styles.inputGroup}>
              <label>Enter Amount (KES)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={mpesaAmount}
                onChange={(e) => setMpesaAmount(e.target.value)}
                className={styles.inputField}
              />
            </div>
            
            <button 
              className={`${styles.actionButton} ${styles.payButton}`}
              onClick={handleMpesaSubmit}
              disabled={isSubmitting || !mpesaAmount}
            >
              {isSubmitting ? 'Processing...' : 'PAY VIA M-PESA'}
            </button>
          </div>
        ) : (
          <div className={styles.paymentSection}>
            <div className={styles.staticInfo}>
              <div className={styles.staticField}>
                <span className={styles.fieldLabel}>Paybill:</span>
                <span className={styles.fieldValue}>123456</span>
              </div>
              <div className={styles.staticField}>
                <span className={styles.fieldLabel}>Account No:</span>
                <span className={styles.fieldValue}>YourChamaID</span>
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Enter M-Pesa Code</label>
              <input
                type="text"
                placeholder="e.g. QW12ER34TY"
                value={paybillCode}
                onChange={(e) => setPaybillCode(e.target.value)}
                className={styles.inputField}
              />
            </div>
            
            <button 
              className={`${styles.actionButton} ${styles.submitButton}`}
              onClick={handlePaybillSubmit}
              disabled={isSubmitting || !paybillCode}
            >
              {isSubmitting ? 'Verifying...' : 'SUBMIT PAYMENT'}
            </button>
          </div>
        )}

        <div className={styles.infoNote}>
          <p>Transactions may take 1-2 minutes to process</p>
        </div>
      </div>
    </div>
  );
};

export default ContributionButton;
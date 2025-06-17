import React, { useState } from 'react';
import styles from './FineManagement.module.css';
import BackButton from '../BackButton/BackButton';
import ContributionButton from '../ContributionButton/ContributionButton';

const fines = [
  { id: 1, dateIssued: '2024-06-01', amount: '500', reason: 'Late contribution' },
  { id: 2, dateIssued: '2024-06-10', amount: '300', reason: 'Missed meeting' },
  { id: 3, dateIssued: '2024-06-15', amount: '200', reason: 'Unapproved absence' },
  { id: 4, dateIssued: '2024-06-18', amount: '400', reason: 'Late fee' }
];

const FineManagement = () => {
  const [showContribution, setShowContribution] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  const handleBack = () => {
    window.history.back();
  };

  const handlePay = (fine) => {
    setSelectedFine(fine);
    setShowContribution(true);
  };

  const handlePayAll = () => {
    setSelectedFine({ id: 'all', amount: fines.reduce((sum, fine) => sum + Number(fine.amount), 0) });
    setShowContribution(true);
  };

  const handleCloseContribution = () => {
    setShowContribution(false);
    setSelectedFine(null);
  };

  return (
    <div className={styles.fineManagementContainer}>
      <div className={styles.headerRow}>
        <h2>CHAMA 1</h2>
        <BackButton onClick={handleBack} />
      </div>
      <h3 className={styles.title}>MY FINES</h3>
      <div className={styles.finesGrid}>
        {fines.map((fine) => (
          <div key={fine.id} className={styles.fineCard}>
            <p><strong>Date Issued:</strong> {fine.dateIssued}</p>
            <p><strong>Amount:</strong> KES {fine.amount}</p>
            <p><strong>Reason:</strong> {fine.reason}</p>
            <button
              className={styles.payButton}
              onClick={() => handlePay(fine)}
            >
              Pay
            </button>
          </div>
        ))}
      </div>
      <div className={styles.payAllContainer}>
        <button className={styles.payAllButton} onClick={handlePayAll}>
          PAY ALL
        </button>
      </div>

      {showContribution && (
        <ContributionButton
          amount={selectedFine.amount}
          onClose={handleCloseContribution}
        />
      )}
    </div>
  );
};

export default FineManagement;

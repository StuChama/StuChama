import React, { useState } from 'react';
import styles from './GroupProgress.module.css';
import BackButton from '../BackButton/BackButton';
import ContributionButton from '../ContributionButton/ContributionButton';

const GroupProgress = () => {
  const [showContribution, setShowContribution] = useState(false);

  return (
    <div className={styles.groupProgressContainer}>
      <BackButton />

      <div className={styles.header}>
        <h2>CHAMA 1</h2>
        <p>CHAMA GOAL PROGRESS</p>
        <p className={styles.progressText}>3000 OUT OF 100000</p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '3%' }}></div>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3>Deadline:</h3>
          <p>[Insert Deadline]</p>
          <h3>Next Payment:</h3>
          <p>[Insert Next Payment Date]</p>
          <h3>Amount to be paid:</h3>
          <p>[Insert Amount]</p>
        </div>

        <div className={styles.card}>
          <h3>Payment History</h3>
          <p>No records available</p>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.contributeButton}
          onClick={() => setShowContribution(true)}
        >
          Contribute
        </button>
      </div>

      {showContribution && (
        <ContributionButton onClose={() => setShowContribution(false)} />
      )}
    </div>
  );
};

export default GroupProgress;

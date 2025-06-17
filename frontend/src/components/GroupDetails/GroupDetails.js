import React from 'react';
import styles from './GroupDetails.module.css';
import BackButton from '../BackButton/BackButton';

const GroupDetails = () => {
  const groupInfo = {
    name: 'Safari Savings Group',
    description:
      'Safari Savings Group is dedicated to helping students save towards their goals including trips, gadgets, and more.',
    rules: `1. Contributions must be made weekly.\n2. Late payments attract a fine.\n3. Members must attend all meetings.\n4. Respect fellow members at all times.`,
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleLeaveChama = () => {
    if (window.confirm('Are you sure you want to leave the chama?')) {
      alert('You have left the chama.');
      // Add leave chama logic here
    }
  };

  return (
    <div className={styles.container}>
      <BackButton onClick={handleBack} />

      <h2 className={styles.chamaName}>{groupInfo.name}</h2>

      <div className={styles.infoBox}>
        <h3>Description</h3>
        <p>{groupInfo.description}</p>
      </div>

      <div className={styles.infoBox}>
        <h3>Rules</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{groupInfo.rules}</p>
      </div>

      <div className={styles.leaveContainer}>
        <button className={styles.leaveButton} onClick={handleLeaveChama}>
          Leave Chama
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;

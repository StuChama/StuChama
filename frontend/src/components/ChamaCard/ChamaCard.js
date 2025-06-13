import React from 'react';
import styles from './ChamaCard.module.css';

const ChamaCard = ({ chama }) => {
  // Get initials for the avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={styles.chamaCard}>
      <div className={styles.chamaIcon}>
        {getInitials(chama.group_name)}
      </div>
      <h3 className={styles.chamaName}>{chama.group_name}</h3>
      <div className={styles.chamaDetails}>
        <span>Your Role: <strong>{chama.userRole}</strong></span>
        <span>Code: {chama.group_code}</span>
      </div>
      <button className={styles.viewBtn}>View Details</button>
    </div>
  );
};

export default ChamaCard;
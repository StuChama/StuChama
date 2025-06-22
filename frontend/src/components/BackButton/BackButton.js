import React from 'react';
import styles from './BackButton.module.css';

const BackButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button className={styles.backButton} onClick={handleClick}>
      <span className={styles.arrow}>&larr;</span>
      <span className={styles.text}>Back</span>
    </button>
  );
};

export default BackButton;
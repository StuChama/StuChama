
import React from 'react';
import styles from './BackButton.module.css';

const BackButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // use the custom handler if provided
    } else {
      window.history.back(); // default behavior
    }
  };

  return (
    <button className={styles.backButton} onClick={handleClick}>
      ← Back
    </button>
  );
};

export default BackButton;

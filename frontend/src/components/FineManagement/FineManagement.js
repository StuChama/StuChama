// FineManagement.js
import React, { useEffect, useState } from 'react';
import styles from './FineManagement.module.css';

function FineManagement({ chamaId }) {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/fines?groupId=${chamaId}`)
      .then((res) => res.json())
      .then((data) => setFines(data));
  }, [chamaId]);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Fine Management</h2>
      
      <div className={styles.fineGrid}>
        {fines.length === 0 ? (
          <div className={styles.noFines}>
            <div className={styles.noFinesIcon}>📋</div>
            <p>No fines recorded yet</p>
          </div>
        ) : (
          fines.map((fine) => (
            <div key={fine.id} className={styles.fineCard}>
              <div className={styles.fineHeader}>
                <span className={styles.memberName}>{fine.memberName}</span>
                <span className={styles.fineAmount}>KES {fine.amount}</span>
              </div>
              
              <div className={styles.fineDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Reason:</span>
                  <span className={styles.detailValue}>{fine.reason}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>{fine.date}</span>
                </div>
              </div>
              
              <div className={styles.fineActions}>
                <button className={styles.actionButton}>Mark Paid</button>
                <button className={`${styles.actionButton} ${styles.editButton}`}>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FineManagement;
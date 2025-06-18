import React, { useEffect, useState, useContext } from 'react';
import styles from './MyFines.module.css';
import BackButton from '../BackButton/BackButton';
import ContributionButton from '../ContributionButton/ContributionButton';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MyFines = () => {
  const { currentUser } = useContext(UserContext);
  const { chamaId } = useParams();
  const [fines, setFines] = useState([]);
  const [showContribution, setShowContribution] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalFines, setTotalFines] = useState(0);

  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/fines`, {
          params: {
            user_id: currentUser.user_id,
            group_id: chamaId,
            status: 'Unpaid',
          },
        });
        setFines(response.data);
        
        // Calculate total fines
        const total = response.data.reduce((sum, fine) => sum + Number(fine.amount), 0);
        setTotalFines(total);
      } catch (error) {
        console.error('Error fetching fines:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.user_id && chamaId) {
      fetchFines();
    }
  }, [currentUser?.user_id, chamaId]);

  const handlePay = (fine) => {
    setSelectedFine(fine);
    setShowContribution(true);
  };

  const handlePayAll = () => {
    setSelectedFine({ id: 'all', amount: totalFines });
    setShowContribution(true);
  };

  const handleCloseContribution = () => {
    setShowContribution(false);
    setSelectedFine(null);
  };

  return (
    <div className={styles.MyFinesContainer}>
      <div className={styles.headerRow}>
        <BackButton onClick={handleBack} />
      </div>

      <h3 className={styles.title}>MY FINES</h3>
      
      {totalFines > 0 && (
        <div className={styles.totalFines}>
          <span>Total Unpaid Fines:</span>
          <span className={styles.totalAmount}>KES {totalFines.toLocaleString()}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading fines...</div>
      ) : fines.length === 0 ? (
        <div className={styles.noFines}>
          <div className={styles.celebrate}>🎉</div>
          <p>No unpaid fines found!</p>
        </div>
      ) : (
        <>
          <div className={styles.finesGrid}>
            {fines.map((fine) => (
              <div key={fine.id} className={styles.fineCard}>
                <div className={styles.cardHeader}>
                  <h4>Fine #{fine.id}</h4>
                  <div className={styles.fineAmount}>KES {fine.amount}</div>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Reason:</strong> {fine.reason}</p>
                  <p><strong>Issued:</strong> {new Date(fine.created_at).toLocaleDateString()}</p>
                </div>
                <button className={styles.payButton} onClick={() => handlePay(fine)}>
                  Pay Fine
                </button>
              </div>
            ))}
          </div>

          <div className={styles.payAllContainer}>
            <button className={styles.payAllButton} onClick={handlePayAll}>
              PAY ALL FINES (KES {totalFines.toLocaleString()})
            </button>
          </div>
        </>
      )}

      {showContribution && (
        <ContributionButton
          amount={selectedFine?.amount}
          onClose={handleCloseContribution}
        />
      )}
    </div>
  );
};

export default MyFines;
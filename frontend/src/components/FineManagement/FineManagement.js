import React, { useEffect, useState, useContext } from 'react';
import styles from './FineManagement.module.css';
import BackButton from '../BackButton/BackButton';
import ContributionButton from '../ContributionButton/ContributionButton';
import { UserContext } from '../../context/UserContext'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FineManagement = () => {
  const { currentUser } = useContext(UserContext); 
  const { chamaId } = useParams();
  const [fines, setFines] = useState([]);
  const [showContribution, setShowContribution] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    window.history.back();
  };

  const fetchFines = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/fines`, {
        params: {
          user_id: currentUser.user_id,
          group_id: chamaId,
          status: 'Unpaid'
        }
      });
      setFines(response.data);
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, [currentUser.user_id, chamaId]);

  const handlePay = (fine) => {
    setSelectedFine(fine);
    setShowContribution(true);
  };

  const handlePayAll = () => {
    const total = fines.reduce((sum, fine) => sum + Number(fine.amount), 0);
    setSelectedFine({ id: 'all', amount: total });
    setShowContribution(true);
  };

  const handleCloseContribution = () => {
    setShowContribution(false);
    setSelectedFine(null);
  };

  return (
    <div className={styles.fineManagementContainer}>
      <div className={styles.headerRow}>
        {/* <h2>{chama.group_name}</h2> */}
        <BackButton onClick={handleBack} />
      </div>

      <h3 className={styles.title}>MY FINES</h3>

      {loading ? (
        <p>Loading fines...</p>
      ) : fines.length === 0 ? (
        <p>No unpaid fines 🎉</p>
      ) : (
        <>
          <div className={styles.finesGrid}>
            {fines.map((fine) => (
              <div key={fine.id} className={styles.fineCard}>
                <p><strong>Amount:</strong> KES {fine.amount}</p>
                <p><strong>Reason:</strong> {fine.reason}</p>
                <button className={styles.payButton} onClick={() => handlePay(fine)}>
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

export default FineManagement;

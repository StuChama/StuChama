// src/pages/TreasurerDashboard/TreasurerDashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import GroupDetails from '../../components/GroupDetails/GroupDetails';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import MyFines from '../../components/MyFines/MyFines';
import FineManagement from '../../components/FineManagement/FineManagement';

import styles from './TreasurerDashboard.module.css';
import { FaArrowLeft, FaSearch, FaDownload } from 'react-icons/fa';

const TreasurerDashboard = () => {
  const { chamaId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('TransactionReport');
  const [group, setGroup] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:3001/groups/${chamaId}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error('Error fetching group:', err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`http://localhost:3001/transactions?group_id=${chamaId}`);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchGroup();
    fetchTransactions();
  }, [chamaId]);

  const filteredTransactions = transactions.filter(txn =>
    txn.mpesa_code.toLowerCase().includes(searchCode.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'GroupDetails':
        return <GroupDetails chamaId={chamaId} />;
      case 'GroupProgress':
        return <GroupProgress chamaId={chamaId} />;
      case 'TransactionReport':
        return (
          <>
            <div className={styles.searchSection}>
              <label htmlFor="search">SEARCH MPESA CODE</label>
              <div className={styles.searchInput}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  id="search"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Enter MPESA code..."
                />
              </div>
              {searchCode && <p>Results for: <strong>{searchCode}</strong></p>}
            </div>

            <div className={styles.transactionTable}>
              <div className={styles.transactionHeader}>
                <span>MEMBER</span>
                <span>MPESA CODE</span>
                <span>AMOUNT PAID</span>
                <span>VERIFY</span>
              </div>
              {filteredTransactions.map(txn => (
                <div key={txn.id} className={styles.transactionRow}>
                  <span>{txn.member_name}</span>
                  <span>{txn.mpesa_code}</span>
                  <span>{txn.amount}</span>
                  <span>✔️</span>
                </div>
              ))}
            </div>
          </>
        );
      case 'MyFines':
        return <MyFines chamaId={chamaId} userId={currentUser?.id} />;
      case 'FineManagement':
        return <FineManagement chamaId={chamaId} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <img
            src={currentUser?.profile_picture || 'https://i.pravatar.cc/150?img=2'}
            alt="Profile"
            className={styles.profileImage}
          />
          <h3>{currentUser?.full_name}</h3>
          <p>Treasurer</p>
        </div>
        <nav className={styles.nav}>
          <button onClick={() => setActiveTab('GroupDetails')} className={activeTab === 'GroupDetails' ? styles.active : ''}>Group Details</button>
          <button onClick={() => setActiveTab('GroupProgress')} className={activeTab === 'GroupProgress' ? styles.active : ''}>Group Progress</button>
          <button onClick={() => setActiveTab('TransactionReport')} className={activeTab === 'TransactionReport' ? styles.active : ''}>Transaction Report</button>
          <button onClick={() => setActiveTab('MyFines')} className={activeTab === 'MyFines' ? styles.active : ''}>My Fines</button>
          <button onClick={() => setActiveTab('FineManagement')} className={activeTab === 'FineManagement' ? styles.active : ''}>Fine Management</button>
          <button onClick={() => window.location.href = '/'} className={styles.logoutButton}>Log Out</button>
        </nav>
      </aside>

      <main className={styles.mainPanel}>
        <div className={styles.topBar}>
          <h2>{group?.group_name || 'CHAMA'}</h2>
          <div className={styles.topBarButtons}>
            <button className={styles.iconButton}><FaArrowLeft /></button>
            <button className={styles.iconButton}><FaDownload /> Download Report</button>
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default TreasurerDashboard;

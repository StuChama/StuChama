import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import GroupDetails from '../../components/GroupDetails/GroupDetails';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import MyFines from '../../components/MyFines/MyFines';
import FineManagement from '../../components/FineManagement/FineManagement';
import styles from './TreasurerDashboard.module.css';
import { FaArrowLeft, FaSearch, FaDownload } from 'react-icons/fa';

// Import icons
import groupIcon from '../../assets/details (1).png';
import progressIcon from '../../assets/roadmap (1).png';
import reportIcon from '../../assets/payment-method.png';
import fineIcon from '../../assets/fine (1).png';
import myFinesIcon from '../../assets/fine (1).png';
import logoutIcon from '../../assets/logout.png';
import logoutIconHover from '../../assets/logout1.png';

const TreasurerDashboard = () => {
  const { chamaId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('TransactionReport');
  const [group, setGroup] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

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

  const menuItems = [
    {
      tab: 'GroupDetails',
      label: 'Group Details',
      icon: groupIcon,
    },
    {
      tab: 'GroupProgress',
      label: 'Group Progress',
      icon: progressIcon,
    },
    {
      tab: 'TransactionReport',
      label: 'Transaction Report',
      icon: reportIcon,
    },
    {
      tab: 'MyFines',
      label: 'My Fines',
      icon: myFinesIcon,
    },
    {
      tab: 'FineManagement',
      label: 'Fine Management',
      icon: fineIcon,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'GroupDetails':
        return <GroupDetails chamaId={chamaId} />;
      case 'GroupProgress':
        return <GroupProgress chamaId={chamaId} />;
      case 'TransactionReport':
        return (
          <div className={styles.transactionReport}>
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
                  <span>KES {txn.amount}</span>
                  <span className={styles.verifyIcon}>✔️</span>
                </div>
              ))}
            </div>
          </div>
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
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.profileImage}>
            <img
              src={currentUser?.profile_picture || 'https://i.pravatar.cc/150?img=2'}
              alt="Profile"
              className={styles.profileIcon}
            />
          </div>

          {!collapsed && currentUser && (
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{currentUser.full_name}</h3>
              <p className={styles.userRole}>Treasurer</p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <div className={styles.sidebarHeader}>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        {/* Menu Items */}
        <ul className={styles.sidebarMenu}>
          {menuItems.map(({ tab, label, icon }) => (
            <li
              key={tab}
              className={`${styles.menuItem} ${
                activeTab === tab ? styles.active : ''
              }`}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
              title={label}
            >
              <img
                src={icon}
                alt={label}
                className={styles.icon}
              />
              {!collapsed && <span className={styles.label}>{label}</span>}
            </li>
          ))}

          {/* Logout */}
          <li
            className={styles.menuItem}
            onClick={() => (window.location.href = '/')}
            onMouseEnter={() => setHoveredTab('logout')}
            onMouseLeave={() => setHoveredTab(null)}
            title="Logout"
          >
            <img
              src={hoveredTab === 'logout' ? logoutIconHover : logoutIcon}
              alt="Logout"
              className={styles.icon}
            />
            {!collapsed && <span className={styles.label}>Logout</span>}
          </li>
        </ul>
      </aside>

      <main className={styles.mainPanel}>
        <div className={styles.topBar}>
          <h2>{group?.group_name || 'CHAMA'}</h2>
          <div className={styles.topBarButtons}>
            <button className={styles.iconButton} onClick={() => window.history.back()}>
              <FaArrowLeft />
            </button>
            <button className={styles.downloadButton}>
              <FaDownload /> Download Report
            </button>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TreasurerDashboard;
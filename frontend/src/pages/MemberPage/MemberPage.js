import React, { useState } from 'react';
import Sidebar from '../../components/MemberSidebar/MemberSidebar';
import GroupDetails from '../../components/GroupDetails/GroupDetails';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import FineManagement from '../../components/FineManagement/FineManagement';
import styles from './MemberPage.module.css';

const MemberPage = () => {
  const [activeTab, setActiveTab] = useState('groupDetails');

  const renderContent = () => {
    switch (activeTab) {
      case 'groupDetails':
        return <GroupDetails />;
      case 'groupProgress':
        return <GroupProgress />;
      case 'fineManagement':
        return <FineManagement />;
      default:
        return <GroupDetails />;
    }
  };

  return (
    <div className={styles.memberPageContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MemberPage;

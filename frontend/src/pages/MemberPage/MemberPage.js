// src/pages/MemberPage/MemberPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/MemberSidebar/MemberSidebar';
import GroupDetails from '../../components/GroupDetails/GroupDetails';
import GroupProgress from '../../components/GroupProgress/GroupProgress';
import MyFines from '../../components/MyFines/MyFines';
import styles from './MemberPage.module.css';

const MemberPage = () => {
  const { chamaId } = useParams();
  const [activeTab, setActiveTab] = useState('groupDetails');
  const [chamaData, setChamaData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchChamaData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups/${chamaId}`);
        if (!response.ok) throw new Error('Failed to fetch chama data');
        const data = await response.json();
        setChamaData(data);
      } catch (error) {
        console.error('Error fetching chama data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChamaData();
  }, [chamaId]);

  const renderContent = () => {
    if (loading) return <div>Loading chama details...</div>;
    if (!chamaData) return <div>Chama not found</div>;
    
    switch (activeTab) {
      case 'groupDetails':
        return <GroupDetails chama={chamaData} />;
      case 'groupProgress':
        return <GroupProgress chama={chamaData} />;
      case 'MyFines':
        return <MyFines chama={chamaData} />;
      default:
        return <GroupDetails chama={chamaData} />;
    }
  };

  return (
    <div className={styles.memberPageContainer}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MemberPage;
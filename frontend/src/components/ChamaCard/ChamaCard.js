import React from 'react';
import '../App.css';

const ChamaCard = ({ group }) => {
  return (
    <div className="chama-card">
      <h3>{group.groupName}</h3>
      <p>{group.description}</p>
    </div>
  );
};

export default ChamaCard;

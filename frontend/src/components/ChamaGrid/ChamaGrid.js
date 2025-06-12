// src/components/ChamaGrid.js
import React, { useEffect, useState } from 'react';
import ChamaCard from '../ChamaCard/ChamaCard';
import '../App.css';

function ChamaGrid() {
  const [chamas, setChamas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/groups")
      .then((res) => res.json())
      .then((data) => setChamas(data))
      .catch((err) => console.error("Failed to load chamas", err));
  }, []);

  return (
    <div className="chama-grid">
      {chamas.map((chama) => (
        <ChamaCard
          key={chama.id}
          groupName={chama.groupName}
          description={chama.description}
        />
      ))}
    </div>
  );
}

export default ChamaGrid;

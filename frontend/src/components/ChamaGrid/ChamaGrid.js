import React from 'react';
import PropTypes from 'prop-types';
import ChamaCard from '../ChamaCard/ChamaCard';
import styles from './ChamaGrid.module.css';

const ChamaGrid = ({ chamas }) => {
  return (
    <div className={styles.chamaGrid}>
      {chamas.length > 0 ? (
        chamas.map(chama => (
          <ChamaCard 
            key={chama.group_id}
            chama={chama}
          />
        ))
      ) : (
        <div className={styles.noChamas}>
          <h3>You're not part of any chama yet</h3>
          <p>Create a new chama or join an existing one to get started</p>
        </div>
      )}
    </div>
  );
};

ChamaGrid.propTypes = {
  chamas: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChamaGrid;

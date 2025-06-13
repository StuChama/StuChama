import React, { useState } from 'react';
import styles from './JoinChamaModal.module.css';

const JoinChamaModal = ({ onClose, onJoin }) => {
  const [formData, setFormData] = useState({
    code: '',
    pin: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(formData);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Join a Chama</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Chama Code</label>
              <input 
                type="text" 
                name="code"
                placeholder="Enter invitation code" 
                value={formData.code}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Security PIN</label>
              <input 
                type="password" 
                name="pin"
                placeholder="Enter security PIN" 
                value={formData.pin}
                onChange={handleChange}
                required 
              />
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              Join Chama
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinChamaModal;
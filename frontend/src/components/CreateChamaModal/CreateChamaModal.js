import React, { useState } from 'react';
import styles from './CreateChamaModal.module.css';

const CreateChamaModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contribution: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create New Chama</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Chama Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="Enter chama name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea 
                name="description"
                placeholder="Describe your chama" 
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            
            <button type="submit" className={styles.submitBtn}>
              Create Chama
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChamaModal;
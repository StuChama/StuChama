import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import styles from './UploadMeetingNotes.module.css';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';

const UploadMeetingNotes = ({ chamaId }) => {
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    if (!title || !file) {
      setMessage('Please provide a title and a PDF file.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // replace with your Cloudinary preset

    try {
      // Upload PDF to Cloudinary
      const uploadRes = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload', // replace with your Cloudinary URL
        formData
      );

      const fileUrl = uploadRes.data.secure_url;

      // Post to json-server (mock database)
      await axios.post('http://localhost:3001/meeting_notes', {
        group_id: chamaId,
        uploaded_by: currentUser.id,
        title,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      });

      setMessage('Meeting notes uploaded successfully!');
      setTitle('');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a PDF file.');
      setFile(null);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.header}>
        <h3>Upload Meeting Notes</h3>
        <p>Add PDF files of your group meeting notes</p>
      </div>
      
      <form onSubmit={handleUpload} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Meeting Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter meeting title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="file">Upload PDF</label>
          <div className={styles.fileUploadArea} onClick={() => document.getElementById('file').click()}>
            <input
              type="file"
              id="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              style={{ display: 'none' }}
            />
            
            {file ? (
              <div className={styles.filePreview}>
                <FaFilePdf className={styles.pdfIcon} />
                <span>{file.name}</span>
              </div>
            ) : (
              <div className={styles.uploadPrompt}>
                <FaCloudUploadAlt className={styles.uploadIcon} />
                <p>Click to upload PDF file</p>
                <small>Max file size: 5MB</small>
              </div>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.uploadButton}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Notes'}
        </button>
      </form>
      
      {message && (
        <p className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadMeetingNotes;
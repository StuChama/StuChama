import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../../context/UserContext';
import styles from './UploadMeetingNotes.module.css';
import { FaCloudUploadAlt, FaFilePdf, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const UploadMeetingNotes = ({ chamaId }) => {
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

   const fetchNotes = useCallback(async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/meetings?groupId=${chamaId}`);
    const data = await res.json();
    setNotes(data);
  } catch (err) {
    console.error('Error fetching notes:', err);
  }
}, [chamaId]);

  useEffect(() => {
    fetchNotes();
  }, [chamaId]);

 

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
    formData.append('title', title);
    formData.append('group_id', chamaId);
    formData.append('uploaded_by', currentUser.user_id);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/meetings/upload-note`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setMessage('Meeting notes uploaded successfully!');
        setTitle('');
        setFile(null);
        fetchNotes();
      } else {
        setMessage('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/meetings/${noteId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setNotes(notes.filter(note => note.note_id !== noteId));
      } else {
        alert('Failed to delete note.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditClick = (noteId, currentTitle) => {
    setEditNoteId(noteId);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = async (noteId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/meetings/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle })
      });
      if (res.ok) {
        fetchNotes();
        setEditNoteId(null);
      } else {
        alert('Failed to update title.');
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a valid PDF file.');
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
                <small>Only PDF format allowed • Max file size ~5MB</small>
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

      <div className={styles.notesList}>
        <h4 className={styles.notesTitle}>Uploaded Notes</h4>
        {notes.length === 0 ? (
          <p>No notes uploaded yet.</p>
        ) : (
          notes.map(note => (
            <div key={note.note_id} className={styles.noteItem}>
              {editNoteId === note.note_id ? (
                <input
                  className={styles.editInput}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <span className={styles.noteTitle}>{note.title}</span>
              )}

              <a href={note.file_url} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                Download
              </a>

              {(note.uploaded_by === currentUser.user_id || currentUser.role === 'Chairperson') && (
                <div className={styles.actions}>
                  {editNoteId === note.note_id ? (
                    <button onClick={() => handleSaveEdit(note.note_id)} className={styles.saveBtn}>
                      <FaSave />
                    </button>
                  ) : (
                    <button onClick={() => handleEditClick(note.note_id, note.title)} className={styles.editBtn}>
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => handleDelete(note.note_id)} className={styles.deleteBtn}>
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadMeetingNotes;

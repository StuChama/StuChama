import React, { useEffect, useState } from 'react';
import styles from './GroupDetails.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../BackButton/BackButton';
import { FaDownload, FaCalendarAlt, FaUser } from 'react-icons/fa';

const GroupDetails = () => {
  const { chamaId } = useParams();
  const [group, setGroup] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [meetingNotes, setMeetingNotes] = useState([]);

  const handleBack = () => {
    window.history.back();
  };

  const handleLeaveChama = () => {
    if (window.confirm('Are you sure you want to leave the group? This action cannot be undone.')) {
      alert('You have left the group.');
      // Implement PATCH or DELETE logic to remove user from group_members
    }
  };

useEffect(() => {
  const fetchGroupDetails = async () => {
    try {
      const [groupRes, rulesRes, membersRes, notesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/rules`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/groups/${chamaId}/members`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/meetings?groupId=${chamaId}`)
      ]);

      setGroup(groupRes.data);
      setRules(rulesRes.data);
      setMembers(membersRes.data);
      setMeetingNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError('Failed to load group details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchGroupDetails();
}, [chamaId]);

  if (loading) return <div className={styles.loading}>Loading group information...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!group) return <div className={styles.error}>No group found.</div>;

  return (
    <div className={styles.container}>
      <BackButton onClick={handleBack} />

      <h2 className={styles.groupName}>{group.group_name}</h2>
      <p className={styles.groupCode}>Group Code: {group.group_code}</p>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Description</h3>
          <p className={styles.cardContent}>{group.description || 'No description available'}</p>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Members</h3>
          <div className={styles.membersList}>
            {members.length === 0 ? (
              <p>No members found</p>
            ) : (
              members.map((member) => (
                <div key={member.user_id} className={styles.memberItem}>
                  <div className={styles.memberAvatar}>
                    {member.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.full_name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Group Rules</h3>
          {rules.length === 0 ? (
            <p className={styles.noRules}>No rules added yet.</p>
          ) : (
            <ul className={styles.rulesList}>
              {rules.map((rule) => (
                <li key={rule.id} className={styles.ruleItem}>
                  <div className={styles.ruleBullet}></div>
                  <span>{rule.rule_description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.infoCard}>
        <h3 className={styles.cardTitle}>Meeting Notes</h3>
        {meetingNotes.length === 0 ? (
          <p className={styles.noNotes}>No meeting notes uploaded yet.</p>
        ) : (
          <div className={styles.notesGrid}>
            {meetingNotes.map(note => (
              <div key={note.note_id} className={styles.noteCard}>
                <div className={styles.noteHeader}>
                  <h4 className={styles.noteTitle}>{note.title}</h4>
                  <div className={styles.noteMeta}>
                    <span className={styles.metaItem}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      {new Date(note.uploaded_at).toLocaleDateString()}
                    </span>
                    <span className={styles.metaItem}>
                      <FaUser className={styles.metaIcon} />
                      {note.full_name}
                    </span>
                  </div>
                </div>
                <div className={styles.noteContent}>
                  <p className={styles.noteSummary}>{note.summary || 'No summary available'}</p>
                  <a 
                    href={note.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.downloadButton}
                  >
                    <FaDownload /> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className={styles.actions}>
        <button onClick={handleLeaveChama} className={styles.leaveButton}>
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;

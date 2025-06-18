// src/pages/ChairpersonDashboard/ChairpersonGroupDetails.js
import React, { useEffect, useState } from 'react';
import styles from './ChairpersonGroupDetails.module.css';

const ChairpersonGroupDetails = ({ chamaId }) => {
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  useEffect(() => {
    fetch(`http://localhost:3001/groups/${chamaId}`)
      .then((res) => res.json())
      .then((data) => setGroupDetails(data));

    fetch(`http://localhost:3001/group_members?groupId=${chamaId}`)
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, [chamaId]);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) return alert('Enter name and role');

    const response = await fetch(`http://localhost:3001/group_members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: chamaId, ...newMember }),
    });

    if (response.ok) {
      const added = await response.json();
      setMembers((prev) => [...prev, added]);
      setNewMember({ name: '', role: '' });
    }
  };

  const handleRemoveMember = async (memberId) => {
    const response = await fetch(`http://localhost:3001/group_members/${memberId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Group Details</h2>
      {groupDetails && (
        <div className={styles.groupInfo}>
          <p><strong>Name:</strong> {groupDetails.name}</p>
          <p><strong>Description:</strong> {groupDetails.description}</p>
        </div>
      )}

      <h3 className={styles.membersTitle}>Members</h3>
      <ul className={styles.memberList}>
        {members.map((member) => (
          <li key={member.id} className={styles.memberItem}>
            {member.name} - {member.role}
            <button className={styles.removeButton} onClick={() => handleRemoveMember(member.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.addMemberSection}>
        <input
          type="text"
          placeholder="Full Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
        />
        <button className={styles.addButton} onClick={handleAddMember}>Add Member</button>
      </div>
    </div>
  );
};

export default ChairpersonGroupDetails;

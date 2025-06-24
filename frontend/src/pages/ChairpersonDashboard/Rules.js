// Rules.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import styles from './Rules.module.css';

function Rules({ chamaId }) {
  const { currentUser } = useContext(UserContext);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isChairperson, setIsChairperson] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const rulesRes = await axios.get(`${BACKEND}/api/chamas/groups/${chamaId}/rules`);
        const groupRes = await axios.get(`${BACKEND}/api/chamas/groups/${chamaId}`);
        const groupData = groupRes.data;

        setIsChairperson(currentUser && currentUser.user_id === groupData.created_by);
        setRules(rulesRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load rules. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chamaId, currentUser, BACKEND]);

  const handleAddRule = async () => {
    if (!newRule.trim()) {
      setError('Rule cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND}/api/chamas/groups/${chamaId}/rules`, {
        rule_description: newRule,
        created_by: currentUser.user_id
      });

      setRules([...rules, response.data]);
      setNewRule('');
      setError('');
    } catch (err) {
      console.error('Error adding rule:', err);
      setError('Failed to add rule. Please try again.');
    }
  };

  const startEditing = (id, description) => {
    setEditingId(id);
    setEditText(description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) {
      setError('Rule cannot be empty');
      return;
    }

    try {
      await axios.patch(`${BACKEND}/api/chamas/rules/${id}`, {
        rule_description: editText
      });

      setRules(rules.map(rule =>
        rule.rule_id === id ? { ...rule, rule_description: editText } : rule
      ));
      setEditingId(null);
      setError('');
    } catch (err) {
      console.error('Error updating rule:', err);
      setError('Failed to update rule. Please try again.');
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;

    try {
      await axios.delete(`${BACKEND}/api/chamas/rules/${id}`);
      setRules(rules.filter(rule => rule.rule_id !== id));
    } catch (err) {
      console.error('Error deleting rule:', err);
      setError('Failed to delete rule.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Group Rules</h2>
        {isChairperson && (
          <button
            className={styles.addButton}
            onClick={() => document.getElementById('newRuleInput').focus()}
          >
            <FaPlus className={styles.plusIcon} /> Add Rule
          </button>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading rules...</p>
        </div>
      ) : rules.length === 0 ? (
        <div className={styles.noRules}>
          <div className={styles.noRulesIcon}>📜</div>
          <p>No rules have been added yet</p>
          {isChairperson && (
            <p className={styles.addPrompt}>Add the first rule using the button above</p>
          )}
        </div>
      ) : (
        <ol className={styles.rulesList}>
          {rules.map((rule, index) => (
            <li key={rule.rule_id} className={styles.ruleItem}>
              {editingId === rule.rule_id ? (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={styles.editInput}
                    autoFocus
                  />
                  <div className={styles.editActions}>
                    <button
                      className={styles.saveButton}
                      onClick={() => saveEdit(rule.rule_id)}
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={cancelEditing}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.ruleContent}>
                    <span className={styles.ruleNumber}>{index + 1}.</span>
                    <span className={styles.ruleText}>{rule.rule_description}</span>
                  </div>
                  {isChairperson && (
                    <div className={styles.ruleActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => startEditing(rule.rule_id, rule.rule_description)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteRule(rule.rule_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      )}

      {isChairperson && (
        <div className={styles.addRuleContainer}>
          <input
            id="newRuleInput"
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Enter a new rule..."
            className={styles.newRuleInput}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
          />
          <button
            className={styles.addRuleButton}
            onClick={handleAddRule}
          >
            Add Rule
          </button>
        </div>
      )}
    </div>
  );
}

export default Rules;

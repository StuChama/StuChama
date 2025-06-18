// Rules.js
import React, { useEffect, useState } from 'react';

function Rules({ chamaId }) {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/rules?groupId=${chamaId}`)
      .then((res) => res.json())
      .then((data) => setRules(data));
  }, [chamaId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Group Rules</h2>
      <ul className="list-decimal ml-6">
        {rules.map((rule, index) => (
          <li key={index}>{rule.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default Rules;

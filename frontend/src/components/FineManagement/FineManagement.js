// FineManagement.js
import React, { useEffect, useState } from 'react';

function FineManagement({ chamaId }) {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/fines?groupId=${chamaId}`)
      .then((res) => res.json())
      .then((data) => setFines(data));
  }, [chamaId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fine Management</h2>
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Member</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td className="p-2 border">{fine.memberName}</td>
              <td className="p-2 border">KES {fine.amount}</td>
              <td className="p-2 border">{fine.reason}</td>
              <td className="p-2 border">{fine.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FineManagement;

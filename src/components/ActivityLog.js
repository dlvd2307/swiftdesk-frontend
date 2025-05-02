import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ActivityLog({ ticketId }) {
  const [logs, setLogs] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      axios.get(`http://localhost:5000/tickets/${ticketId}/activities`)
        .then(res => setLogs(res.data))
        .catch(err => console.error("Error fetching activity log:", err));
    }
  }, [show, ticketId]);

  return (
    <div style={{ marginTop: '10px' }}>
      <button onClick={() => setShow(!show)}>
        {show ? "🧾 Hide History" : "📝 Show History"}
      </button>

      {show && logs.length > 0 && (
        <ul style={{ marginTop: '5px' }}>
          {logs.map(log => (
            <li key={log.id}>
              {new Date(log.timestamp).toLocaleString()} — {log.message}
            </li>
          ))}
        </ul>
      )}

      {show && logs.length === 0 && (
        <p>No activity recorded.</p>
      )}
    </div>
  );
}

export default ActivityLog;

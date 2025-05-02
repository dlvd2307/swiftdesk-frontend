import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TicketList({ refresh }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/tickets`, { withCredentials: true })
      .then(res => setTickets(res.data))
      .catch(() => setTickets([]));
  }, [refresh]);

  return (
    <div>
      <h2>📋 Ticket List</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <strong>{ticket.title}</strong> - {ticket.description} <br />
              Status: {ticket.status} | Priority: {ticket.priority} | Submitted by: {ticket.submitted_by}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function TicketList({ refresh, userRole }) {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/tickets`, { withCredentials: true })
      .then(res => setTickets(res.data))
      .catch(() => setTickets([]));
  }, [refresh]);

  const updateTicket = (id, field, value) => {
    axios.patch(`${process.env.REACT_APP_API_BASE}/tickets/${id}`, { [field]: value }, { withCredentials: true })
      .then(res => {
        setTickets(tickets.map(t => t.id === id ? res.data : t));
        toast.success(`✅ ${field} updated`);
      })
      .catch(() => toast.error(`❌ Failed to update ${field}`));
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return { color: 'red', fontWeight: 'bold' };
      case 'Medium': return { color: 'orange', fontWeight: 'bold' };
      case 'Low': return { color: 'green', fontWeight: 'bold' };
      default: return {};
    }
  };

  const filtered = tickets.filter(ticket => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submitted_by.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const groupedByStatus = {
    'Open': [],
    'In Progress': [],
    'Resolved': [],
    'Closed': []
  };

  filtered.forEach(ticket => {
    groupedByStatus[ticket.status]?.push(ticket);
  });

  const renderGroup = (statusLabel, icon) => (
    <div key={statusLabel} style={{ marginBottom: '2rem' }}>
      <h3>{icon} {statusLabel}</h3>
      {groupedByStatus[statusLabel].length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>None</p>
      ) : (
        <ul>
          {groupedByStatus[statusLabel].map(ticket => (
            <li key={ticket.id} style={{ marginBottom: '1rem' }}>
              <strong>{ticket.title}</strong> — {ticket.description} <br />
              Submitted by: <em>{ticket.submitted_by}</em> <br />
              Status:{" "}
              {userRole === "admin" ? (
                <select value={ticket.status} onChange={(e) => updateTicket(ticket.id, "status", e.target.value)}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                ticket.status
              )}
              {" | "}
              Priority:{" "}
              {userRole === "admin" ? (
                <select value={ticket.priority} onChange={(e) => updateTicket(ticket.id, "priority", e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <span style={getPriorityStyle(ticket.priority)}>{ticket.priority}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div>
      <h2>📋 Tickets</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />{" "}
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {Object.keys(groupedByStatus).map(status =>
        renderGroup(status, {
          'Open': '🟢',
          'In Progress': '🔧',
          'Resolved': '✅',
          'Closed': '🚫'
        }[status])
      )}
    </div>
  );
}

export default TicketList;

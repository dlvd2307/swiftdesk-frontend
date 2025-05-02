import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function TicketList({ refresh, userRole }) {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE}/tickets`, { withCredentials: true })
      .then(res => setTickets(res.data))
      .catch(() => setTickets([]));
  }, [refresh]);

  const updateTicket = (id, field, value) => {
    axios
      .patch(`${process.env.REACT_APP_API_BASE}/tickets/${id}`, { [field]: value }, { withCredentials: true })
      .then(res => {
        setTickets(tickets.map(t => (t.id === id ? res.data : t)));
        toast.success(`✅ ${field} updated`);
      })
      .catch(() => toast.error(`❌ Failed to update ${field}`));
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#ffdddd', borderLeft: '4px solid red' };
      case 'Medium':
        return { backgroundColor: '#fff8dc', borderLeft: '4px solid orange' };
      case 'Low':
        return { backgroundColor: '#ddeeff', borderLeft: '4px solid blue' };
      default:
        return {};
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

  const renderGroup = (statusLabel) => (
    <div key={statusLabel} style={{ marginBottom: '2rem' }}>
      <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>{statusLabel}</h3>
      {groupedByStatus[statusLabel].length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>None</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {groupedByStatus[statusLabel].map(ticket => (
            <div
              key={ticket.id}
              style={{
                ...getPriorityStyle(ticket.priority),
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{ marginTop: 0 }}>{ticket.title}</h4>
              <p>{ticket.description}</p>
              <p><strong>Submitted by:</strong> {ticket.submitted_by}</p>
              <p>
                <strong>Status:</strong>{" "}
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
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                {userRole === "admin" ? (
                  <select value={ticket.priority} onChange={(e) => updateTicket(ticket.id, "priority", e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  ticket.priority
                )}
              </p>
            </div>
          ))}
        </div>
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

      {Object.keys(groupedByStatus).map(renderGroup)}
    </div>
  );
}

export default TicketList;

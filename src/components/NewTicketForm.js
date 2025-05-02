import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function NewTicketForm({ onCreate, userRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [submittedBy, setSubmittedBy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority: userRole === 'admin' ? priority : 'Low',
      submitted_by: submittedBy || 'Unknown'
    };

    axios.post(`${process.env.REACT_APP_API_BASE}/tickets`, payload, { withCredentials: true })
      .then(() => {
        toast.success("🎫 Ticket submitted");
        setTitle('');
        setDescription('');
        setSubmittedBy('');
        if (userRole === 'admin') setPriority('Low');
        onCreate();
      })
      .catch(() => toast.error("❌ Error submitting ticket"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>📨 Submit a Ticket</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={submittedBy}
        onChange={e => setSubmittedBy(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      /><br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      /><br />
      {userRole === 'admin' && (
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      )}<br />
      <button type="submit">Submit Ticket</button>
    </form>
  );
}

export default NewTicketForm;

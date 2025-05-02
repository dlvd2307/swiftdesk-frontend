import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_BASE}/register`, {
      username,
      password
    }, { withCredentials: true })
      .then(() => {
        toast.success("✅ Registration successful. You can now log in.");
        onRegistered();
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          toast.error("❌ Username already exists.");
        } else {
          toast.error("❌ Registration failed.");
        }
      });
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>📝 Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
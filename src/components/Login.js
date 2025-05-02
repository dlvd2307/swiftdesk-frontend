import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_BASE}/login`, {
      username,
      password
    }, { withCredentials: true })
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.data));
        onLogin(res.data);
        toast.success("✅ Logged in!");
      })
      .catch(() => toast.error("❌ Invalid credentials."));
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>🔐 Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
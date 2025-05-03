import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketList from './components/TicketList';
import NewTicketForm from './components/NewTicketForm';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/me`)
      .then(res => {
        if (res.data) {
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    axios.post(`${process.env.REACT_APP_API_BASE}/logout`)
      .then(() => {
        localStorage.removeItem("user");
        setUser(null);
      });
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      {user ? (
        <>
          <Header user={user} onLogout={handleLogout} />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

          <div style={{ padding: '24px' }}>
            <NewTicketForm onCreate={() => setRefresh(prev => !prev)} userRole={user.role} />
            {user.role === 'admin' && (
              <TicketList refresh={refresh} userRole={user.role} />
            )}
          </div>
        </>
      ) : (
        <div style={{ padding: '24px' }}>
          <h1> 🚀  SwiftDesk</h1>
          {showRegister ? (
            <>
              <Register onRegistered={() => setShowRegister(false)} />
              <p>Already have an account? <button onClick={() => setShowRegister(false)}>Login</button></p>
            </>
          ) : (
            <>
              <Login onLogin={setUser} />
              <p>No account yet? <button onClick={() => setShowRegister(true)}>Register</button></p>
            </>
          )}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      )}
    </div>
  );
}

export default App;
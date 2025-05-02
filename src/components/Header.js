import React from 'react';

function Header({ user, onLogout }) {
  const headerStyle = {
    backgroundColor: '#20232a',
    color: 'white',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  };

  const left = {
    fontWeight: 'bold',
    fontSize: '1.3em'
  };

  const right = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '0.9em'
  };

  const logoutBtn = {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <header style={headerStyle}>
      <div style={left}>🚀 SwiftDesk</div>
      <div style={right}>
        <span>👤 {user.username} ({user.role})</span>
        <button onClick={onLogout} style={logoutBtn}>Logout</button>
      </div>
    </header>
  );
}

export default Header;

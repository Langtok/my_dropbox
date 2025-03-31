import React from 'react';
import './Sidebar.css';

function Sidebar({ currentView, setView }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Dropbox</h2> {/* Simplified to match branding */}
      </div>
      <nav>
        <button
          className={currentView === 'files' ? 'active' : ''}
          onClick={() => setView('files')}
        >
          <span className="icon">🏠</span> Home
        </button>
        <button
          className={currentView === 'profile' ? 'active' : ''}
          onClick={() => setView('profile')}
        >
          <span className="icon">👤</span> Account
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
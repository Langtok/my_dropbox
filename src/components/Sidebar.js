import React from 'react';
import './Sidebar.css';

function Sidebar({ currentView, setView }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>My Dropbox-Clone</h2>
      </div>
      <nav>
        <button 
          className={currentView === 'files' ? 'active' : ''} 
          onClick={() => setView('files')}
        >
          <span className="icon">📁</span> Files
        </button>
        <button 
          className={currentView === 'profile' ? 'active' : ''} 
          onClick={() => setView('profile')}
        >
          <span className="icon">👤</span> Profile
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
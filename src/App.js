import React, { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from '@aws-amplify/auth';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPath, setCurrentPath] = useState('public/');
  const [view, setView] = useState('files');

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    setCurrentPath(path);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar currentView={view} setView={setView} />
      <div className="main-content">
        <header className="app-header">
          <h1>{view === 'files' ? 'Files' : 'Profile'}</h1>
          <button className="btn btn-danger sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </header>
        <main>
          {view === 'files' ? (
            <>
              <FileUpload 
                onUploadComplete={handleUploadComplete} 
                currentPath={currentPath} 
              />
              <FileList 
                refreshTrigger={refreshTrigger} 
                currentPath={currentPath} 
                onNavigate={handleNavigate} 
              />
            </>
          ) : (
            <Profile />
          )}
        </main>
      </div>
    </div>
  );
}
const components = {
  Header() {
    return (
      <div className="text-center mb-4">
      </div>
    );
  },
  SignIn: {
    Header() {
      return (
        <h4 className="text-center text-dark mb-4">
          Sign in to your account
        </h4>
      );
    },
    Footer() {
      return null;
    },
    Username(props) {
      return (
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Email</label>
          <input
            {...props}
            id="username"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
      );
    },
    Password(props) {
      return (
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            {...props}
            id="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
      );
    },
    Button(props) {
      return (
        <button
          {...props}
          className="btn btn-primary w-100"
        >
          Sign In
        </button>
      );
    },
  },
};

export default withAuthenticator(App, { components });
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
          <div className="header-left">
            <h1>{view === 'files' ? 'Files' : 'Account'}</h1>
            {view === 'files' && (
              <span className="path-info">Path: {currentPath}</span>
            )}
          </div>
          <div className="header-right">
            <button className="sign-out-button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </header>
        <main className="app-main">
          {view === 'files' ? (
            <div className="files-view">
              <FileUpload 
                onUploadComplete={handleUploadComplete} 
                currentPath={currentPath} 
              />
              <FileList 
                refreshTrigger={refreshTrigger} 
                currentPath={currentPath} 
                onNavigate={handleNavigate} 
              />
            </div>
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
      <div className="auth-header">
        <h2>Dropbox</h2>
      </div>
    );
  },
  SignIn: {
    Header() {
      return (
        <div className="auth-subheader">
          <h3>Sign in to your account</h3>
        </div>
      );
    },
    Footer() {
      return (
        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/sign-up">Sign up</a>
          </p>
        </div>
      );
    },
    Username(props) {
      return (
        <div className="auth-field">
          <label htmlFor="username">Email</label>
          <input
            {...props}
            id="username"
            className="auth-input"
            placeholder="Enter your email"
          />
        </div>
      );
    },
    Password(props) {
      return (
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            {...props}
            id="password"
            className="auth-input"
            placeholder="Enter your password"
          />
        </div>
      );
    },
    Button(props) {
      return (
        <button {...props} className="auth-button">
          Sign In
        </button>
      );
    },
  },
  SignUp: {
    Header() {
      return (
        <div className="auth-subheader">
          <h3>Create your account</h3>
        </div>
      );
    },
    Footer() {
      return (
        <div className="auth-footer">
          <p>
            Already have an account? <a href="/sign-in">Sign in</a>
          </p>
        </div>
      );
    },
    Username(props) {
      return (
        <div className="auth-field">
          <label htmlFor="username">Email</label>
          <input
            {...props}
            id="username"
            className="auth-input"
            placeholder="Enter your email"
          />
        </div>
      );
    },
    Password(props) {
      return (
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            {...props}
            id="password"
            className="auth-input"
            placeholder="Create a password"
          />
        </div>
      );
    },
    Button(props) {
      return (
        <button {...props} className="auth-button">
          Sign Up
        </button>
      );
    },
  },
};

export default withAuthenticator(App, { components });
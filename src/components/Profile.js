import React, { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserAttributes, updatePassword } from '@aws-amplify/auth';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      const attributes = await fetchUserAttributes();
      console.log('User attributes:', attributes);
      setUser(currentUser);
      setEmail(attributes.email || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('No user data available to update.');
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await updatePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile">
      <div className="profile-field">
        <label>Username:</label>
        <input
          type="text"
          value={user?.username || 'N/A'}
          disabled
        />
      </div>
      <div className="profile-field">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          disabled
        />
      </div>
      <div className="profile-field">
        <label>Old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          disabled={saving}
        />
      </div>
      <div className="profile-field">
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={saving}
        />
      </div>
      <div className="profile-field">
        <label>Confirm New Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={saving}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="save-button"
      >
        {saving ? 'Saving...' : 'Update Password'}
      </button>
    </div>
  );
}

export default Profile;
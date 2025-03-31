import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import './FileUpload.css';

function FileUpload({ onUploadComplete, currentPath }) {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const basePath = currentPath.replace(/\/+$/, '');
      const uploadKey = `${basePath}/${file.name}`;
      console.log('Uploading to:', uploadKey);
      await uploadData({
        key: uploadKey,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;
      setFile(null);
      alert('File uploaded successfully!');
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName || creatingFolder) return;
    setCreatingFolder(true);
    try {
      const basePath = currentPath.replace(/\/+$/, '');
      const folderKey = `${basePath}/${folderName.replace(/^\/+|\/+$/g, '')}/`;
      console.log('Creating folder at:', folderKey);
      await uploadData({
        key: folderKey,
        data: '',
        options: {
          contentType: 'application/x-directory',
        },
      }).result;
      setFolderName('');
      alert('Folder created successfully!');
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Folder creation failed!');
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading || creatingFolder}
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading || creatingFolder}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      <div className="folder-section">
        <input
          type="text"
          value={folderName}
          onChange={handleFolderNameChange}
          placeholder="Enter folder name"
          disabled={uploading || creatingFolder}
        />
        <button
          onClick={handleCreateFolder}
          disabled={!folderName || uploading || creatingFolder}
        >
          {creatingFolder ? 'Creating...' : 'Create Folder'}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
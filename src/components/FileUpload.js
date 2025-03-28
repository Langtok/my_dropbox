import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import './FileUpload.css';

function FileUpload({ onUploadComplete, currentPath }) {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFolderChange = (e) => {
    setFolder(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const basePath = currentPath.replace(/\/+$/, '');
      const folderPath = folder ? `${folder.replace(/^\/+|\/+$/g, '')}` : '';
      const uploadKey = folderPath 
        ? `${basePath}/${folderPath}/${file.name}` 
        : `${basePath}/${file.name}`;
      await uploadData({
        key: uploadKey,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;
      setFile(null);
      setFolder('');
      alert('File uploaded successfully!');
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed!');
    }
    setUploading(false);
  };

  return (
    <div className="file-upload">
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUpload;
import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import './FileUpload.css';

function FileUpload({ onUploadComplete, currentPath }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const basePath = currentPath.replace(/\/+$/, '');
      const uploadKey = `${basePath}/${file.name}`;
      await uploadData({
        key: uploadKey,
        data: file,
        options: { contentType: file.type },
      }).result;
      setFile(null);
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setUploading(false);
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUpload;
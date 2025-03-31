import React, { useState, useEffect, useCallback } from 'react';
import { list, remove, getUrl } from '@aws-amplify/storage';
import './FileList.css';

function FileList({ refreshTrigger, currentPath, onNavigate }) {
  const [files, setFiles] = useState([]);
  const [shareUrl, setShareUrl] = useState({});

  const fetchFiles = useCallback(async () => {
    try {
      const normalizedPath = currentPath.replace(/\/+$/, '') + '/';
      const fileList = await list({ path: normalizedPath });
      const items = fileList.items.map(item => ({
        ...item,
        isFolder: item.path.endsWith('/')
      }));
      setFiles(items);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshTrigger]);

  const handleDelete = async (path) => {
    try {
      const key = path.replace('public/', '');
      await remove({ key });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handlePreview = async (path) => {
    if (path.endsWith('/')) return;
    try {
      const key = path.replace('public/', '');
      const { url } = await getUrl({ key });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating preview URL:', error);
    }
  };

  const handleShare = async (path) => {
    if (path.endsWith('/')) return;
    try {
      const key = path.replace('public/', '');
      const { url } = await getUrl({ key, options: { expiresIn: 604800 } });
      setShareUrl(prev => ({ ...prev, [path]: url }));
    } catch (error) {
      console.error('Error generating share link:', error);
    }
  };

  const handleCopy = (path) => {
    navigator.clipboard.writeText(shareUrl[path]);
  };

  const clearShareUrl = (path) => {
    setShareUrl(prev => {
      const newUrls = { ...prev };
      delete newUrls[path];
      return newUrls;
    });
  };

  const handleFolderClick = (path) => {
    if (!path.endsWith('/')) return;
    console.log('Navigating to folder:', path); // Debug log
    onNavigate(path);
  };

  const handleBreadcrumbClick = (index) => {
    const parts = currentPath.split('/').filter(Boolean);
    const newPath = 'public/' + parts.slice(1, index + 1).join('/') + '/';
    onNavigate(newPath);
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="file-list">
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="breadcrumb-link"
            >
              {crumb}
            </button>
            {index < breadcrumbs.length - 1 && <span className="separator">/</span>}
          </span>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.path}>
              <td>
                <span
                  onClick={() => handleFolderClick(file.path)}
                  className={file.isFolder ? 'folder' : 'file'}
                >
                  {file.isFolder ? '📁' : '📄'} {file.path.replace(currentPath, '')}
                </span>
              </td>
              <td>{file.size ? (file.size / 1024).toFixed(2) : '—'} KB</td>
              <td>
                {!file.isFolder && (
                  <div className="actions">
                    <button onClick={() => handlePreview(file.path)}>Preview</button>
                    <button onClick={() => handleShare(file.path)}>Share</button>
                    {shareUrl[file.path] && (
                      <div className="share-container">
                        <input type="text" value={shareUrl[file.path]} readOnly />
                        <button onClick={() => handleCopy(file.path)}>Copy</button>
                        <button onClick={() => clearShareUrl(file.path)}>✕</button>
                      </div>
                    )}
                    <button onClick={() => handleDelete(file.path)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;
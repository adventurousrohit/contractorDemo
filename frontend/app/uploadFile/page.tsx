 "use client"
import React from 'react';
import axios from 'axios';
import {getCookieWithKey}  from '../utils/cookie'


const FileUploadComponent = () => {
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');

  // Handle file selection
  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (selectedFile && (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Invalid file type. Only JSON and TXT files are allowed.');
      setFile(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getCookieWithKey('token')
      const response = await axios.post('/api/contract/upload/contract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(token)}`, 
        },
      });

      setMessage(response.data.message); 
      setError('');
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Contract File</h2>

      {/* File input */}
      <input
        type="file"
        accept=".json,.txt,.csv"
        onChange={handleFileChange}
        className="block w-full mb-4 border border-gray-300 rounded-md p-2"
      />

      {/* Error message */}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Upload Button */}
      <button
        onClick={handleFileUpload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
      >
        Upload
      </button>

      {/* Success message */}
      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
};

export default FileUploadComponent;

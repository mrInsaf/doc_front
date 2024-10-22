// src/UploadDocument.js
import React, { useState } from 'react';
import axios from 'axios';

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('https://mr-morkow.ru:8888/document_api/upload/', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `updated_${file.name}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Upload Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input type="text" value={title} onChange={handleTitleChange} required />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea value={description} onChange={handleDescriptionChange} required />
          </label>
        </div>
        <div>
          <label>
            Upload DOCX:
            <input type="file" accept=".docx" onChange={handleFileChange} required />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UploadDocument;

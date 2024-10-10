import React, { useState } from 'react';
import axios from 'axios';

function App() {
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
      const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
        responseType: 'blob', // Указываем, что ожидаем файл
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Создаем URL для полученного файла
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Создаем элемент <a> для скачивания файла
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `updated_${file.name}`); // Устанавливаем имя для скачиваемого файла
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Убираем элемент <a> из DOM
      window.URL.revokeObjectURL(url); // Освобождаем URL

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

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadDocument from './UploadDocument'; // Импортируем новый компонент
import Scanner from './Scanner'; // Импортируем компонент сканера

function App() {
  return (
    <Router>
      <div>
        <nav>

        </nav>
        <Routes>
          <Route path="/" element={<UploadDocument />} />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

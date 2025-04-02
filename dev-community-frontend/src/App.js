import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import TempPage from './components/TempPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/temp" element={<TempPage />} />
        <Route path="/mypage" element={<div>마이페이지 (준비 중)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
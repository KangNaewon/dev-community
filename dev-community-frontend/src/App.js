import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import TempPage from './components/TempPage';
import PopularPosts from './components/PopularPosts';
import AllPosts from './components/AllPosts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/temp" element={<TempPage />} />
        <Route path="/mypage" element={<div>마이페이지 (준비 중)</div>} />
        <Route path="/popular-posts" element={<PopularPosts />} />
        <Route path="/all-posts" element={<AllPosts />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import MainPage from './components/MainPage';
import PopularPosts from './components/PopularPosts';
import AllPosts from './components/AllPosts';
import PostDetail from './components/PostDetail';
import EditPost from './components/EditPost'; // 게시글 수정 페이지 컴포넌트 추가
import MyPage from './components/MyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/popular-posts" element={<PopularPosts />} />
        <Route path="/all-posts" element={<AllPosts />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/edit-post/:id" element={<EditPost />} /> {/* 게시글 수정 페이지 Route 추가 */}
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
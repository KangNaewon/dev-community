import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPosts } from '../data/dummyData';
import './PostsPage.css';

const PopularPosts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 좋아요 순으로 정렬된 게시글
  const sortedPosts = [...dummyPosts].sort((a, b) => b.likes - a.likes);
  
  // 현재 페이지의 게시글
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="posts-page">
      <header className="posts-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <h1>인기 게시글</h1>
      </header>
      
      <main className="posts-main">
        {currentPosts.map(post => (
          <div
            key={post.id}
            className="post-item"
            onClick={() => navigate(`/post/${post.id}`)} // 게시글 ID를 기반으로 상세 페이지로 이동
            style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
          >
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.date}</span>
              </div>
            </div>
            <div className="post-likes">
              <i className="bx bx-like"></i>
              <span>{post.likes}</span>
            </div>
          </div>
        ))}
        
        <div className="pagination">
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`page-number ${currentPage === number ? 'active' : ''}`}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PopularPosts;
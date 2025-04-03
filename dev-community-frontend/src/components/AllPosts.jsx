import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPosts } from '../data/dummyData';
import './PostsPage.css';

const AllPosts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 날짜순으로 정렬된 게시글
  const sortedPosts = [...dummyPosts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="posts-page">
      <header className="posts-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <h1>전체 게시글</h1>
      </header>
      
      <main className="posts-main">
        {currentPosts.map(post => (
          <div key={post.id} className="post-item">
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

export default AllPosts;
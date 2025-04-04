import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPageStyles.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');
  const [popularPosts, setPopularPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 인기 게시글 가져오기 (추천수 기준 정렬)
        const popularResponse = await axios.get('/post', {
          params: {
            page: 0,
            size: 8,
            sort: 'recommendCount,desc'
          }
        });
        setPopularPosts(popularResponse.data.content);
        
        // 전체 게시글 가져오기 (최신순 정렬)
        const allPostsResponse = await axios.get('/post', {
          params: {
            page: 0,
            size: 8,
            sort: 'createdAt,desc'
          }
        });
        setAllPosts(allPostsResponse.data.content);
        
        setLoading(false);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      localStorage.removeItem('user');
      navigate('/');
      if (error.response?.status === 401) {
        setLogoutError('이미 로그아웃되었거나 세션이 만료되었습니다.');
      } else {
        setLogoutError('로그아웃 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePostClick = (id) => {
    navigate(`/post/${id}`); // 게시글 ID를 기반으로 상세 페이지로 이동
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <div className="header-left">
          <div className="logo-container">
            <img src="https://cdn-icons-png.flaticon.com/512/2721/2721620.png" alt="Logo" className="logo-img" />
            <h1>DevConnect</h1>
          </div>
        </div>
        <div className="header-right">
          <button className="mypage-btn" onClick={() => navigate('/mypage')}>
            <i className="bx bx-user"></i> 마이페이지
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bx bx-log-out"></i> 로그아웃
          </button>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h2>개발자들을 위한 커뮤니티</h2>
          <p>지식을 공유하고 함께 성장하세요</p>
        </div>
        <div className="hero-image">
          <img 
            src="https://image.freepik.com/free-vector/developer-activity-concept-illustration_114360-2801.jpg" 
            alt="Developer activity" 
          />
        </div>
      </div>

      <main className="community-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        ) : (
          <div className="posts-container">
            <section className="posts-section popular-posts">
              <div className="section-header">
                <h2>인기 게시글</h2>
                <button 
                  className="show-more-btn"
                  onClick={() => navigate('/popular-posts')}
                >
                  <i className="bx bx-plus"></i>
                </button>
              </div>
              <div className="post-list">
                {popularPosts.length > 0 ? (
                  popularPosts.map(post => (
                    <div 
                      key={post.id} 
                      className="post-item" 
                      onClick={() => handlePostClick(post.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="post-content">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          <span className="post-author">{post.author.nickname}</span>
                          <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="post-likes">
                        <i className="bx bx-like"></i>
                        <span>{post.recommendCount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-posts">
                    <p>인기 게시글이 없습니다.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="posts-section all-posts">
              <div className="section-header">
                <h2>전체 게시글</h2>
                <button 
                  className="show-more-btn"
                  onClick={() => navigate('/all-posts')}
                >
                  <i className="bx bx-plus"></i>
                </button>
              </div>
              <div className="post-list">
                {allPosts.length > 0 ? (
                  allPosts.map(post => (
                    <div 
                      key={post.id} 
                      className="post-item" 
                      onClick={() => handlePostClick(post.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="post-content">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          <span className="post-author">{post.author.nickname}</span>
                          <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="post-likes">
                        <i className="bx bx-like"></i>
                        <span>{post.recommendCount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-posts">
                    <p>게시글이 없습니다.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        <aside className="community-sidebar">
          <div className="sidebar-section user-profile">
            <div className="profile-header">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" className="profile-img" />
              <h3>환영합니다!</h3>
            </div>
            <p className="profile-info">테스트 사용자님</p>
            <button className="write-post-btn">
              <i className="bx bx-edit"></i> 새 글 작성하기
            </button>
          </div>
          
          <div className="sidebar-section">
            <h3>카테고리</h3>
            <ul>
              <li><i className="bx bx-code-alt"></i> 프론트엔드</li>
              <li><i className="bx bx-server"></i> 백엔드</li>
              <li><i className="bx bx-mobile"></i> 모바일</li>
              <li><i className="bx bx-cog"></i> 데브옵스</li>
              <li><i className="bx bx-brain"></i> 인공지능</li>
              <li><i className="bx bx-link-alt"></i> 블록체인</li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>인기 태그</h3>
            <div className="tag-cloud">
              <span className="tag">JavaScript</span>
              <span className="tag">React</span>
              <span className="tag">Python</span>
              <span className="tag">Node.js</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Docker</span>
            </div>
          </div>
        </aside>
      </main>

      <footer className="community-footer">
        <p>© 2025 레츠고</p>
        <p className="attribution">Login design inspired by <a href="https://codepen.io/thepuskar/pen/gOgPqaJ" target="_blank" rel="noopener noreferrer">Puskar Adhikari</a></p>
      </footer>
    </div>
  );
};

export default MainPage;
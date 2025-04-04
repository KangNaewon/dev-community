import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TempPageStyles.css';

const TempPage = () => {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

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

  // 게시글 더미 데이터
  const allPosts = [
    { id: 1, title: "React 18의 새로운 기능들", likes: 256, author: "김개발", date: "2023-05-15" },
    { id: 2, title: "Next.js vs React - 언제 무엇을 사용해야 할까?", likes: 198, author: "이프론트", date: "2023-05-14" },
    { id: 3, title: "TypeScript 초보자를 위한 가이드", likes: 175, author: "박타입", date: "2023-05-13" },
    { id: 4, title: "Node.js에서 비동기 처리 마스터하기", likes: 142, author: "최백엔드", date: "2023-05-12" },
    { id: 5, title: "개발자를 위한 Git 팁 10가지", likes: 137, author: "정깃헙", date: "2023-05-11" },
    { id: 6, title: "웹 성능 최적화 기법", likes: 129, author: "한퍼포먼스", date: "2023-05-10" },
    { id: 7, title: "프론트엔드 개발자가 알아야 할 보안 지식", likes: 118, author: "강보안", date: "2023-05-09" },
    { id: 8, title: "Docker 컨테이너 기초부터 응용까지", likes: 105, author: "윤도커", date: "2023-05-08" },
    { id: 9, title: "클린 코드 작성법 - 가독성 높은 코드 만들기", likes: 98, author: "조클린", date: "2023-05-07" },
    { id: 10, title: "프로그래밍 언어 트렌드 2023", likes: 87, author: "신트렌드", date: "2023-05-06" }
  ];

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
              {allPosts.slice(0, 8).map(post => (
                <div 
                  key={post.id} 
                  className="post-item" 
                  onClick={() => handlePostClick(post.id)} // 클릭 이벤트 추가
                  style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
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
              {allPosts.slice(0, 8).map(post => (
                <div 
                  key={post.id} 
                  className="post-item" 
                  onClick={() => handlePostClick(post.id)} // 클릭 이벤트 추가
                  style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
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
            </div>
          </section>
        </div>

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

export default TempPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EditPostStyles.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 전달받은 게시글 데이터
  const initialPost = location.state?.post;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(!initialPost);

  // 게시글 데이터 가져오기 (직접 URL로 접근한 경우)
  useEffect(() => {
    if (!initialPost) {
      const fetchPostDetail = async () => {
        try {
          setInitialLoading(true);
          const response = await axios.get(`/post/${id}`);
          const postData = response.data;
          setTitle(postData.title);
          setContent(postData.content);
          setInitialLoading(false);
        } catch (error) {
          console.error('게시글 로딩 실패:', error);
          setError('게시글을 불러오는데 실패했습니다.');
          setInitialLoading(false);
        }
      };

      fetchPostDetail();
    } else {
      // 이전 페이지에서 전달받은 데이터 사용
      setTitle(initialPost.title);
      setContent(initialPost.content);
    }
  }, [id, initialPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      
      // 게시글 수정 API 호출
      const response = await axios.put(`/post/${id}`, {
        title,
        content
      });
      
      setLoading(false);
      alert('게시글이 수정되었습니다.');
      navigate(`/post/${id}`); // 상세 페이지로 이동
    } catch (error) {
      setLoading(false);
      console.error('게시글 수정 실패:', error);
      
      // 에러 상태 코드에 따른 처리
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('제목과 내용을 올바르게 입력해주세요.');
            break;
          case 401:
            alert('로그인이 필요합니다.');
            navigate('/'); // 로그인 페이지로 이동
            break;
          case 403:
            alert('본인이 작성한 게시글만 수정할 수 있습니다.');
            navigate(`/post/${id}`); // 상세 페이지로 이동
            break;
          case 404:
            alert('게시글을 찾을 수 없습니다.');
            navigate('/main'); // 메인 페이지로 이동
            break;
          default:
            alert('게시글 수정에 실패했습니다.');
        }
      } else {
        alert('게시글 수정에 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/main')}>메인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="edit-post">
      <header className="community-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="back-to-main">
          <button onClick={() => navigate('/main')} className="back-main">
            <div className="logo-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2721/2721620.png"
                alt="Logo"
                className="logo-img"
              />
              <h1>DevConnect</h1>
            </div>
          </button>
        </div>
      </header>
      
      <div className="edit-post-container">
        <h1>게시글 수정</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows="15"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/post/${id}`)}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
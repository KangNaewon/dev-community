import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetailStyles.css';

const PostDetail = () => {
  const { id } = useParams(); // URL에서 id 파라미터를 가져옴
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState({}); // 각 댓글에 대한 대댓글 입력값
  const [showReplyInput, setShowReplyInput] = useState({}); // 각 댓글에 대한 대댓글 입력창 표시 여부

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/post/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  const handleLike = async () => {
    if (post.isRecommended) {
      alert('이미 추천하셨습니다.');
      return;
    }
    
    try {
      // 추천 API 호출 (실제 API 엔드포인트로 수정 필요)
      await axios.post(`/post/${id}/recommend`);
      
      // 추천 상태 업데이트
      setPost({
        ...post,
        recommendCount: post.recommendCount + 1,
        isRecommended: true
      });
    } catch (error) {
      console.error('추천 실패:', error);
      alert('추천에 실패했습니다.');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        // 댓글 추가 API 호출 (실제 API 엔드포인트로 수정 필요)
        const response = await axios.post(`/post/${id}/comment`, {
          content: newComment
        });
        
        // 새 댓글 추가
        const newCommentObj = response.data;
        setPost({
          ...post,
          comments: [...post.comments, newCommentObj]
        });
        setNewComment('');
      } catch (error) {
        console.error('댓글 등록 실패:', error);
        alert('댓글 등록에 실패했습니다.');
      }
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // 현재 상태를 토글
    }));
  };

  const handleAddReply = async (commentId) => {
    if (replyContent[commentId]?.trim()) {
      try {
        // 대댓글 추가 API 호출 (실제 API 엔드포인트로 수정 필요)
        const response = await axios.post(`/post/${id}/comment/${commentId}/reply`, {
          content: replyContent[commentId]
        });
        
        // 새 대댓글 추가 (API 응답 구조에 따라 수정 필요)
        const newReply = response.data;
        
        // 댓글 목록 업데이트 (API 응답 구조에 따라 수정 필요)
        // 현재 API 응답에 대댓글 구조가 명확하지 않아 임시 처리
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        );
        
        setPost({
          ...post,
          comments: updatedComments
        });
        
        setReplyContent({ ...replyContent, [commentId]: '' }); // 입력값 초기화
        setShowReplyInput({ ...showReplyInput, [commentId]: false }); // 대댓글 입력창 닫기
      } catch (error) {
        console.error('대댓글 등록 실패:', error);
        alert('대댓글 등록에 실패했습니다.');
      }
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동 (예: `/edit-post/:id`)
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        // 게시글 삭제 API 호출
        const response = await axios.delete(`/post/${id}`);
        
        // 204 상태 코드는 성공이지만 내용이 없음을 의미
        alert('게시글이 삭제되었습니다.');
        navigate('/main'); // 삭제 후 메인 페이지로 이동
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        
        // 에러 상태 코드에 따른 처리
        if (error.response) {
          switch (error.response.status) {
            case 401:
              alert('로그인이 필요합니다.');
              navigate('/'); // 로그인 페이지로 이동
              break;
            case 403:
              alert('본인이 작성한 게시글만 삭제할 수 있습니다.');
              break;
            case 404:
              alert('게시글을 찾을 수 없습니다.');
              navigate('/main'); // 메인 페이지로 이동
              break;
            default:
              alert('게시글 삭제에 실패했습니다.');
          }
        } else {
          alert('게시글 삭제에 실패했습니다. 네트워크 연결을 확인해주세요.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/main')}>메인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <header className="community-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="back-to-temp">
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
  
      <div className='post-detail-container'>
        <header>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>작성자: {post.author.nickname}</span>
            <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="post-actions" style={{ marginLeft: 'auto' }}>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        </header>
        <main>
          <div className="post-content">
            {/* 게시글 내용을 HTML로 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          <div className="post-likes">
            <button 
              onClick={handleLike}
              className={post.isRecommended ? 'liked' : ''}
            >
              {post.isRecommended ? '추천됨' : '추천'}
            </button>
            <span>{post.recommendCount}명이 추천했습니다.</span>
          </div>
        </main>
        <section className="comments-section">
          <h2>댓글</h2>
          {post.comments.length > 0 ? (
            <ul>
              {post.comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <div className="comment-content">
                    <div className="comment-header">
                      <p className="comment-author">
                        <strong>{comment.author}</strong> ({new Date(comment.createdAt).toLocaleDateString()})
                      </p>
                      <button
                        className="reply-toggle-btn"
                        onClick={() => toggleReplyInput(comment.id)}
                      >
                        {showReplyInput[comment.id] ? '대댓글 닫기' : '대댓글 작성'}
                      </button>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                  {/* 대댓글 기능은 API에서 제공하는 경우 활성화 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="replies">
                      {comment.replies.map((reply) => (
                        <li key={reply.id}>
                          <p>
                            <strong>{reply.author}</strong> ({new Date(reply.createdAt).toLocaleDateString()})
                          </p>
                          <p>{reply.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {showReplyInput[comment.id] && (
                    <div className="add-reply">
                      <textarea
                        value={replyContent[comment.id] || ''}
                        onChange={(e) =>
                          setReplyContent({ ...replyContent, [comment.id]: e.target.value })
                        }
                        placeholder="대댓글을 입력하세요"
                      />
                      <button onClick={() => handleAddReply(comment.id)}>대댓글 등록</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-comments">아직 댓글이 없습니다.</p>
          )}
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <button onClick={handleAddComment}>댓글 등록</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
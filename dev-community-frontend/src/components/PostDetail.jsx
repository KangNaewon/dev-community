import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPosts } from '../data/dummyData'; // TempPage의 더미 데이터를 가져옴
import './PostDetailStyles.css';

const PostDetail = () => {
  const { id } = useParams(); // URL에서 id 파라미터를 가져옴
  const navigate = useNavigate();

  // 더미 데이터에서 해당 ID의 게시글을 찾음
  const post = dummyPosts.find((post) => post.id === parseInt(id));

  // Hooks는 항상 컴포넌트 최상단에서 호출
  const [likes, setLikes] = useState(post ? post.likes : 0);
  const [hasLiked, setHasLiked] = useState(false); // 사용자가 추천했는지 여부를 추적
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '신트렌드',
      content: '좋은 글이네요!',
      date: '2025-04-03',
      replies: [
        { id: 1, author: '정깃헙', content: '동의합니다!', date: '2025-04-03' },
      ],
    },
    {
      id: 2,
      author: '이프론트',
      content: '감사합니다!',
      date: '2025-04-03',
      replies: [],
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState({}); // 각 댓글에 대한 대댓글 입력값
  const [showReplyInput, setShowReplyInput] = useState({}); // 각 댓글에 대한 대댓글 입력창 표시 여부

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleLike = () => {
    if (hasLiked) {
      alert('이미 추천하셨습니다.');
      return;
    }
    setLikes(likes + 1); // 추천 수 증가
    setHasLiked(true); // 추천 상태를 true로 설정
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        author: '레츠고', // 실제로는 로그인된 사용자 정보 사용
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId) => {
    if (replyContent[commentId]?.trim()) {
      const newReply = {
        id: Date.now(), // 고유 ID 생성
        author: '레츠고', // 실제로는 로그인된 사용자 정보 사용
        content: replyContent[commentId],
        date: new Date().toISOString().split('T')[0],
      };

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );

      setReplyContent({ ...replyContent, [commentId]: '' }); // 입력값 초기화
      setShowReplyInput({ ...showReplyInput, [commentId]: false }); // 대댓글 입력창 닫기
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // 현재 상태를 토글
    }));
  };

  const handleEdit = () => {
    // 수정 페이지로 이동 (예: `/edit-post/:id`)
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = () => {
    // 삭제 로직 추가 (예: API 호출)
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      alert('게시글이 삭제되었습니다.');
      navigate(-1); // 삭제 후 이전 페이지로 이동
    }
  };

    return (
      <div className="post-detail">
        <header className="community-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="back-to-temp">
          <button onClick={() => navigate('/temp')} className="back-main">
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
            <span>작성자: {post.author}</span>
            <span>작성일: {post.date}</span>
          </div>
          <div className="post-actions" style={{ marginLeft: 'auto' }}>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        </header>
        <main>
          <div className="post-content">
            <h2>1. Concurrent Mode(동시성 모드)</h2>
            <p>
            기존 React의 렌더링 방식은 동기적이었습니다. 즉, 컴포넌트가 렌더링을 시작하면, 
            중간에 중단하지 않고 작업을 끝까지 완료해야 했습니다. 이로 인해 렌더링 작업이 시간이 오래 걸리면 UI가 중단되는 현상(예: 입력 지연, 느린 화면 업데이트)이 발생할 수 있었습니다.
            React 18의 동시성 모드는 렌더링 작업을 더 작은 단위로 분할하여,
            중요한 작업(예: 사용자 입력, 애니메이션)을 우선적으로 처리하고, 덜 중요한 작업(예: 대량의 데이터 로드 및 렌더링)을 뒤로 미루거나 나중에 처리할 수 있게 합니다. 
            이를 통해 더 나은 사용자 경험을 제공합니다.
            </p>
          </div>
          <div className="post-likes">
            <button onClick={handleLike}>추천</button>
            <span>{likes}명이 추천했습니다.</span>
          </div>
        </main>
        <section className="comments-section">
          <h2>댓글</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-content">
                  <div className="comment-header">
                    <p className="comment-author">
                      <strong>{comment.author}</strong> ({comment.date})
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
                <ul className="replies">
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>
                      <p>
                        <strong>{reply.author}</strong> ({reply.date})
                      </p>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
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
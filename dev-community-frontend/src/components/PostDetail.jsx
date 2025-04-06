import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetailStyles.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`/post/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('게시글 상세 정보 로딩 실패:', error);
        // 더미 데이터 사용
        setPost({
          id: parseInt(id),
          title: "React 상태관리의 모든 것",
          content: "React에서 상태관리를 효율적으로 하는 방법을 알아봅시다...",
          author: {
            id: "user1",
            nickname: "개발왕"
          },
          recommendCount: 150,
          createdAt: "2024-01-15T09:00:00",
          comments: [
            {
              id: 1,
              content: "좋은 글이네요!",
              author: {
                id: "commenter1",
                nickname: "리액트러버"
              },
              createdAt: "2024-01-15T10:00:00",
              replies: []
            }
          ]
        });
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/post/${id}`);
        navigate('/');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/post/${id}/like`);
      setPost(prev => ({
        ...prev,
        recommendCount: prev.recommendCount + 1
      }));
    } catch (error) {
      console.error('추천 실패:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/post/${id}/comment`, {
        content: newComment
      });
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, response.data]
      }));
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      const dummyComment = {
        id: Date.now(),
        content: newComment,
        author: {
          id: 'currentUser',
          nickname: '현재 사용자'
        },
        createdAt: new Date().toISOString(),
        replies: []
      };
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, dummyComment]
      }));
      setNewComment('');
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!newReply.trim()) return;

    try {
      const response = await axios.post(`/comment/${commentId}/reply`, {
        content: newReply
      });
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              }
            : comment
        )
      }));
      setNewReply('');
      setReplyingTo(null);
    } catch (error) {
      console.error('답글 작성 실패:', error);
      const dummyReply = {
        id: Date.now(),
        content: newReply,
        author: {
          id: 'currentUser',
          nickname: '현재 사용자'
        },
        createdAt: new Date().toISOString()
      };
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), dummyReply]
              }
            : comment
        )
      }));
      setNewReply('');
      setReplyingTo(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="post-detail">
      <header className="community-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="logo-container">
          <img src="https://cdn-icons-png.flaticon.com/512/2721/2721620.png" alt="Logo" className="logo-img" />
          <h1>DevConnect</h1>
        </div>
      </header>

      <div className="post-detail-container">
        <header>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">{post.author.nickname}</span>
            <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="post-actions">
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        </header>

        <main>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          
          <div className="post-likes">
            <button onClick={handleLike}>
              <i className="bx bx-like"></i> 추천
            </button>
            <span>{post.recommendCount}</span>
          </div>

          <section className="comments-section">
            <h2>댓글</h2>
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
              />
              <button onClick={handleCommentSubmit}>댓글 작성</button>
            </div>

            <ul>
              {post.comments.map(comment => (
                <li key={comment.id}>
                  <div className="comment-header">
                    <p className="comment-author">{comment.author.nickname}</p>
                    <button 
                      className="reply-toggle-btn"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      답글
                    </button>
                  </div>
                  <p>{comment.content}</p>
                  
                  {replyingTo === comment.id && (
                    <div className="add-reply">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="답글을 작성하세요..."
                      />
                      <button onClick={() => handleReplySubmit(comment.id)}>
                        답글 작성
                      </button>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies">
                      {comment.replies.map(reply => (
                        <div key={reply.id}>
                          <div className="comment-header">
                            <p className="comment-author">{reply.author.nickname}</p>
                          </div>
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PostDetail;
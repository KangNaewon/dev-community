import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyPageStyles.css';
import FollowModal from './FollowModal';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserId(user.id); // user.id 저장
    
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/member/${user.loginId}`);
        setUserInfo({
          ...response.data,
          id: user.loginId // id 정보 추가 (UI에서 사용)
        });
        setLoading(false);
        
        // 팔로워 및 팔로잉 데이터 가져오기
        fetchFollowers(user.loginId);
        fetchFollowing(user.loginId);
        
        // 내가 쓴 글 가져오기
        fetchMyPosts(user.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const fetchFollowers = async (userLoginId) => {
    try {
      const response = await axios.get(`/member/${userLoginId}/followers`);
      const formattedFollowers = response.data.map(follower => ({
        ...follower,
        id: follower.loginId,
        isFollowing: false
      }));
      setFollowers(formattedFollowers);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async (userLoginId) => {
    try {
      const response = await axios.get(`/member/${userLoginId}/followings`);
      const formattedFollowing = response.data.map(following => ({
        ...following,
        id: following.loginId,
        isFollowing: true
      }));
      setFollowing(formattedFollowing);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  // 내가 쓴 글 가져오기
  const fetchMyPosts = async (userId) => {
    try {
      const response = await axios.get(`/post/my/${userId}`);
      setMyPosts(response.data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
      setMyPosts([]);
    }
  };

  // 좋아요한 게시물 가져오기
  const fetchLikedPosts = async (userId) => {
    try {
      const response = await axios.get(`/post/like/${userId}`);
      setLikedPosts(response.data);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setLikedPosts([]);
    }
  };

  // 탭 변경 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'liked' && likedPosts.length === 0 && userId) {
      fetchLikedPosts(userId);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const openFollowersModal = () => {
    setFollowModalType('followers');
    setShowFollowModal(true);
  };

  const openFollowingModal = () => {
    setFollowModalType('following');
    setShowFollowModal(true);
  };

  const closeFollowModal = () => {
    setShowFollowModal(false);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mypage-container">
      <header className="community-header">
        <button className="back-btn" onClick={() => navigate('/main')}>
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="logo-container" onClick={() => navigate('/main')}>
          <img src="https://cdn-icons-png.flaticon.com/512/2721/2721620.png" alt="Logo" className="logo-img" />
          <h1>SDC</h1>
        </div>
      </header>
      
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-image">
            {userInfo.profileImageUrl ? (
              <img src={userInfo.profileImageUrl} alt={`${userInfo.nickname}'s profile`} />
            ) : (
              <div className="default-profile-image">
                {userInfo.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="username">{userInfo.id}</h1>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-count">{myPosts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat clickable" onClick={openFollowersModal}>
                <span className="stat-count">{userInfo.followerCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat clickable" onClick={openFollowingModal}>
                <span className="stat-count">{userInfo.followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat">
                <span className="stat-count">{userInfo.receivedLikeCount}</span>
                <span className="stat-label">Likes</span>
              </div>
            </div>
            <div className="profile-bio">
              <h2 className="nickname">{userInfo.nickname}</h2>
              <p className="bio-text">Welcome to my profile!</p>
            </div>
            <button className="edit-profile-btn" onClick={handleEditProfile}>Edit Profile</button>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          내가 쓴 글
        </button>
        <button 
          className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => handleTabChange('liked')}
        >
          좋아요 한 게시물
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-list">
            {myPosts.length > 0 ? (
              myPosts.map(post => (
                <div key={post.id} className="post-item" onClick={() => handlePostClick(post.id)}>
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-author">{post.author.nickname}</span>
                      <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="post-stats">
                    <div className="post-likes">
                      <i className="bx bx-like"></i>
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="post-comments">
                      <i className="bx bx-comment"></i>
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="bx bx-file"></i>
                <p>작성한 게시글이 없습니다</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'liked' && (
          <div className="posts-list">
            {likedPosts.length > 0 ? (
              likedPosts.map(post => (
                <div key={post.id} className="post-item" onClick={() => handlePostClick(post.id)}>
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-author">{post.author.nickname}</span>
                      <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="post-stats">
                    <div className="post-likes">
                      <i className="bx bx-like"></i>
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="post-comments">
                      <i className="bx bx-comment"></i>
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="bx bx-heart"></i>
                <p>좋아요한 게시글이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showFollowModal && (
        <FollowModal 
          type={followModalType} 
          users={followModalType === 'followers' ? followers : following}
          onClose={closeFollowModal}
          currentUserId={userInfo.id}
        />
      )}
    </div>
  );
};

export default MyPage;
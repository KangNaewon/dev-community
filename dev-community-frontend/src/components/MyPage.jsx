import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyPageStyles.css';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/user/me');
        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          navigate('/login');
        } else {
          setError('Failed to load user information');
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mypage-container">
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
              <span className="stat-count">0</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-count">0</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-count">0</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <div className="profile-bio">
            <h2 className="nickname">{userInfo.nickname}</h2>
            <p className="email">{userInfo.email}</p>
            <p className="bio-text">Welcome to my profile!</p>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button className="tab active">Posts</button>
        <button className="tab">Saved</button>
        <button className="tab">Tagged</button>
      </div>
      
      <div className="profile-content">
        <div className="posts-grid">
          <div className="empty-state">
            <i className="bx bx-camera"></i>
            <p>No Posts Yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
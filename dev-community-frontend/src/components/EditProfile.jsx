import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditProfileStyles.css';

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  
  // 닉네임 변경 상태
  const [newNickname, setNewNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  
  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/member/${user.loginId}`);
        setUserInfo({
          ...response.data,
          id: user.loginId
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('사용자 정보를 불러오는데 실패했습니다.');
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImageClick = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  // 프로필 이미지 업로드
  const handleChangeProfileImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await axios.post('/member/me/profile-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setUserInfo({
            ...userInfo,
            profileImageUrl: response.data.profileImageUrl
          });
          
          setShowProfileOptions(false);
        } catch (error) {
          console.error('Error uploading profile image:', error);
          alert('프로필 이미지 업로드에 실패했습니다.');
        }
      }
    };
    fileInput.click();
  };

  // 프로필 이미지 삭제
  const handleRemoveProfileImage = async () => {
    try {
      const response = await axios.delete('/member/me/profile-image');
      
      setUserInfo({
        ...userInfo,
        profileImageUrl: response.data.profileImageUrl
      });
      
      setShowProfileOptions(false);
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    
    if (!newNickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    
    try {
      const response = await axios.put('/member/me/nickname', { nickname: newNickname });
      
      setUserInfo({
        ...userInfo,
        nickname: response.data.nickname
      });
      
      setNewNickname('');
      setNicknameError('');
      alert('닉네임이 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Error changing nickname:', error);
      
      if (error.response?.status === 409) {
        setNicknameError('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameError('닉네임 변경에 실패했습니다.');
      }
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setPasswordError('현재 비밀번호를 입력해주세요.');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해주세요.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      await axios.put('/member/me/password', {
        currentPassword,
        newPassword
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response?.status === 400) {
        setPasswordError('현재 비밀번호가 일치하지 않거나 새 비밀번호가 요구사항을 충족하지 않습니다.');
      } else {
        setPasswordError('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/mypage');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <button className="back-button" onClick={handleGoBack}>
          &larr; 뒤로가기
        </button>
        <h1>프로필 수정</h1>
      </div>

      <div className="profile-edit-section">
        <div className="profile-image-container">
          <div 
            className="profile-image-edit" 
            onClick={handleProfileImageClick}
          >
            {userInfo.profileImageUrl ? (
              <img src={userInfo.profileImageUrl} alt={`${userInfo.nickname}'s profile`} />
            ) : (
              <div className="default-profile-image">
                {userInfo.nickname.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="image-overlay">
              <span>변경</span>
            </div>
          </div>
          
          {showProfileOptions && (
            <div className="profile-image-options">
              <button onClick={handleChangeProfileImage}>프로필 사진 변경</button>
              <button onClick={handleRemoveProfileImage}>기본 이미지로 변경</button>
              <button onClick={() => setShowProfileOptions(false)}>취소</button>
            </div>
          )}
          
          <h2 className="profile-nickname">{userInfo.nickname}</h2>
        </div>

        <div className="edit-options">
          <div className="edit-section">
            <h3 className="section-title">닉네임 변경</h3>
            <form onSubmit={handleNicknameSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="nickname">새 닉네임</label>
                <input
                  type="text"
                  id="nickname"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="새 닉네임 입력"
                />
                {nicknameError && <p className="error-message">{nicknameError}</p>}
              </div>
              <button type="submit" className="submit-button">닉네임 변경</button>
            </form>
          </div>

          <div className="edit-section">
            <h3 className="section-title">비밀번호 변경</h3>
            <form onSubmit={handlePasswordSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="currentPassword">현재 비밀번호</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호 입력"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 입력"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>
              <button type="submit" className="submit-button">비밀번호 변경</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../contexts/AuthContext';
import Navigation from './Navigation';
import './Profile.css';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, progressRes] = await Promise.all([
        fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        setFormData({
          username: profileData.username,
          email: profileData.email
        });
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setMessage('Profile updated successfully!');
    setEditMode(false);
    // In a real app, you'd make an API call to update the profile
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      email: profile.email
    });
    setEditMode(false);
    setMessage('');
  };

  const getProgressStats = () => {
    const totalLevels = progress.length;
    const completedLevels = progress.filter(p => p.completed).length;
    const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
    
    return {
      totalLevels,
      completedLevels,
      totalScore,
      completionRate: totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0
    };
  };

  const getLanguageProgress = () => {
    const languages = ['html', 'css', 'javascript'];
    return languages.map(lang => {
      const langProgress = progress.filter(p => p.language === lang);
      const completed = langProgress.filter(p => p.completed).length;
      const total = langProgress.length;
      return {
        language: lang.toUpperCase(),
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navigation />
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <Navigation />
        <div className="error-message">
          <h2>Profile Not Found</h2>
          <p>Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  const stats = getProgressStats();
  const languageProgress = getLanguageProgress();

  return (
    <div className="profile-container">
      <Navigation />
      
      <div className="profile-content">
        {/* Profile Header */}
        <motion.div
          className="profile-header retro-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="profile-avatar-section">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              {editMode ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="retro-input"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="retro-input"
                    placeholder="Email"
                  />
                  <div className="edit-actions">
                    <button onClick={handleSave} className="retro-button retro-button-success">
                      Save
                    </button>
                    <button onClick={handleCancel} className="retro-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">{profile.username}</h1>
                  <p className="profile-email">{profile.email}</p>
                  <button 
                    onClick={() => setEditMode(true)}
                    className="retro-button"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
          
          {message && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="stats-overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="section-title">📊 Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card retro-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3 className="stat-title">Total Score</h3>
                <p className="stat-value">{stats.totalScore}</p>
              </div>
            </div>
            
            <div className="stat-card retro-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3 className="stat-title">Levels Completed</h3>
                <p className="stat-value">{stats.completedLevels}/{stats.totalLevels}</p>
              </div>
            </div>
            
            <div className="stat-card retro-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-title">Completion Rate</h3>
                <p className="stat-value">{stats.completionRate}%</p>
              </div>
            </div>
            
            <div className="stat-card retro-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-title">Current Level</h3>
                <p className="stat-value">{profile.level}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Language Progress */}
        <motion.div
          className="language-progress-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="section-title">🎨 Language Progress</h2>
          <div className="language-progress-grid">
            {languageProgress.map((lang, index) => (
              <motion.div
                key={lang.language}
                className="language-progress-card retro-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <div className="language-header">
                  <h3 className="language-name">{lang.language}</h3>
                  <span className="language-percentage">{lang.percentage}%</span>
                </div>
                
                <div className="language-progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${lang.percentage}%` }}
                  ></div>
                </div>
                
                <div className="language-stats">
                  <span className="completed-levels">{lang.completed} completed</span>
                  <span className="total-levels">{lang.total} total</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="recent-activity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h2 className="section-title">📈 Recent Activity</h2>
          <div className="activity-list retro-card">
            {progress.length > 0 ? (
              progress.slice(0, 5).map((item, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p className="activity-text">
                      Completed {item.language.toUpperCase()} Level {item.level}
                    </p>
                    <span className="activity-score">+{item.score} points</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity">No activity yet. Start your coding adventure!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Retro effects */}
      <div className="scanlines"></div>
      <div className="crt-effect"></div>
    </div>
  );
};

export default Profile; 
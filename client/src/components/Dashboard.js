import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../contexts/AuthContext';
import Navigation from './Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [progress, setProgress] = useState([]);
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);

  const languages = [
    { 
      name: 'HTML', 
      icon: '🌐', 
      color: '#e34c26',
      description: 'Learn the structure of web pages'
    },
    { 
      name: 'CSS', 
      icon: '🎨', 
      color: '#264de4',
      description: 'Style and design beautiful websites'
    },
    { 
      name: 'JavaScript', 
      icon: '⚡', 
      color: '#f7df1e',
      description: 'Add interactivity to your web pages'
    }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [progressRes, levelsRes] = await Promise.all([
        fetch('/api/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/levels/html')
      ]);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }

      if (levelsRes.ok) {
        const levelsData = await levelsRes.json();
        setLevels(levelsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForLanguage = (language) => {
    const languageProgress = progress.filter(p => p.language === language);
    const totalLevels = levels.filter(l => l.language === language).length;
    const completedLevels = languageProgress.filter(p => p.completed).length;
    return {
      completed: completedLevels,
      total: totalLevels,
      percentage: totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0
    };
  };

  const getNextLevel = (language) => {
    const languageProgress = progress.filter(p => p.language === language && p.completed);
    const completedLevels = languageProgress.map(p => p.level);
    const nextLevel = Math.max(...completedLevels, 0) + 1;
    return nextLevel;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navigation />
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navigation />
      
      <div className="dashboard-content">
        {/* Welcome Section */}
        <motion.section 
          className="welcome-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="welcome-card retro-card">
            <div className="welcome-header">
              <div className="user-avatar-large">👤</div>
              <div className="user-info">
                <h1 className="welcome-title">Welcome back, {user.username}!</h1>
                <p className="welcome-subtitle">Ready to continue your coding adventure?</p>
                <div className="user-stats">
                  <div className="stat">
                    <span className="stat-label">Level</span>
                    <span className="stat-value">{user.level}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Score</span>
                    <span className="stat-value">{user.score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Languages Section */}
        <motion.section 
          className="languages-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="section-title">Choose Your Adventure</h2>
          <div className="languages-grid">
            {languages.map((language, index) => {
              const progress = getProgressForLanguage(language.name.toLowerCase());
              const nextLevel = getNextLevel(language.name.toLowerCase());
              
              return (
                <motion.div
                  key={language.name}
                  className="language-card retro-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="language-header">
                    <div className="language-icon" style={{ color: language.color }}>
                      {language.icon}
                    </div>
                    <h3 className="language-name">{language.name}</h3>
                    <p className="language-description">{language.description}</p>
                  </div>
                  
                  <div className="language-progress">
                    <div className="progress-info">
                      <span className="progress-text">
                        {progress.completed}/{progress.total} levels completed
                      </span>
                      <span className="progress-percentage">{progress.percentage}%</span>
                    </div>
                    <div className="retro-progress">
                      <div 
                        className="retro-progress-fill"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="language-actions">
                    {progress.completed > 0 ? (
                      <Link 
                        to={`/game/${language.name.toLowerCase()}/${nextLevel}`}
                        className="retro-button retro-button-success"
                      >
                        Continue (Level {nextLevel})
                      </Link>
                    ) : (
                      <Link 
                        to={`/game/${language.name.toLowerCase()}/1`}
                        className="retro-button retro-button-success"
                      >
                        Start Learning
                      </Link>
                    )}
                    
                    {progress.completed > 0 && (
                      <Link 
                        to={`/game/${language.name.toLowerCase()}/1`}
                        className="retro-button"
                      >
                        Restart
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section 
          className="stats-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="section-title">Your Progress</h2>
          <div className="stats-grid">
            <div className="stat-card retro-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3 className="stat-title">Total Score</h3>
                <p className="stat-value">{user.score}</p>
              </div>
            </div>
            
            <div className="stat-card retro-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3 className="stat-title">Levels Completed</h3>
                <p className="stat-value">{progress.filter(p => p.completed).length}</p>
              </div>
            </div>
            
            <div className="stat-card retro-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-title">Current Level</h3>
                <p className="stat-value">{user.level}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="actions-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/leaderboard" className="action-card retro-card">
              <div className="action-icon">🏅</div>
              <h3 className="action-title">Leaderboard</h3>
              <p className="action-description">See how you rank among other coders</p>
            </Link>
            
            <Link to="/profile" className="action-card retro-card">
              <div className="action-icon">👤</div>
              <h3 className="action-title">Profile</h3>
              <p className="action-description">View and edit your profile settings</p>
            </Link>
          </div>
        </motion.section>
      </div>

      {/* Retro effects */}
      <div className="scanlines"></div>
      <div className="crt-effect"></div>
    </div>
  );
};

export default Dashboard; 
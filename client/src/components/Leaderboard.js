import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#ffffff';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <Navigation />
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <Navigation />
      
      <div className="leaderboard-content">
        <motion.div
          className="leaderboard-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="leaderboard-title">🏆 LEADERBOARD</h1>
          <p className="leaderboard-subtitle">Top Coders of Code Adventure</p>
        </motion.div>

        <motion.div
          className="leaderboard-table-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="leaderboard-table retro-card">
            <div className="table-header">
              <div className="header-rank">Rank</div>
              <div className="header-player">Player</div>
              <div className="header-score">Score</div>
              <div className="header-level">Level</div>
            </div>
            
            <div className="table-body">
              {leaderboard.length > 0 ? (
                leaderboard.map((player, index) => (
                  <motion.div
                    key={player.username}
                    className={`table-row ${index < 3 ? 'top-three' : ''}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="cell-rank">
                      <span className="rank-icon">{getRankIcon(index + 1)}</span>
                      <span className="rank-number">{index + 1}</span>
                    </div>
                    <div className="cell-player">
                      <span className="player-name">{player.username}</span>
                    </div>
                    <div className="cell-score">
                      <span 
                        className="score-value"
                        style={{ color: getRankColor(index + 1) }}
                      >
                        {player.score}
                      </span>
                    </div>
                    <div className="cell-level">
                      <span className="level-value">{player.level}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-data">
                  <p>No players yet. Be the first to join the adventure!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Top 3 Highlight */}
        {leaderboard.length >= 3 && (
          <motion.div
            className="top-players-highlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="highlight-title">🏅 Top Performers</h2>
            <div className="top-players-grid">
              {leaderboard.slice(0, 3).map((player, index) => (
                <motion.div
                  key={player.username}
                  className={`top-player-card ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="player-rank-badge">
                    {getRankIcon(index + 1)}
                  </div>
                  <h3 className="player-name-highlight">{player.username}</h3>
                  <div className="player-stats-highlight">
                    <div className="stat-item">
                      <span className="stat-label">Score</span>
                      <span className="stat-value">{player.score}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Level</span>
                      <span className="stat-value">{player.level}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div
          className="stats-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="summary-card retro-card">
            <h3 className="summary-title">📊 Leaderboard Stats</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">{leaderboard.length}</span>
                <span className="stat-label">Total Players</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  {leaderboard.length > 0 ? Math.max(...leaderboard.map(p => p.score)) : 0}
                </span>
                <span className="stat-label">Highest Score</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, p) => sum + p.score, 0) / leaderboard.length) : 0}
                </span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Retro effects */}
      <div className="scanlines"></div>
      <div className="crt-effect"></div>
    </div>
  );
};

export default Leaderboard; 
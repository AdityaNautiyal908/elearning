import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="retro-nav">
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="logo-link">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">CODE ADVENTURE</span>
          </Link>
        </motion.div>

        <motion.ul
          className="nav-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          
          {user ? (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
          
          <li>
            <Link 
              to="/leaderboard" 
              className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
            >
              Leaderboard
            </Link>
          </li>
        </motion.ul>

        {user && (
          <motion.div
            className="nav-user"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{user.username}</span>
              <span className="user-score">Score: {user.score}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button retro-button retro-button-danger"
            >
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 
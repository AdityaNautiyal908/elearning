import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AuthContext from '../contexts/AuthContext';
import Navigation from './Navigation';
import './GameLevel.css';

const GameLevel = () => {
  const { language, level } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [currentLevel, setCurrentLevel] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLevelData();
  }, [language, level]);

  const fetchLevelData = async () => {
    try {
      const response = await fetch(`/api/levels/${language}`);
      if (response.ok) {
        const levels = await response.json();
        const levelData = levels.find(l => l.level_number === parseInt(level));
        if (levelData) {
          setCurrentLevel(levelData);
          setUserCode(''); // Start with blank editor
        } else {
          setMessage('Level not found');
        }
      }
    } catch (error) {
      setMessage('Error loading level');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userCode.trim()) {
      setMessage('Please write some code first!');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language,
          levelNumber: parseInt(level),
          solution: userCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsCorrect(true);
        setMessage(`🎉 ${data.message} +${data.points} points!`);
        
        // Auto-advance to next level after 2 seconds
        setTimeout(() => {
          if (data.nextLevel) {
            navigate(`/game/${language}/${data.nextLevel}`);
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        setIsCorrect(false);
        setMessage(`❌ ${data.message}`);
        if (data.hint) {
          setShowHint(true);
        }
      }
    } catch (error) {
      setMessage('Error submitting solution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserCode('');
    setIsCorrect(null);
    setShowHint(false);
    setMessage('');
  };

  const getLanguageMode = () => {
    switch (language) {
      case 'html': return 'markup';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'javascript';
    }
  };

  if (loading) {
    return (
      <div className="game-container">
        <Navigation />
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading level...</p>
        </div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="game-container">
        <Navigation />
        <div className="error-message">
          <h2>Level Not Found</h2>
          <p>{message}</p>
          <button onClick={() => navigate('/dashboard')} className="retro-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <Navigation />
      
      <div className="game-content">
        {/* Level Header */}
        <motion.div 
          className="level-header retro-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="level-info">
            <h1 className="level-title">
              {currentLevel.title}
            </h1>
            <div className="level-meta">
              <span className="level-number">Level {currentLevel.level_number}</span>
              <span className="level-language">{language.toUpperCase()}</span>
              <span className="level-points">{currentLevel.points} points</span>
            </div>
          </div>
        </motion.div>

        <div className="game-layout">
          {/* Challenge Panel */}
          <motion.div 
            className="challenge-panel retro-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="panel-title">Challenge</h2>
            <div className="challenge-content">
              <p className="challenge-description">{currentLevel.description}</p>
              <div className="challenge-task">
                <h3>Your Task:</h3>
                <p>{currentLevel.challenge}</p>
              </div>
            </div>
          </motion.div>

          {/* Code Editor */}
          <motion.div 
            className="code-panel retro-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="editor-header">
              <h2 className="panel-title">Code Editor</h2>
              <div className="editor-controls">
                <button 
                  onClick={handleReset}
                  className="retro-button"
                  disabled={submitting}
                >
                  Reset
                </button>
                <button 
                  onClick={handleSubmit}
                  className="retro-button retro-button-success"
                  disabled={submitting}
                >
                  {submitting ? 'Checking...' : 'Submit'}
                </button>
              </div>
            </div>
            
            <div className="code-editor-container">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="code-textarea"
                placeholder={`// Write your ${language.toUpperCase()} code here...`}
                disabled={submitting}
              />
              <div className="syntax-highlight">
                <SyntaxHighlighter
                  language={getLanguageMode()}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '20px',
                    background: 'transparent',
                    fontSize: '14px',
                    fontFamily: 'Courier New, monospace',
                    color: '#00ff00',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers={false}
                  wrapLines={true}
                  codeTagProps={{
                    style: {
                      margin: 0,
                      padding: 0,
                      fontFamily: 'Courier New, monospace',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }
                  }}
                >
                  {userCode || '// Write your code here...'}
                </SyntaxHighlighter>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div 
              className={`message-display ${isCorrect ? 'success' : 'error'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Panel */}
        <AnimatePresence>
          {showHint && (
            <motion.div 
              className="hint-panel retro-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="hint-title">💡 Hint</h3>
              <p className="hint-text">{currentLevel.hints}</p>
              <button 
                onClick={() => setShowHint(false)}
                className="retro-button"
              >
                Got it!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="game-navigation">
          <button 
            onClick={() => navigate('/dashboard')}
            className="retro-button"
          >
            Back to Dashboard
          </button>
          
          {parseInt(level) > 1 && (
            <button 
              onClick={() => navigate(`/game/${language}/${parseInt(level) - 1}`)}
              className="retro-button"
            >
              Previous Level
            </button>
          )}
        </div>
      </div>

      {/* Retro effects */}
      <div className="scanlines"></div>
      <div className="crt-effect"></div>
    </div>
  );
};

export default GameLevel; 
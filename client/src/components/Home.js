import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../contexts/AuthContext';
import Navigation from './Navigation';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: '🎮',
      title: 'Interactive Learning',
      description: 'Learn programming through hands-on coding challenges'
    },
    {
      icon: '🏆',
      title: 'Progress Tracking',
      description: 'Track your progress and earn achievements'
    },
    {
      icon: '🎯',
      title: 'Multiple Languages',
      description: 'Master HTML, CSS, JavaScript and more'
    },
    {
      icon: '🌟',
      title: 'Retro Gaming',
      description: 'Enjoy learning with classic Nintendo-style graphics'
    }
  ];

  const languages = [
    { name: 'HTML', color: '#e34c26', icon: '🌐' },
    { name: 'CSS', color: '#264de4', icon: '🎨' },
    { name: 'JavaScript', color: '#f7df1e', icon: '⚡' }
  ];

  return (
    <div className="home-container">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            CODE ADVENTURE
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Master Programming Languages Through Epic Gaming Adventures!
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {user ? (
              <Link to="/dashboard" className="retro-button retro-button-success">
                Continue Adventure
              </Link>
            ) : (
              <>
                <Link to="/register" className="retro-button retro-button-success">
                  Start Adventure
                </Link>
                <Link to="/login" className="retro-button">
                  Login
                </Link>
              </>
            )}
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="hero-background">
          <div className="floating-pixels">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="pixel"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">Why Choose Code Adventure?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card retro-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Languages Section */}
      <motion.section 
        className="languages-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">Master These Languages</h2>
        <div className="languages-grid">
          {languages.map((language, index) => (
            <motion.div
              key={index}
              className="language-card retro-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="language-icon">{language.icon}</div>
              <h3 className="language-name">{language.name}</h3>
              <div 
                className="language-color-bar"
                style={{ backgroundColor: language.color }}
              ></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="cta-content">
          <h2 className="cta-title">Ready to Begin Your Coding Journey?</h2>
          <p className="cta-description">
            Join thousands of developers who learned programming through fun and interactive games!
          </p>
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {user ? (
              <Link to="/dashboard" className="retro-button retro-button-success">
                Continue Learning
              </Link>
            ) : (
              <Link to="/register" className="retro-button retro-button-success">
                Start Free Today
              </Link>
            )}
            <Link to="/leaderboard" className="retro-button">
              View Leaderboard
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2024 Code Adventure. All rights reserved.</p>
          <p>Made with ❤️ for the coding community</p>
        </div>
      </footer>

      {/* Retro effects */}
      <div className="scanlines"></div>
      <div className="crt-effect"></div>
    </div>
  );
};

export default Home; 
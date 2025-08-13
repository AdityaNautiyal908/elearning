import React from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <motion.div
          className="loading-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pixel-logo">
            <div className="pixel-row">
              <div className="pixel red"></div>
              <div className="pixel red"></div>
              <div className="pixel blue"></div>
              <div className="pixel blue"></div>
            </div>
            <div className="pixel-row">
              <div className="pixel red"></div>
              <div className="pixel yellow"></div>
              <div className="pixel yellow"></div>
              <div className="pixel blue"></div>
            </div>
            <div className="pixel-row">
              <div className="pixel green"></div>
              <div className="pixel yellow"></div>
              <div className="pixel yellow"></div>
              <div className="pixel green"></div>
            </div>
            <div className="pixel-row">
              <div className="pixel green"></div>
              <div className="pixel green"></div>
              <div className="pixel green"></div>
              <div className="pixel green"></div>
            </div>
          </div>
        </motion.div>
        
        <motion.h1
          className="loading-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          CODE ADVENTURE
        </motion.h1>
        
        <motion.p
          className="loading-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Learn Programming the Fun Way!
        </motion.p>
        
        <motion.div
          className="loading-bar-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="loading-bar">
            <motion.div
              className="loading-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="blink">LOADING</span>
          <span className="dots">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.2 }}
            >.</motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.2 }}
            >.</motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.2 }}
            >.</motion.span>
          </span>
        </motion.div>
        
        <motion.div
          className="loading-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.5 }}
        >
          <p>💡 Tip: Practice makes perfect!</p>
          <p>🎮 Ready to level up your coding skills?</p>
        </motion.div>
      </div>
      
      {/* Retro scanlines effect */}
      <div className="scanlines"></div>
      
      {/* CRT effect */}
      <div className="crt-effect"></div>
    </div>
  );
};

export default LoadingScreen; 
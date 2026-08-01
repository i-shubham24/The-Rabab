import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCrown } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: ''
  });
  const { login, register } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.name, formData.email, formData.phone, formData.password);
    }
    
    if (success) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <motion.div 
        className="auth-modal glass-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="auth-close-btn" onClick={onClose}><FaTimes /></button>
        
        <div className="auth-header">
          <FaCrown className="auth-icon" />
          <h2>{isLogin ? 'Welcome Back' : 'Join the Royal Club'}</h2>
          <p>{isLogin ? 'Sign in to view your reservations and points' : 'Earn Royal Points on every booking'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                />
              </div>
            </>
          )}
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="input-field"
            />
          </div>

          <button type="submit" className="gold-cta w-full">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>New to Majestic Rabab? <button type="button" onClick={() => setIsLogin(false)}>Create an account</button></p>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Sign In</button></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;

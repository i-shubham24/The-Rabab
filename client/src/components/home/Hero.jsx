import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="hero-section">
      <div className="hero-background" style={{ backgroundImage: 'url(/images/ambiance/interior.jpg)' }}>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="gold-particles">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}></span>
        ))}
      </div>

      <div className="hero-content">
        <motion.div 
          className="hero-text-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="hero-subheading" variants={itemVariants}>
            Experience Royal Dining at Rabab
          </motion.h2>
          <motion.h1 className="hero-heading" variants={itemVariants}>
            The Art of Fine Dining, Redefined
          </motion.h1>
          <motion.p className="hero-tagline" variants={itemVariants}>
            Fine Cuisine · Elegant Vibes · Memorable Nights
          </motion.p>
          
          <motion.div className="hero-cta" variants={itemVariants}>
            <Link to="/menu" className="btn btn-outline-gold">Explore Menu</Link>
            <Link to="/booking" className="btn btn-primary-gold">Reserve Table</Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <FaChevronDown className="bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUtensils, FaAward, FaCalendarAlt } from 'react-icons/fa';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <motion.div 
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src="/images/ambiance/interior.jpg" alt="Majestic Rabab Interior" className="about-image" />
          <div className="about-image-decoration"></div>
        </motion.div>
        
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="about-heading">Our Story</h2>
          <p className="about-text">
            Majestic Rabab is a celebration of Punjabi heritage, Mughal culinary traditions, and royal hospitality. 
            The restaurant brings together authentic flavors with an ambiance that transports you to a bygone era of grandeur.
          </p>
          <p className="about-text">
            Every dish is crafted with passion, using traditional recipes and the finest ingredients, to offer a dining 
            experience that is truly unforgettable.
          </p>
          
          <div className="about-stats">
            <div className="stat-item">
              <FaUtensils className="stat-icon" />
              <span className="stat-number">50+</span>
              <span className="stat-label">Signature Dishes</span>
            </div>
            <div className="stat-item">
              <FaAward className="stat-icon" />
              <span className="stat-number">5★</span>
              <span className="stat-label">Rated</span>
            </div>
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon" />
              <span className="stat-number">Est.</span>
              <span className="stat-label">2024</span>
            </div>
          </div>
          
          <Link to="/about" className="btn btn-outline-burgundy">Discover More</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

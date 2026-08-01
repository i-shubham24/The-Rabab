import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaUtensils, FaCrown, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="about-page">
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>Our Story</h1>
          <p>Where Tradition Meets Elegance</p>
        </div>
      </motion.div>

      <section className="story-section">
        <div className="container">
          <motion.div 
            className="story-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="story-image-wrapper" variants={fadeUp}>
              <img src="/images/ambiance/interior.jpg" alt="Rabab Interior" className="story-img" />
              <div className="gold-border-accent"></div>
            </motion.div>
            
            <motion.div className="story-content" variants={fadeUp}>
              <h2>A Legacy of Taste</h2>
              <div className="accent-line"></div>
              
              <p>Founded on a passion for authentic culinary experiences, Majestic Rabab celebrates the rich heritage of Punjabi and North Indian cuisine. Our journey began with a simple vision: to create a space where royal dining meets contemporary elegance.</p>
              
              <p>The name <strong>'Rabab'</strong> is inspired by the traditional Indian string instrument, symbolizing the perfect harmony of flavors, aromas, and artistry that our culinary team orchestrates in the kitchen every day.</p>
              
              <p>Step into a world inspired by grand Mughal architecture, where every detail—from the intricately designed interiors to the centuries-old recipes—is crafted to provide you with an unforgettable dining experience fit for royalty.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Our Pillars of Excellence</h2>
            <div className="accent-line center"></div>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="value-card glass-card" variants={fadeUp}>
              <FaUtensils className="value-icon" />
              <h3>Authentic Flavors</h3>
              <p>Traditional recipes passed through generations, preserving the true essence of Indian spices.</p>
            </motion.div>
            
            <motion.div className="value-card glass-card" variants={fadeUp}>
              <FaLeaf className="value-icon" />
              <h3>Premium Ingredients</h3>
              <p>Meticulously sourced from the finest local farms and artisan producers for unmatched quality.</p>
            </motion.div>
            
            <motion.div className="value-card glass-card" variants={fadeUp}>
              <FaCrown className="value-icon" />
              <h3>Royal Hospitality</h3>
              <p>Every guest is treated like royalty, with attentive service that anticipates your every need.</p>
            </motion.div>
            
            <motion.div className="value-card glass-card" variants={fadeUp}>
              <FaHeart className="value-icon" />
              <h3>Crafted with Love</h3>
              <p>Each dish is a masterpiece of culinary art, prepared with immense passion and care.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Meet Our Team</h2>
            <div className="accent-line center"></div>
          </motion.div>

          <motion.div 
            className="team-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="team-member" variants={fadeUp}>
              <div className="member-avatar placeholder-avatar"></div>
              <h3>Rajinder Singh</h3>
              <p className="member-title">Executive Chef</p>
            </motion.div>
            
            <motion.div className="team-member" variants={fadeUp}>
              <div className="member-avatar placeholder-avatar"></div>
              <h3>Amanpreet Kaur</h3>
              <p className="member-title">Sous Chef</p>
            </motion.div>
            
            <motion.div className="team-member" variants={fadeUp}>
              <div className="member-avatar placeholder-avatar"></div>
              <h3>Vikram Sharma</h3>
              <p className="member-title">General Manager</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Our Journey</h2>
            <div className="accent-line center"></div>
          </motion.div>

          <div className="timeline">
            <motion.div 
              className="timeline-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <h3>2024</h3>
                <h4>The Inception</h4>
                <p>Majestic Rabab opens its doors in Rayya, bringing a new standard of fine dining to the region.</p>
              </div>
            </motion.div>

            <motion.div 
              className="timeline-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <h3>2024</h3>
                <h4>Culinary Excellence Award</h4>
                <p>Recognized locally for outstanding contribution to authentic North Indian cuisine.</p>
              </div>
            </motion.div>

            <motion.div 
              className="timeline-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <h3>2025</h3>
                <h4>First 1000 Guests</h4>
                <p>Celebrating a milestone of serving our thousandth royal guest with grand festivities.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Ready for a Royal Feast?</h2>
          <p>Join us for an unforgettable dining experience.</p>
          <Link to="/booking" className="gold-cta">Experience the Magic</Link>
        </motion.div>
      </section>
    </div>
  );
};

export default About;

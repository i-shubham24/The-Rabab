import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ReservationCTA.css';

const ReservationCTA = () => {
  return (
    <section className="reservation-cta">
      <div className="cta-pattern"></div>
      <div className="cta-content">
        <motion.h2 
          className="cta-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Reserve Your Royal Experience
        </motion.h2>
        <motion.p 
          className="cta-subtext"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join us for an unforgettable evening of fine cuisine and elegant ambiance
        </motion.p>
        <motion.div 
          className="cta-buttons"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/booking" className="btn btn-primary-gold pulse-anim">Book a Table</Link>
          <a href="tel:+917900324000" className="btn btn-outline-light">Call Now +91 7900324000</a>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationCTA;

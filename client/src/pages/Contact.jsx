import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', subject: 'General', message: '' });
      e.target.reset(); // Reset form inputs visually
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="contact-page">
      <motion.div 
        className="contact-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>Get In Touch</h1>
          <p>We would love to hear from you</p>
        </div>
      </motion.div>

      <div className="contact-container">
        <motion.div 
          className="contact-form-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" name="name" className="input-field" placeholder="Your Name" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="email" name="email" className="input-field" placeholder="Your Email" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="tel" name="phone" className="input-field" placeholder="Your Phone" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <select name="subject" className="input-field" onChange={handleChange}>
                <option value="General">General Inquiry</option>
                <option value="Reservation">Reservation</option>
                <option value="Catering">Catering</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <textarea name="message" className="input-field" rows="5" placeholder="Your Message" required onChange={handleChange}></textarea>
            </div>
            
            {status.message && (
              <p style={{ color: status.type === 'error' ? '#ff4d4d' : '#4CAF50', marginTop: '10px' }}>
                {status.message}
              </p>
            )}

            <button type="submit" className="gold-cta" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="contact-info-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Contact Information</h2>
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <div className="info-text">
              <h3>Location</h3>
              <p>Grand Trunk Road, Opp Fateh World School, Rayya, Punjab 143112</p>
            </div>
          </div>
          <div className="info-card">
            <FaPhone className="info-icon" />
            <div className="info-text">
              <h3>Phone</h3>
              <p>+91 7900324000</p>
            </div>
          </div>
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <div className="info-text">
              <h3>Email</h3>
              <p>info@majesticrabab.com</p>
            </div>
          </div>
          <div className="info-card">
            <FaClock className="info-icon" />
            <div className="info-text">
              <h3>Hours</h3>
              <p>Mon-Sun: 12:00 PM – 11:00 PM</p>
            </div>
          </div>
          <div className="info-card">
            <FaInstagram className="info-icon" />
            <div className="info-text">
              <h3>Instagram</h3>
              <a href="https://instagram.com/therababrayya" target="_blank" rel="noreferrer">@therababrayya</a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="map-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <iframe 
          title="Map"
          src="https://maps.google.com/maps?q=THE+RABAB+RESTAURANT,+Grand+Trunk+Road,+Opp+Fateh+World+School,+Rayya,+Punjab+143112&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy">
        </iframe>
      </motion.div>

      <div className="social-links-bar">
        <a href="https://instagram.com/therababrayya" target="_blank" rel="noreferrer"><FaInstagram /></a>
        <a href="#" target="_blank" rel="noreferrer"><FaFacebook /></a>
        <a href="https://www.google.com/maps/place/THE+RABAB+RESTAURANT/data=!4m2!3m1!1s0x0:0xd5b8a10a37e19929?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noreferrer"><FaMapMarkerAlt /></a>
      </div>
    </div>
  );
};

export default Contact;

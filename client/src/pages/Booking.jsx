import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaCrown, FaConciergeBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
  const { user } = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '12:00 PM',
    partySize: '2',
    seating: 'Indoor',
    occasion: 'None',
    name: user ? user.name : '',
    phone: user && user.phone ? user.phone : '',
    email: user ? user.email : '',
    requests: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        phone: prev.phone || (user.phone || '')
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePartySize = (size) => {
    setFormData({ ...formData, partySize: size });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user: user ? user._id : undefined,
          partySize: parseInt(formData.partySize) || 2 // Backend expects number
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Generate time slots
  const timeSlots = [];
  let startHour = 12;
  let startMin = 0;
  while (startHour < 23 || (startHour === 22 && startMin <= 30)) {
    const ampm = startHour >= 12 ? 'PM' : 'AM';
    const displayHour = startHour > 12 ? startHour - 12 : startHour;
    const displayMin = startMin === 0 ? '00' : '30';
    timeSlots.push(`${displayHour}:${displayMin} ${ampm}`);
    
    startMin += 30;
    if (startMin >= 60) {
      startMin = 0;
      startHour++;
    }
  }

  // Generate party sizes
  const partySizes = ['1', '2', '3', '4', '5', '6', '7', '8', '8+'];

  return (
    <div className="booking-page">
      <motion.div 
        className="booking-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>Reserve Your Table</h1>
          <p>Experience Royal Dining</p>
        </div>
      </motion.div>

      <div className="booking-container">
        {!isSubmitted ? (
          <motion.div 
            className="booking-form-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <form className="booking-form glass-card" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" name="date" className="input-field" min={new Date().toISOString().split('T')[0]} required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <select name="time" className="input-field" required onChange={handleChange} value={formData.time}>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group party-size-group">
                <label>Party Size</label>
                <div className="party-size-buttons">
                  {partySizes.map(size => (
                    <button 
                      type="button" 
                      key={size} 
                      className={`party-btn ${formData.partySize === size ? 'active' : ''}`}
                      onClick={() => handlePartySize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Seating Preference</label>
                <div className="radio-group">
                  {['Indoor', 'Outdoor', 'Private Dining', 'No Preference'].map(seat => (
                    <label key={seat} className="radio-label">
                      <input 
                        type="radio" 
                        name="seating" 
                        value={seat} 
                        checked={formData.seating === seat}
                        onChange={handleChange} 
                      />
                      <span className="radio-custom"></span>
                      {seat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Occasion</label>
                <select name="occasion" className="input-field" onChange={handleChange} value={formData.occasion}>
                  <option value="None">None</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Date Night">Date Night</option>
                  <option value="Family Gathering">Family Gathering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <input type="text" name="name" className="input-field" placeholder="Full Name" required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <input type="tel" name="phone" className="input-field" placeholder="Phone Number" required onChange={handleChange} />
                </div>
              </div>

              <div className="input-group">
                <input type="email" name="email" className="input-field" placeholder="Email Address" required onChange={handleChange} />
              </div>

              <div className="input-group">
                <textarea name="requests" className="input-field" rows="3" placeholder="Special Requests (Optional)" onChange={handleChange}></textarea>
              </div>

              {error && <p className="error-message" style={{ color: '#ff4d4d', marginTop: '10px' }}>{error}</p>}

              <button type="submit" className="gold-cta submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            className="success-state glass-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <FaCheckCircle className="success-icon" />
            <h2>Reservation Confirmed!</h2>
            <p className="success-msg">We look forward to hosting you, {formData.name}.</p>
            
            <div className="booking-details">
              <div className="detail-item"><span>Date:</span> {formData.date}</div>
              <div className="detail-item"><span>Time:</span> {formData.time}</div>
              <div className="detail-item"><span>Guests:</span> {formData.partySize}</div>
              <div className="detail-item"><span>Seating:</span> {formData.seating}</div>
            </div>
            
            <button className="gold-cta" onClick={() => setIsSubmitted(false)}>Make Another Booking</button>
          </motion.div>
        )}

        <motion.div 
          className="why-dine-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Why Dine With Us</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Exquisite Cuisine</h3>
              <p>Authentic recipes crafted by master chefs.</p>
            </div>
            <div className="feature-card">
              <FaCrown className="feature-icon" />
              <h3>Royal Ambiance</h3>
              <p>Mughal-inspired interiors for a majestic feel.</p>
            </div>
            <div className="feature-card">
              <FaConciergeBell className="feature-icon" />
              <h3>Impeccable Service</h3>
              <p>Experience hospitality fit for royalty.</p>
            </div>
          </div>
          
          <div className="assistance-note">
            <p>For immediate assistance, call <strong>+91 7900324000</strong></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;

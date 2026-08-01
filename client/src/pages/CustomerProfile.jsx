import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaSignOutAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const { user, token, logout, isLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!token) return;
      try {
        // We'll fetch all bookings and filter on frontend for simplicity in this MVP
        // In production, we'd add a GET /api/bookings/my endpoint
        const res = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        // The admin endpoint returns all, but our protect middleware for standard users
        // would only return theirs if we built the endpoint correctly.
        // Let's assume we have to filter here if the backend didn't do it:
        const myBookings = data.filter(b => b.email === user?.email);
        setBookings(myBookings);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };
    if (user) fetchMyBookings();
  }, [token, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, text: reviewText })
      });
      if (res.ok) {
        setReviewSubmitStatus('success');
        setReviewText('');
        setReviewRating(5);
      } else {
        setReviewSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setReviewSubmitStatus('error');
    }
  };

  if (isLoading || !user) return <div className="profile-page"><div className="loading">Loading...</div></div>;

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>My Profile</h1>
          <p>Welcome back, {user.name}</p>
        </div>
      </motion.div>

      <div className="profile-container container">
        <aside className="profile-sidebar">
          <div className="points-card glass-card">
            <FaCrown className="crown-icon" />
            <h2>Royal Points</h2>
            <div className="points-balance">{user.loyaltyPoints}</div>
            <p>Earn 100 points per confirmed booking!</p>
          </div>
          
          <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
            <FaSignOutAlt /> Sign Out
          </button>
        </aside>

        <main className="profile-content">
          <h2 className="section-title">My Reservations</h2>
          <div className="bookings-grid">
            {bookings.length === 0 ? (
              <div className="glass-card text-center p-4">
                <p>You have no reservations yet.</p>
                <button className="gold-cta mt-4" onClick={() => navigate('/booking')}>Book a Table</button>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} className="booking-card glass-card">
                  <div className="booking-header">
                    <FaCalendarAlt className="calendar-icon" />
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Guests:</strong> {booking.partySize}</p>
                  </div>
                  {booking.status === 'Confirmed' && (
                    <div className="points-earned">
                      <FaStar /> +100 Points Earned
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h2 className="section-title">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="glass-card" style={{ padding: '2rem' }}>
              {reviewSubmitStatus === 'success' ? (
                <div style={{ color: 'var(--gold)', textAlign: 'center' }}>
                  <FaStar size={30} style={{ marginBottom: '1rem' }} />
                  <h3>Thank you for your feedback!</h3>
                  <p>Your review has been submitted and is pending approval.</p>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label>Rating (1-5)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          onClick={() => setReviewRating(star)}
                          style={{
                            cursor: 'pointer',
                            color: star <= reviewRating ? 'var(--gold)' : '#555',
                            fontSize: '1.5rem'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Your Experience</label>
                    <textarea
                      className="input-field"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell us about your majestic experience..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="gold-cta" disabled={reviewSubmitStatus === 'submitting'}>
                    {reviewSubmitStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {reviewSubmitStatus === 'error' && (
                    <p style={{ color: 'red', marginTop: '1rem' }}>Failed to submit review. Please try again.</p>
                  )}
                </>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;

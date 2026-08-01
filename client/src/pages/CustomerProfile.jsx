import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaSignOutAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const { user, token, logout, isLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
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
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;

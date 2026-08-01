import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSignOutAlt, FaCalendarAlt, FaEnvelope, FaCheck, FaTimes, FaUtensils, FaTrash, FaEdit } from 'react-icons/fa';
import { menuItems as staticMenuItems } from '../../data/menuData.js';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, messagesRes, menuRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/menu')
      ]);

      if (bookingsRes.status === 401 || messagesRes.status === 401) {
        handleLogout();
        return;
      }

      const bookingsData = await bookingsRes.json();
      const messagesData = await messagesRes.json();
      const menuData = await menuRes.json();

      setBookings(bookingsData);
      setMessages(messagesData);
      setMenuItems(menuData);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Booking marked as ${status}`);
        fetchData(); // refresh data
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const updateMessageStatus = async (id, isRead) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isRead })
      });
      
      if (res.ok) {
        fetchData(); // refresh data
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSeedMenu = async () => {
    setIsLoading(true);
    try {
      // Clean up static items to prevent _id conflicts
      const cleanItems = staticMenuItems.map(({ id, ...rest }) => rest);
      const res = await fetch('/api/menu/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: cleanItems })
      });
      if (res.ok) {
        toast.success('Menu seeded with default data!');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to seed menu');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Dish deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete dish');
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>RABAB</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendarAlt /> Reservations
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaEnvelope /> Messages
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <FaUtensils /> Menu Editor
          </button>
        </nav>
        <div className="admin-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'bookings' && 'Reservations'}
            {activeTab === 'messages' && 'Customer Messages'}
            {activeTab === 'menu' && 'Menu Editor'}
          </h1>
          <div className="admin-stats">
            {activeTab === 'bookings' && <span>Total: {bookings.length}</span>}
            {activeTab === 'messages' && <span>Unread: {messages.filter(m => !m.isRead).length}</span>}
            {activeTab === 'menu' && <span>Live Dishes: {menuItems.length}</span>}
          </div>
        </header>

        <div className="admin-content">
          {isLoading ? (
            <div className="admin-loader">Loading data...</div>
          ) : activeTab === 'bookings' ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Name</th>
                    <th>Guests</th>
                    <th>Seating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id} className={`status-${booking.status?.toLowerCase() || 'pending'}`}>
                      <td>
                        <strong>{booking.date}</strong><br/>
                        <span className="text-small">{booking.time}</span>
                      </td>
                      <td>
                        {booking.name}<br/>
                        <span className="text-small">{booking.phone}</span>
                      </td>
                      <td>{booking.partySize}</td>
                      <td>{booking.seating}</td>
                      <td>
                        <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => updateBookingStatus(booking._id, 'Confirmed')} className="action-btn confirm" title="Confirm"><FaCheck /></button>
                        <button onClick={() => updateBookingStatus(booking._id, 'Cancelled')} className="action-btn cancel" title="Cancel"><FaTimes /></button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan="6" className="text-center">No reservations found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'messages' ? (
            <div className="messages-grid">
              {messages.map(msg => (
                <div key={msg._id} className={`message-card ${msg.isRead ? 'read' : 'unread'}`}>
                  <div className="message-header">
                    <h3>{msg.name}</h3>
                    <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="message-contact">
                    <p>{msg.email}</p>
                    <p>{msg.phone}</p>
                  </div>
                  <div className="message-subject">
                    <strong>Subject:</strong> {msg.subject}
                  </div>
                  <div className="message-body">
                    <p>{msg.message}</p>
                  </div>
                  <div className="message-actions">
                    <button 
                      className="gold-cta small-btn"
                      onClick={() => updateMessageStatus(msg._id, !msg.isRead)}
                    >
                      Mark as {msg.isRead ? 'Unread' : 'Read'}
                    </button>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center w-100">No messages found</div>
              )}
            </div>
          ) : (
            <div className="menu-editor-section">
              <div className="menu-editor-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="gold-cta" onClick={() => alert('Add New Dish UI Coming Soon!')}>+ Add New Dish</button>
                {menuItems.length === 0 && (
                  <button className="gold-cta" style={{ background: 'transparent', border: '1px solid var(--gold)' }} onClick={handleSeedMenu}>
                    Seed Default Menu
                  </button>
                )}
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Dish Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Veg/Non-Veg</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item._id}>
                        <td>
                          <strong>{item.name}</strong><br/>
                          <span className="text-small" style={{ display: 'inline-block', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</span>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{item.category.replace('-', ' ')}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <span className={`status-badge ${item.isVeg ? 'confirmed' : 'cancelled'}`}>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${item.isAvailable ? 'confirmed' : 'pending'}`}>
                            {item.isAvailable ? 'Live' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => alert('Edit UI Coming Soon!')}><FaEdit /></button>
                          <button onClick={() => deleteMenuItem(item._id)} className="action-btn cancel"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                    {menuItems.length === 0 && (
                      <tr><td colSpan="6" className="text-center">No menu items in database. Click "Seed Default Menu" above.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

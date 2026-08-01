import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { FaChartPie, FaSignOutAlt, FaCalendarAlt, FaEnvelope, FaCheck, FaTimes, FaUtensils, FaTrash, FaEdit, FaImage, FaStar, FaImages, FaShoppingBag, FaBell } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { menuItems as staticMenuItems } from '../../data/menuData.js';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Menu Modal State
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishFormData, setDishFormData] = useState({
    name: '', description: '', price: '', category: 'starters',
    isVeg: true, isAvailable: true, image: '/images/food/dal-makhani.jpg'
  });

  // Gallery Modal State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '', category: 'Food', mediaUrl: ''
  });

  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [token, navigate]);

  // Socket.IO real-time updates
  useEffect(() => {
    const socket = io(window.location.origin, { transports: ['websocket', 'polling'] });

    socket.on('booking:new', (booking) => {
      toast('🔔 New Reservation!', {
        icon: '📅',
        style: { background: '#1a1a1a', color: '#c9a84c', border: '1px solid #c9a84c' },
      });
      setBookings(prev => [booking, ...prev]);
    });

    socket.on('booking:statusUpdate', (updatedBooking) => {
      setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, messagesRes, menuRes, galleryRes, reviewsRes, ordersRes, overviewRes, revenueRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/menu'),
        fetch('/api/gallery'),
        fetch('/api/reviews/admin', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/orders/admin', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/analytics/overview', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/analytics/revenue?days=7', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (bookingsRes.status === 401 || messagesRes.status === 401) {
        handleLogout();
        return;
      }

      const bookingsData = await bookingsRes.json();
      const messagesData = await messagesRes.json();
      const menuData = await menuRes.json();
      const galleryData = await galleryRes.json();
      const reviewsData = await reviewsRes.json();
      const ordersData = await ordersRes.json();
      const overviewData = await overviewRes.json();
      const revenueChartData = await revenueRes.json();

      setBookings(bookingsData);
      setMessages(messagesData);
      setMenuItems(menuData);
      setGalleryItems(galleryData);
      setReviews(reviewsData);
      setOrders(ordersData);
      setAnalytics(overviewData);
      setRevenueData(revenueChartData);
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

  // Review Actions
  const handleUpdateReviewStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if(res.ok) {
        setReviews(reviews.map(r => r._id === id ? data : r));
        toast.success(`Review ${status.toLowerCase()}`);
      }
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if(res.ok) {
        setOrders(orders.map(o => o._id === id ? data : o));
        toast.success(`Order status updated to ${status}`);
      }
    } catch (err) {
      toast.error('Failed to update order status');
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

  const openMenuModal = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setDishFormData({
        name: dish.name, description: dish.description, price: dish.price,
        category: dish.category, isVeg: dish.isVeg, isAvailable: dish.isAvailable, image: dish.image || ''
      });
    } else {
      setEditingDish(null);
      setDishFormData({
        name: '', description: '', price: '', category: 'starters',
        isVeg: true, isAvailable: true, image: '/images/food/dal-makhani.jpg'
      });
    }
    setShowMenuModal(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    const url = editingDish ? `/api/menu/${editingDish._id}` : '/api/menu';
    const method = editingDish ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dishFormData)
      });

      if (res.ok) {
        toast.success(editingDish ? 'Dish updated!' : 'Dish added!');
        setShowMenuModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save dish');
      }
    } catch (err) {
      toast.error('An error occurred while saving the dish');
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...galleryFormData, mediaType: 'image', isApproved: true })
      });

      if (res.ok) {
        toast.success('Photo added to gallery!');
        setShowGalleryModal(false);
        setGalleryFormData({ title: '', category: 'Food', mediaUrl: '' });
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to add photo');
      }
    } catch (err) {
      toast.error('An error occurred while adding the photo');
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Photo deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  const handleSeedGallery = async () => {
    setIsLoading(true);
    try {
      const staticGalleryData = [
        { mediaUrl: '/images/food/dal-makhani.jpg', category: 'Food', title: 'Signature Dal Makhani' },
        { mediaUrl: '/images/ambiance/interior.jpg', category: 'Ambiance', title: 'Royal Dining Area' },
        { mediaUrl: '/images/food/food-spread.jpg', category: 'Food', title: 'The Royal Spread' }
      ];
      const res = await fetch('/api/gallery/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: staticGalleryData })
      });
      if (res.ok) {
        toast.success('Gallery seeded with default data!');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to seed gallery');
    } finally {
      setIsLoading(false);
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
            className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartPie /> Dashboard
          </button>
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
          <button 
            className={`admin-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <FaImage /> Gallery
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <FaStar /> Reviews
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Orders
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
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'bookings' && 'Reservations'}
            {activeTab === 'messages' && 'Customer Messages'}
            {activeTab === 'menu' && 'Menu Editor'}
            {activeTab === 'gallery' && 'Gallery CMS'}
            {activeTab === 'reviews' && 'Reviews'}
            {activeTab === 'orders' && 'Online Orders'}
          </h1>
          <div className="admin-stats">
            {activeTab === 'overview' && analytics && <span>Today's Rev: ₹{analytics.todayRevenue}</span>}
            {activeTab === 'bookings' && <span>Total: {bookings.length}</span>}
            {activeTab === 'messages' && <span>Unread: {messages.filter(m => !m.isRead).length}</span>}
            {activeTab === 'menu' && <span>Live Dishes: {menuItems.length}</span>}
            {activeTab === 'gallery' && <span>Photos: {galleryItems.length}</span>}
            {activeTab === 'reviews' && <span>Pending: {reviews.filter(r => r.status === 'Pending').length}</span>}
            {activeTab === 'orders' && <span>Active: {orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length}</span>}
          </div>
        </header>

        <div className="admin-content">
          {isLoading ? (
            <div className="admin-loader">Loading data...</div>
          ) : activeTab === 'overview' && analytics ? (
            <div className="analytics-overview">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <h3>Total Revenue</h3>
                  <p className="kpi-value">₹{analytics.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="kpi-card">
                  <h3>Today's Orders</h3>
                  <p className="kpi-value">{analytics.todayOrders}</p>
                </div>
                <div className="kpi-card">
                  <h3>Today's Bookings</h3>
                  <p className="kpi-value">{analytics.todayBookings}</p>
                </div>
                <div className="kpi-card">
                  <h3>Total Customers</h3>
                  <p className="kpi-value">{analytics.totalCustomers}</p>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-container">
                  <h3>Revenue (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#c9a84c" />
                      <YAxis stroke="#c9a84c" />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #c9a84c', color: '#c9a84c' }} />
                      <Bar dataKey="revenue" fill="#800020" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Orders (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#c9a84c" />
                      <YAxis stroke="#c9a84c" />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #c9a84c', color: '#c9a84c' }} />
                      <Line type="monotone" dataKey="orders" stroke="#c9a84c" strokeWidth={3} dot={{ r: 5, fill: '#800020' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
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
          ) : activeTab === 'menu' ? (
            <div className="menu-editor-section">
              <div className="menu-editor-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="gold-cta" onClick={() => openMenuModal()}>+ Add New Dish</button>
                {menuItems.length === 0 && (
                  <button className="gold-cta seed-btn" onClick={handleSeedMenu}>
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
                          <button className="action-btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => openMenuModal(item)}><FaEdit /></button>
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
          ) : activeTab === 'gallery' ? (
            <div className="gallery-editor-section">
              <div className="menu-editor-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="gold-cta" onClick={() => setShowGalleryModal(true)}>+ Add Photo</button>
                {galleryItems.length === 0 && (
                  <button className="gold-cta seed-btn" onClick={handleSeedGallery}>
                    Seed Default Photos
                  </button>
                )}
              </div>
              <div className="gallery-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {galleryItems.map(item => (
                  <div key={item._id} className="gallery-admin-card" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <img src={item.mediaUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--gold)' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#aaa' }}>{item.category}</p>
                      <button className="action-btn cancel" style={{ width: '100%' }} onClick={() => deleteGalleryItem(item._id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && (
                  <div className="text-center w-100" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                    No photos in gallery. Click "Seed Default Photos" above.
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'reviews' ? (
            <div className="tab-content">
              <h2>Review Management</h2>
              <div className="messages-grid">
                {reviews.length === 0 ? <p>No reviews found.</p> : reviews.map(review => (
                  <div key={review._id} className="message-card glass-card">
                    <div className="message-header">
                      <h3>{review.user?.name || 'Unknown User'}</h3>
                      <span className={`status-badge ${review.status.toLowerCase()}`}>{review.status}</span>
                    </div>
                    <div className="message-details" style={{ display: 'flex', gap: '5px', color: 'var(--gold)' }}>
                      {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                    </div>
                    <p className="message-text">"{review.text}"</p>
                    <div className="message-actions">
                      {review.status !== 'Approved' && (
                        <button className="action-btn confirm" onClick={() => handleUpdateReviewStatus(review._id, 'Approved')}>Approve</button>
                      )}
                      {review.status !== 'Rejected' && (
                        <button className="action-btn cancel" onClick={() => handleUpdateReviewStatus(review._id, 'Rejected')}>Reject</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="tab-content">
              <h2>Order Management</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Type & Address</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>#{order._id.substring(order._id.length - 6)}</span><br/>
                          <span style={{ fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleString()}</span>
                        </td>
                        <td>
                          <strong>{order.customerDetails?.name}</strong><br/>
                          <span className="text-small">{order.customerDetails?.phone}</span>
                        </td>
                        <td>
                          <span className="badge badge-featured">{order.fulfillmentType}</span><br/>
                          {order.fulfillmentType === 'Delivery' && (
                            <span className="text-small" style={{ display: 'inline-block', maxWidth: '200px' }}>{order.deliveryAddress}</span>
                          )}
                        </td>
                        <td><strong>₹{order.totalAmount}</strong></td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="input-field" 
                            style={{ padding: '4px 8px', width: 'auto' }}
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready / Out for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="6" className="text-center">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Add Photo</h2>
              <button className="close-btn" onClick={() => setShowGalleryModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveGallery} className="modal-form">
              <div className="input-group">
                <label>Caption / Title</label>
                <input type="text" className="input-field" required value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="input-field" value={galleryFormData.category} onChange={e => setGalleryFormData({...galleryFormData, category: e.target.value})}>
                  <option value="Food">Food</option>
                  <option value="Ambiance">Ambiance</option>
                  <option value="Events">Events</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
              </div>
              <div className="input-group">
                <label>Image URL</label>
                <input type="url" className="input-field" required value={galleryFormData.mediaUrl} onChange={e => setGalleryFormData({...galleryFormData, mediaUrl: e.target.value})} placeholder="https://..." />
              </div>
              <button type="submit" className="gold-cta" style={{ width: '100%', marginTop: '1rem' }}>Upload Photo</button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h2>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h2>
              <button className="close-btn" onClick={() => setShowMenuModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveDish} className="modal-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Dish Name</label>
                  <input type="text" className="input-field" required value={dishFormData.name} onChange={e => setDishFormData({...dishFormData, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Price (₹)</label>
                  <input type="number" className="input-field" required value={dishFormData.price} onChange={e => setDishFormData({...dishFormData, price: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-field" rows="2" required value={dishFormData.description} onChange={e => setDishFormData({...dishFormData, description: e.target.value})}></textarea>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category</label>
                  <select className="input-field" value={dishFormData.category} onChange={e => setDishFormData({...dishFormData, category: e.target.value})}>
                    <option value="starters">Starters</option>
                    <option value="soups">Soups</option>
                    <option value="tandoor">Tandoor</option>
                    <option value="main-veg">Main Course - Veg</option>
                    <option value="main-nonveg">Main Course - Non Veg</option>
                    <option value="biryani">Biryani</option>
                    <option value="breads">Breads</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                    <option value="cocktails">Cocktails</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Image URL</label>
                  <input type="text" className="input-field" value={dishFormData.image} onChange={e => setDishFormData({...dishFormData, image: e.target.value})} />
                </div>
              </div>
              <div className="form-row checkbox-row">
                <label className="checkbox-label">
                  <input type="checkbox" checked={dishFormData.isVeg} onChange={e => setDishFormData({...dishFormData, isVeg: e.target.checked})} />
                  Vegetarian
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={dishFormData.isAvailable} onChange={e => setDishFormData({...dishFormData, isAvailable: e.target.checked})} />
                  Available (Live)
                </label>
              </div>
              <button type="submit" className="gold-cta" style={{ width: '100%', marginTop: '1rem' }}>
                {editingDish ? 'Update Dish' : 'Create Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

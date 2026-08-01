import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    fulfillmentType: 'Takeaway',
    deliveryAddress: '',
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          menuItem: item._id
        })),
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        fulfillmentType: formData.fulfillmentType,
        deliveryAddress: formData.fulfillmentType === 'Delivery' ? formData.deliveryAddress : undefined,
        specialInstructions: formData.specialInstructions,
        totalAmount: getCartTotal()
      };

      const token = localStorage.getItem('rabab_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Order submission failed');
      
      const data = await res.json();
      toast.success('Order placed successfully!');
      clearCart();
      
      // Optionally redirect to a success page or profile if logged in
      navigate(user ? '/profile' : '/');
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>Your Cart is Empty</h2>
          <button className="gold-cta" onClick={() => navigate('/menu')}>Back to Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-hero">
        <div className="checkout-hero-overlay"></div>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Checkout
          </motion.h1>
        </div>
      </section>

      <section className="checkout-content container">
        <div className="checkout-grid">
          <motion.div 
            className="checkout-form-container card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="section-title">Order Details</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>Fulfillment Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fulfillmentType" 
                      value="Takeaway" 
                      checked={formData.fulfillmentType === 'Takeaway'}
                      onChange={handleChange}
                    /> Takeaway
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fulfillmentType" 
                      value="Delivery" 
                      checked={formData.fulfillmentType === 'Delivery'}
                      onChange={handleChange}
                    /> Delivery
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
              </div>

              {formData.fulfillmentType === 'Delivery' && (
                <div className="input-group">
                  <label>Delivery Address</label>
                  <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="input-field" required rows="3"></textarea>
                </div>
              )}

              <div className="input-group">
                <label>Special Instructions (Optional)</label>
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} className="input-field" rows="2"></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="checkout-summary card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;

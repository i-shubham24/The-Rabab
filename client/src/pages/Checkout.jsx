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
      const totalAmount = getCartTotal();
      
      // Step 1: Create Razorpay Order on Backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, currency: 'INR' })
      });
      
      if (!orderRes.ok) throw new Error('Failed to initialize payment');
      
      const { order, keyId } = await orderRes.json();

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Majestic Rabab',
        description: 'Online Order Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            
            if (!verifyRes.ok) throw new Error('Payment verification failed');
            
            // Step 4: Submit the actual Order to our DB
            await placeOrder(response.razorpay_payment_id);
            
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#800020' },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        toast.error('Payment failed: ' + response.error.description);
        setIsSubmitting(false);
      });
      rzp1.open();

    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  const placeOrder = async (paymentId) => {
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
        totalAmount: getCartTotal(),
        paymentDetails: { paymentId, status: 'Paid' } // Add payment details
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
      
      toast.success('Order placed successfully!');
      clearCart();
      
      navigate(user ? '/profile' : '/');
      
    } catch (err) {
      console.error(err);
      toast.error('Order was paid but failed to save. Please contact support.');
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
              
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button type="submit" className="gold-cta" style={{ borderRadius: '8px', padding: '0.8rem 2rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
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

import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="cart-header">
              <h2>Your Royal Cart</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty.</p>
                  <button className="gold-cta" onClick={() => { setIsCartOpen(false); navigate('/menu'); }}>
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="price">₹{item.price}</p>
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FaMinus size={10}/></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FaPlus size={10}/></button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button className="gold-cta" onClick={handleCheckout} style={{ borderRadius: '8px', padding: '0.6rem 1.5rem', width: 'auto' }}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

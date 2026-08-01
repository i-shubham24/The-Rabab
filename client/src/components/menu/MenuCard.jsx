import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaStar, FaSeedling, FaShoppingCart } from 'react-icons/fa';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const { name, description, price, image, isVeg, spiceLevel, isFeatured, allergens } = item;

  return (
    <motion.div 
      className="menu-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      layout
    >
      <div className="menu-card-image-container">
        <img src={image} alt={name} className="menu-card-image" />
        <div className="menu-card-overlay"></div>
        {isFeatured && (
          <div className="menu-card-badge-featured">
            <FaStar className="star-icon" /> Chef's Special
          </div>
        )}
        <div className={`menu-card-badge-type ${isVeg ? 'veg' : 'non-veg'}`}>
          <div className="type-indicator"></div>
        </div>
      </div>
      
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3 className="menu-card-title">{name}</h3>
        </div>
        
        <p className="menu-card-desc">{description}</p>
        
        {allergens && allergens.length > 0 && (
          <div className="menu-card-allergens">
            {allergens.map((allergen, idx) => (
              <span key={idx} className="allergen-tag">{allergen}</span>
            ))}
          </div>
        )}
        
        <div className="menu-card-footer">
          <div className="menu-card-price">₹{price}</div>
          <div className="menu-card-actions">
            {spiceLevel > 0 && (
              <div className="menu-card-spice" title={`Spice level: ${spiceLevel}`}>
                {[...Array(3)].map((_, i) => (
                  <FaFire key={i} className={`spice-icon ${i < spiceLevel ? 'active' : ''}`} />
                ))}
              </div>
            )}
            <button className="add-to-cart-btn" disabled>
              <FaShoppingCart /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;

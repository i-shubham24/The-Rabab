import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { featuredDishes } from '../../data/menuData';
import './FeaturedDishes.css';

const FeaturedDishes = () => {
  const dishes = featuredDishes.slice(0, 6);

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <h4 className="section-label">CULINARY MASTERPIECES</h4>
          <h2 className="section-title">Our Signature Dishes</h2>
        </div>
        
        <div className="dishes-grid">
          {dishes.map((dish, index) => (
            <motion.div 
              key={dish.id} 
              className="dish-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="dish-image-wrapper">
                <img src={dish.image || '/images/food/dal-makhani.jpg'} alt={dish.name} className="dish-image" />
                <div className="dish-overlay">
                  <div className={`dietary-badge ${dish.isVeg ? 'veg' : 'non-veg'}`}></div>
                  {dish.isFeatured && <span className="badge badge-featured">Chef's Special</span>}
                </div>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">{dish.name}</h3>
                <p className="dish-description">{dish.description}</p>
                <div className="dish-footer">
                  <span className="dish-price">₹{dish.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/menu" className="gold-cta">
            Browse Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDishes;

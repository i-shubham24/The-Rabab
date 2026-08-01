import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const reviews = [
    { id: 1, name: 'Vikram Singh', text: 'An absolute masterpiece of culinary art. The ambiance took me back to the royal courts of Punjab. Highly recommend the Sikandari Raan!', rating: 5 },
    { id: 2, name: 'Priya Sharma', text: 'The attention to detail is exquisite. From the gold-flecked decor to the delicate flavors of the Dal Rabab, everything was perfect.', rating: 5 },
    { id: 3, name: 'Aman Gill', text: 'Finest dining experience in Rayya. The staff is extremely courteous and the food is simply divine.', rating: 5 },
    { id: 4, name: 'Neha Kapoor', text: 'A truly majestic experience. The interior design is stunning and matches the high quality of the cuisine.', rating: 5 },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-background"></div>
      <div className="container">
        <div className="section-header">
          <h4 className="section-label">GUEST EXPERIENCES</h4>
          <h2 className="section-title">What Our Guests Say</h2>
        </div>
        
        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">"{review.text}"</p>
              <div className="testimonial-footer">
                <div className="avatar">
                  {review.name.charAt(0)}
                </div>
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{review.name}</h4>
                  <div className="stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

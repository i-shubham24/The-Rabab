import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import './Gallery.css';

// Sample gallery data
const galleryData = [
  { id: 1, src: '/images/food/dal-makhani.jpg', category: 'Food', caption: 'Signature Dal Makhani' },
  { id: 2, src: '/images/ambiance/interior.jpg', category: 'Ambiance', caption: 'Royal Dining Area' },
  { id: 3, src: '/images/food/food-spread.jpg', category: 'Food', caption: 'The Royal Spread' },
  { id: 4, src: '/images/food/dal-makhani.jpg', category: 'Events', caption: 'Private Dining' },
  { id: 5, src: '/images/ambiance/interior.jpg', category: 'Ambiance', caption: 'Elegant Seating' },
  { id: 6, src: '/images/food/food-spread.jpg', category: 'Kitchen', caption: 'Master Chefs at Work' },
  { id: 7, src: '/images/food/dal-makhani.jpg', category: 'Food', caption: 'Spices of India' },
  { id: 8, src: '/images/ambiance/interior.jpg', category: 'Events', caption: 'Wedding Reception Setup' },
  { id: 9, src: '/images/food/food-spread.jpg', category: 'Food', caption: 'Festive Thali' },
  { id: 10, src: '/images/food/dal-makhani.jpg', category: 'Kitchen', caption: 'Tandoor Specials' },
  { id: 11, src: '/images/ambiance/interior.jpg', category: 'Ambiance', caption: 'Evening Vibe' },
  { id: 12, src: '/images/food/food-spread.jpg', category: 'Events', caption: 'Corporate Gatherings' }
];

const categories = ['All', 'Food', 'Ambiance', 'Events', 'Kitchen'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredGallery = activeCategory === 'All' 
    ? galleryData 
    : galleryData.filter(item => item.category === activeCategory);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(filteredGallery[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredGallery.length - 1;
    if (newIndex >= filteredGallery.length) newIndex = 0;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredGallery[newIndex]);
  };

  return (
    <div className="gallery-page">
      {/* Hero Banner */}
      <section className="gallery-hero">
        <div className="gallery-hero-overlay"></div>
        <div className="gallery-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Capturing the Essence of Rabab
          </motion.p>
        </div>
      </section>

      <section className="gallery-content container">
        {/* Category Filters */}
        <div className="gallery-filters">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`gallery-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {activeCategory === cat && <motion.div layoutId="gallery-underline" className="gallery-active-underline" />}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="gallery-masonry">
          <AnimatePresence>
            {filteredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="gallery-item"
                onClick={() => openLightbox(index)}
              >
                <img src={item.src} alt={item.caption} loading="lazy" />
                <div className="gallery-item-overlay">
                  <div className="gallery-item-info">
                    <FaExpand className="expand-icon" />
                    <h3>{item.caption}</h3>
                    <span>{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>
            
            <div className="lightbox-content">
              <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>
                <FaChevronLeft />
              </button>
              
              <motion.div 
                className="lightbox-image-container"
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img src={selectedImage.src} alt={selectedImage.caption} className="lightbox-image" />
                <div className="lightbox-caption">
                  <h2>{selectedImage.caption}</h2>
                  <p>{selectedImage.category}</p>
                </div>
              </motion.div>
              
              <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>
                <FaChevronRight />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import './Gallery.css';

const categories = ['All', 'Food', 'Ambiance', 'Events', 'Kitchen'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryData, setGalleryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

const fallbackGallery = [
  { _id: '1', mediaUrl: '/images/food/dal-makhani.jpg', category: 'Food', title: 'Signature Dal Makhani' },
  { _id: '2', mediaUrl: '/images/ambiance/interior.jpg', category: 'Ambiance', title: 'Royal Dining Area' },
  { _id: '3', mediaUrl: '/images/food/food-spread.jpg', category: 'Food', title: 'The Royal Spread' }
];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setGalleryData(Array.isArray(data) && data.length > 0 ? data : fallbackGallery);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
        setGalleryData(fallbackGallery);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

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
            {isLoading ? (
              <div className="text-center w-100" style={{ padding: '4rem', color: '#fff' }}>Loading gallery...</div>
            ) : filteredGallery.length === 0 ? (
              <div className="text-center w-100" style={{ padding: '4rem', color: '#fff' }}>No images found.</div>
            ) : (
              filteredGallery.map((item, index) => (
                <motion.div
                  key={item._id || item.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                >
                  <img src={item.mediaUrl || item.src} alt={item.title || item.caption} loading="lazy" />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-info">
                      <FaExpand className="expand-icon" />
                      <h3>{item.title || item.caption}</h3>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
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
                key={selectedImage._id || selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img src={selectedImage.mediaUrl || selectedImage.src} alt={selectedImage.title || selectedImage.caption} className="lightbox-image" />
                <div className="lightbox-caption">
                  <h2>{selectedImage.title || selectedImage.caption}</h2>
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuCard from '../components/menu/MenuCard';
import MenuFilter from '../components/menu/MenuFilter';
import { FaUtensils } from 'react-icons/fa';
// Ensure this mock data import is available or we'll define a fallback if it fails.
import { menuItems as dataItems, menuCategories } from '../data/menuData'; 
import './Menu.css';

const Menu = () => {
  const categories = menuCategories || ['Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'];

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // all, veg, non-veg
  const [spiceFilter, setSpiceFilter] = useState('all');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/menu');
        const data = await res.json();
        // Fallback to static if backend fails
        setItems(data.length > 0 ? data : dataItems);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setItems(dataItems);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu = items.filter(item => {
    // Category filter
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Veg/Non-veg filter
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;
    
    // Spice filter
    if (spiceFilter !== 'all' && item.spiceLevel !== parseInt(spiceFilter)) return false;
    
    return true;
  });

  return (
    <div className="menu-page">
      {/* Hero Banner */}
      <section className="menu-hero">
        <div className="menu-hero-overlay"></div>
        <div className="menu-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A Royal Culinary Journey
          </motion.p>
        </div>
      </section>

      <section className="menu-content-container container">
        <MenuFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          vegFilter={vegFilter}
          onVegFilterChange={setVegFilter}
          spiceFilter={spiceFilter}
          onSpiceFilterChange={setSpiceFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="menu-grid">
          <AnimatePresence>
            {isLoading ? (
              <div className="menu-empty-state" style={{ padding: '4rem', width: '100%' }}>
                <p>Loading the royal feast...</p>
              </div>
            ) : filteredMenu.length > 0 ? (
              filteredMenu.map((item, index) => (
                <MenuCard key={item._id || item.id || index} item={item} />
              ))
            ) : (
              <motion.div 
                className="menu-empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FaUtensils className="empty-icon" />
                <h2>No dishes found</h2>
                <p>Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Menu;

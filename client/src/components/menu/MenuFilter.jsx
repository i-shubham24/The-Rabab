import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './MenuFilter.css';

const MenuFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  vegFilter, 
  onVegFilterChange, 
  spiceFilter, 
  onSpiceFilterChange, 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <div className="menu-filter-container">
      <div className="menu-filter-top-row">
        <div className="menu-search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="menu-filters-advanced">
          <div className="veg-filter">
            <button 
              className={`filter-btn ${vegFilter === 'all' ? 'active' : ''}`}
              onClick={() => onVegFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn veg ${vegFilter === 'veg' ? 'active' : ''}`}
              onClick={() => onVegFilterChange('veg')}
            >
              <span className="dot green"></span> Veg
            </button>
            <button 
              className={`filter-btn non-veg ${vegFilter === 'non-veg' ? 'active' : ''}`}
              onClick={() => onVegFilterChange('non-veg')}
            >
              <span className="dot red"></span> Non-Veg
            </button>
          </div>

          <div className="spice-filter">
            <select 
              value={spiceFilter} 
              onChange={(e) => onSpiceFilterChange(e.target.value)}
              className="spice-select"
            >
              <option value="all">Any Spice Level</option>
              <option value="0">Not Spicy</option>
              <option value="1">Mild 🌶️</option>
              <option value="2">Medium 🌶️🌶️</option>
              <option value="3">Hot 🌶️🌶️🌶️</option>
            </select>
          </div>
        </div>
      </div>

      <div className="menu-categories-wrapper">
        <div className="menu-categories">
          <button 
            className={`category-tab ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => onCategoryChange('All')}
          >
            All
            {activeCategory === 'All' && <motion.div layoutId="underline" className="active-underline" />}
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span> {cat.name}
              {activeCategory === cat.id && <motion.div layoutId="underline" className="active-underline" />}
            </button>
          ))}
        </div>
      </div>

      </div>
    </div>
  );
};

export default MenuFilter;

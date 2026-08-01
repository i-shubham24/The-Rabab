import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaInstagram, FaUser, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import AuthModal from './AuthModal';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/booking', label: 'Reservations' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, setIsCartOpen } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="rabab-icon">
              <path d="M20 2 C20 2, 8 15, 8 30 C8 40, 13 48, 20 48 C27 48, 32 40, 32 30 C32 15, 20 2, 20 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="20" y1="5" x2="20" y2="45" stroke="currentColor" strokeWidth="1"/>
              <line x1="13" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="0.8"/>
              <line x1="12" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="0.8"/>
              <circle cx="20" cy="38" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-sub">Majestic</span>
            <span className="navbar__logo-main">RABAB</span>
            <span className="navbar__logo-tagline">FINE DINING</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${
                  location.pathname === link.path ? 'navbar__link--active' : ''
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    className="navbar__link-indicator"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="navbar__actions">
          <a href="tel:+917900324000" className="navbar__phone" title="Call for reservation">
            <FaPhone />
            <span>7900324000</span>
          </a>
          {user ? (
            <Link to="/profile" className="navbar__profile" title="My Profile" style={{ color: 'var(--gold)', fontSize: '1.2rem', margin: '0 15px' }}>
              <FaUser />
            </Link>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="navbar__profile" title="Sign In" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', margin: '0 15px' }}>
              <FaUser />
            </button>
          )}
          <button 
            className="navbar__cart-btn" 
            onClick={() => setIsCartOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', margin: '0 15px', position: 'relative' }}
          >
            <FaShoppingCart />
            {getCartCount() > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--gold)', color: 'var(--charcoal)', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '50%' }}>
                {getCartCount()}
              </span>
            )}
          </button>
          <Link to="/booking" className="gold-cta" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            Book a Table
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="navbar__mobile-inner">
              <ul className="navbar__mobile-links">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className={`navbar__mobile-link ${
                        location.pathname === link.path ? 'navbar__mobile-link--active' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="navbar__mobile-actions">
                <a href="tel:+917900324000" className="btn btn-outline w-full">
                  <FaPhone /> Call 7900324000
                </a>
                <Link to="/booking" className="gold-cta w-full">
                  Book a Table
                </Link>
              </div>
              <div className="navbar__mobile-social">
                <a href="https://instagram.com/therababrayya" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> @therababrayya
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </motion.nav>
  );
};

export default Navbar;

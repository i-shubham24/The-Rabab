import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaGoogle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaArrowUp,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Decorative Gold Line */}
      <div className="footer__top-line" />

      <div className="footer__container container">
        {/* Main Footer Grid */}
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2 C20 2, 8 15, 8 30 C8 40, 13 48, 20 48 C27 48, 32 40, 32 30 C32 15, 20 2, 20 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <line x1="20" y1="5" x2="20" y2="45" stroke="currentColor" strokeWidth="1"/>
                  <line x1="13" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="12" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="0.8"/>
                  <circle cx="20" cy="38" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
              </div>
              <div>
                <span className="footer__logo-sub">Majestic</span>
                <span className="footer__logo-main">RABAB</span>
                <span className="footer__logo-tagline">FINE DINING</span>
              </div>
            </div>
            <p className="footer__tagline">
              Experience Royal Dining at Rabab. Where rich flavors, authentic spices, 
              and timeless recipes come together to create a truly unforgettable dining experience.
            </p>
            <div className="footer__socials">
              <a href="https://instagram.com/therababrayya" target="_blank" rel="noopener noreferrer" title="Instagram">
                <FaInstagram />
              </a>
              <a href="#" title="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" title="Google Maps">
                <FaGoogle />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__column">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/booking">Reservations</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__column">
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__contact">
              <li>
                <FaMapMarkerAlt className="footer__contact-icon" />
                <span>Grand Trunk Road, Opp Fateh World School, Rayya, Punjab 143112</span>
              </li>
              <li>
                <FaPhone className="footer__contact-icon" />
                <a href="tel:+917900324000">+91 7900324000</a>
              </li>
              <li>
                <FaEnvelope className="footer__contact-icon" />
                <a href="mailto:info@majesticrabab.com">info@majesticrabab.com</a>
              </li>
              <li>
                <FaClock className="footer__contact-icon" />
                <span>Mon – Sun: 12:00 PM – 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Reserve */}
          <div className="footer__column">
            <h4 className="footer__heading">Reserve Now</h4>
            <p className="footer__reserve-text">
              Book your table for an unforgettable royal dining experience.
            </p>
            <Link to="/booking" className="btn btn-gold w-full footer__reserve-btn">
              Book a Table
            </Link>
            <a href="tel:+917900324000" className="btn btn-outline w-full footer__call-btn">
              <FaPhone /> Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-container container">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Majestic Rabab Fine Dining. All rights reserved.
          </p>
          <p className="footer__made">
            Crafted with <FaHeart className="footer__heart" /> for true food lovers
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <button className="footer__scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;

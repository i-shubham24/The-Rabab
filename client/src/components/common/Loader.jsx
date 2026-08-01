import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <motion.div
        className="loader__content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loader__rabab">
          <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M30 4 C30 4, 12 22, 12 45 C12 60, 20 72, 30 72 C40 72, 48 60, 48 45 C48 22, 30 4, 30 4Z"
              stroke="var(--gold)"
              strokeWidth="2"
              fill="none"
              className="loader__rabab-body"
            />
            <line x1="30" y1="8" x2="30" y2="68" stroke="var(--gold)" strokeWidth="1.5" className="loader__rabab-string" />
            <circle cx="30" cy="55" r="5" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="loader__text">
          <span className="loader__brand">RABAB</span>
          <span className="loader__dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;

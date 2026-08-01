import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Loader from './components/common/Loader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/common/CartDrawer';
import ChatWidget from './components/common/ChatWidget';
import './styles/index.css';

import PageWrapper from './components/common/PageWrapper';
import CustomCursor from './components/common/CustomCursor';
import { AnimatePresence } from 'framer-motion';

// Lazy-loaded pages for code-splitting
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Booking = lazy(() => import('./pages/Booking'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <CartDrawer />
      {!isAdminRoute && <Navbar />}
      <main>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
              <Route path="/booking" element={<PageWrapper><Booking /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
              <Route path="/profile" element={<PageWrapper><CustomerProfile /></PageWrapper>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#F5F0E8',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
              },
              success: {
                iconTheme: {
                  primary: '#C9A84C',
                  secondary: '#1A1A1A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E74C3C',
                  secondary: '#1A1A1A',
                },
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

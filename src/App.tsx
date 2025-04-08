import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ScrollProgress from './components/ScrollProgress';
import ProtectedRoute from './components/ProtectedRoute';

// Component for animated routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Animation variants for pages
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="w-full flex-grow"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiresAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Fallback route - redirect to home if no match */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Separate component to use routing hooks
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // If we're at the base URL with no path, explicitly navigate to home
    if (location.pathname === '' || location.pathname === '/') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-gray-900 transition-colors duration-300">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow relative">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
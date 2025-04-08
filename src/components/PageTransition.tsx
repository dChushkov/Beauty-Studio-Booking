import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
          staggerChildren: 0.1,
        } 
      }}
      exit={{ 
        opacity: 0, 
        y: -20,
        transition: { 
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1.0],
        } 
      }}
      className={`w-full ${className}`}
    >
      {/* Loader line animation on top of the page */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-0.5 z-50 ${
          theme === 'dark' ? 'bg-lavender-500' : 'bg-lavender-600'
        }`}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ 
          scaleX: [0, 1, 1, 0],
          transformOrigin: ["left", "left", "right", "right"],
          transition: { 
            times: [0, 0.4, 0.6, 1],
            duration: 1.2, 
            ease: "easeInOut"
          }
        }}
      />
      
      {children}
    </motion.div>
  );
};

export default PageTransition; 
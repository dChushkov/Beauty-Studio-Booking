import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  zIndex?: number;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  height = 3,
  zIndex = 40,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Make the scrolling animation smoother with spring physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Only show progress bar after scrolling a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic color based on theme
  const progressColor = theme === 'dark' 
    ? 'bg-gradient-to-r from-lavender-500 to-fuchsia-500' 
    : 'bg-gradient-to-r from-lavender-600 to-fuchsia-600';

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 ${progressColor} origin-left ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={{
        scaleX,
        height,
        zIndex,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default ScrollProgress; 
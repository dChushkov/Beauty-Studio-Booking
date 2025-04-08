import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const MouseFollower: React.FC = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // Motion values for cursor position with spring physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Apply spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Show cursor after we have coordinates
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    // Check if hovering over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null;
      
      setIsHoveringClickable(isClickable);
    };

    // Hide cursor when leaving the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  // Only show on desktop devices
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      {/* Main dot */}
      <motion.div
        className={`fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference
          ${isVisible ? 'opacity-100' : 'opacity-0'} 
          transition-opacity duration-300`}
        style={{
          x: springX,
          y: springY,
        }}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
          animate={{
            scale: isHoveringClickable ? 1.6 : 1,
            opacity: isHoveringClickable ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Trailing effect */}
      <motion.div
        className={`fixed top-0 left-0 z-[99] pointer-events-none
          ${isVisible ? 'opacity-60' : 'opacity-0'} 
          transition-opacity duration-300`}
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          scale: isHoveringClickable ? 3 : 1.7,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className={`w-8 h-8 -ml-4 -mt-4 rounded-full opacity-20
            ${theme === 'dark' ? 'bg-lavender-200' : 'bg-lavender-600'}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </>
  );
};

export default MouseFollower; 
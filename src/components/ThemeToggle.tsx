import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Animation for particles when theme changes
  const particlesVariants = {
    initial: { 
      scale: 0,
      opacity: 0,
    },
    animate: (i: number) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)],
      y: [0, (i < 2 ? -1 : 1) * (10 + (i % 2) * 5)],
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.1 + (i * 0.05),
      }
    }),
  };

  // Button animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: theme === 'dark' 
        ? '0 0 10px rgba(139, 92, 246, 0.3)' 
        : '0 0 10px rgba(250, 204, 21, 0.5)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  // Function to toggle theme with visual effect
  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <motion.button
      onClick={handleThemeToggle}
      className={`relative overflow-visible w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-lavender-800/30 hover:bg-lavender-700/40' 
          : 'bg-lavender-200 hover:bg-lavender-300'
      }`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {/* Background circle with pulsing effect */}
      <motion.div 
        className={`absolute inset-0 rounded-full ${
          theme === 'dark' 
            ? 'bg-lavender-800/0' 
            : 'bg-amber-400/0'
        }`}
        animate={{ 
          boxShadow: isHovered ? (
            theme === 'dark' 
              ? ['0 0 0px rgba(139, 92, 246, 0)', '0 0 10px rgba(139, 92, 246, 0.3)', '0 0 0px rgba(139, 92, 246, 0)']
              : ['0 0 0px rgba(250, 204, 21, 0)', '0 0 10px rgba(250, 204, 21, 0.3)', '0 0 0px rgba(250, 204, 21, 0)']
          ) : '0 0 0px rgba(255, 255, 255, 0)',
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "loop",
        }}
      />

      {/* Icon - Moon */}
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0 
        }}
        transition={{ duration: 0.5 }}
        className="absolute"
      >
        <Moon 
          size={18} 
          className={`${isHovered ? 'text-lavender-200' : 'text-lavender-300'} transition-colors`} 
        />
      </motion.div>
      
      {/* Icon - Sun */}
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'light' ? 0 : -180,
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0 
        }}
        transition={{ duration: 0.5 }}
        className="absolute"
      >
        <Sun 
          size={20} 
          className={`${isHovered ? 'text-amber-400' : 'text-amber-500'} transition-colors`} 
        />
      </motion.div>

      {/* Particles on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  theme === 'dark' ? 'bg-lavender-400' : 'bg-amber-400'
                }`}
                variants={particlesVariants}
                initial="initial"
                animate="animate"
                exit="initial"
                custom={i}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle; 
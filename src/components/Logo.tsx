import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Logo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Анимационни варианти за логото
  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };
  
  // Анимационни варианти за текста
  const textVariants = {
    initial: { y: 0 },
    hover: {
      y: [0, -2, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatDelay: 5
      }
    }
  };
  
  // Анимационни варианти за блестящия ефект
  const glowVariants = {
    initial: { opacity: 0, scale: 0.5 },
    hover: {
      opacity: [0, 0.3, 0],
      scale: [0.5, 1.2, 0.5],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity
      }
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-1.5 select-none"
      variants={logoVariants}
      initial="initial"
      whileHover="hover"
      animate="initial"
    >
      <div className="relative">
        <motion.div
          className={`absolute -inset-1 rounded-full blur-md ${
            theme === 'dark' ? 'bg-lavender-500/10' : 'bg-lavender-500/5'
          }`}
          variants={glowVariants}
        />
        <span className={`text-xl font-bold drop-shadow-sm ${
          theme === 'dark' ? 'text-lavender-200' : 'text-lavender-800'
        }`}>
          Make
          <span className={theme === 'dark' ? 'text-fuchsia-400' : 'text-fuchsia-600'}>Up</span>
        </span>
      </div>
      <motion.span 
        className={`text-xs mt-0.5 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
        variants={textVariants}
      >
        {t('logo.subtitle')}
      </motion.span>
    </motion.div>
  );
};

export default Logo; 
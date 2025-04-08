import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  
  const toggleLanguage = () => {
    setIsChanging(true);
    
    // Забавяме смяната на език с 300ms, за да се покаже анимацията
    setTimeout(() => {
      const newLang = i18n.language === 'en' ? 'bg' : 'en';
      i18n.changeLanguage(newLang);
      setIsChanging(false);
    }, 300);
  };

  // Анимацията на текста при преход
  const textVariants = {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.3 } }
  };

  // Анимация на сферата
  const sphereVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 30, transition: { duration: 0.5 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
    changing: { 
      rotate: 360,
      transition: { 
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  // Анимация на бутона
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: theme === 'dark' 
        ? '0 0 10px rgba(139, 92, 246, 0.2)' 
        : '0 0 10px rgba(139, 92, 246, 0.15)',
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={toggleLanguage}
      className={`relative flex items-center space-x-1 rounded-full px-3 py-1.5 overflow-hidden
        ${theme === 'dark' 
          ? 'border border-lavender-400/50 text-lavender-300 hover:bg-lavender-700/30 hover:border-lavender-400' 
          : 'border border-lavender-500/80 text-lavender-700 hover:bg-lavender-200/50 hover:border-lavender-600'
        } transition-all duration-300`}
    >
      {/* Градиентен фон */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0"
        whileHover={{
          opacity: 0.05,
          background: theme === 'dark'
            ? 'radial-gradient(circle at center, rgba(139, 92, 246, 0.6), transparent 70%)'
            : 'radial-gradient(circle at center, rgba(139, 92, 246, 0.4), transparent 70%)'
        }}
      />
      
      {/* Икона */}
      <motion.div
        variants={sphereVariants}
        animate={isChanging ? "changing" : "initial"}
      >
        <Globe className={`h-4 w-4 ${
          isChanging 
            ? theme === 'dark' ? 'text-lavender-200' : 'text-lavender-600'
            : ''
        }`} />
      </motion.div>
      
      {/* Текст */}
      <div className="relative overflow-hidden h-[16px] flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={i18n.language}
            className="text-xs font-medium inline-block absolute"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {i18n.language === 'en' ? 'BG' : 'EN'}
          </motion.span>
        </AnimatePresence>
      </div>
      
      {/* Частици при смяна */}
      <AnimatePresence>
        {isChanging && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  theme === 'dark' ? 'bg-lavender-400' : 'bg-lavender-600'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [(i-1) * 10, (i-1) * 15], 
                  y: [0, i === 1 ? -15 : (i === 0 ? 12 : 12)],
                  opacity: [0, 0.8, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default LanguageSwitcher;
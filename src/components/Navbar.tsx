import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, LogOut, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Text3D from './Text3D';

const Navbar = () => {
  const { t, ready } = useTranslation();
  const { theme } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Микро-анимации за навигационните елементи
  const navItemVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeIn" }
    }
  };

  // Анимация за подчертаване на активен линк
  const underlineVariants = {
    initial: { 
      width: 0,
      left: "50%",
      right: "50%",
    },
    hover: { 
      width: "100%",
      left: 0,
      right: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      width: 0,
      left: "50%",
      right: "50%",
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Анимация за бутон "Запази час"
  const bookingButtonVariants = {
    initial: { 
      scale: 1,
      boxShadow: `0 4px 6px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.5)' : 'rgba(109, 40, 217, 0.2)'}`
    },
    hover: { 
      scale: 1.05,
      boxShadow: `0 6px 10px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.6)' : 'rgba(109, 40, 217, 0.3)'}`,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { 
      scale: 0.98,
      boxShadow: `0 2px 4px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.4)' : 'rgba(109, 40, 217, 0.15)'}`,
      transition: { duration: 0.1, ease: "easeIn" }
    }
  };

  // Обработчик за изход
  const handleLogout = () => {
    logout();
  };

  // Определяме текстовете, дори ако преводите не са заредени
  const texts = {
    home: ready ? t('nav.home') : 'Начало',
    admin: ready ? t('nav.admin') : 'Админ Панел',
    bookNow: ready ? t('nav.bookNow') : 'Запази час',
    logout: ready ? t('nav.logout') : 'Изход'
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-black' : 'bg-white'} shadow-lg border-b ${theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-200'} sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative p-2"
            >
              <Palette className={`h-8 w-8 ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-600'} transition-colors duration-300`} />
              <motion.div
                className={`absolute inset-0 ${theme === 'dark' ? 'bg-lavender-500' : 'bg-lavender-400'} rounded-full opacity-30 blur-lg transition-colors duration-300`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <div className="flex flex-col">
              <Text3D
                fontSize="text-xl"
                depth={3}
                textColor={theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 via-mauve-400 to-lavender-300' : 'text-transparent bg-clip-text bg-gradient-to-r from-lavender-700 via-mauve-600 to-lavender-700'}
                shadowColor={theme === 'dark' ? 'rgba(138, 92, 246, 0.4)' : 'rgba(109, 40, 217, 0.3)'}
                followMouse={true}
                fontWeight="font-bold font-cormorant"
                shadowOpacity={0.4}
              >
                Beauty Style
              </Text3D>
              <Text3D
                fontSize="text-xs"
                depth={2}
                textColor={theme === 'dark' ? 'text-lavender-300/90' : 'text-lavender-600/90'}
                shadowColor={theme === 'dark' ? 'rgba(138, 92, 246, 0.2)' : 'rgba(109, 40, 217, 0.15)'}
                followMouse={true}
                fontWeight="font-normal"
                shadowOpacity={0.2}
              >
                {ready ? t('logo.subtitle') : 'Салон за красота'}
              </Text3D>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <motion.div
              variants={navItemVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredLink('home')}
              onHoverEnd={() => setHoveredLink(null)}
              className="relative"
            >
              <Link 
                to="/" 
                className={`text-sm font-medium ${theme === 'dark' ? 'text-lavender-200 hover:text-lavender-100' : 'text-lavender-800 hover:text-lavender-600'} px-3 py-2 rounded-md transition-colors duration-300 relative`}
              >
                {texts.home}
                
                <AnimatePresence>
                  {hoveredLink === 'home' && (
                    <motion.div
                      className={`absolute -bottom-1 h-0.5 bg-gradient-to-r ${theme === 'dark' ? 'from-lavender-400 to-mauve-500' : 'from-lavender-600 to-mauve-600'} rounded`}
                      variants={underlineVariants}
                      initial="initial"
                      animate="hover"
                      exit="exit"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            
            {/* Бутон за админ панел - видим само за админи */}
            {isAuthenticated && isAdmin && (
              <motion.div
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredLink('admin')}
                onHoverEnd={() => setHoveredLink(null)}
                className="relative"
              >
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-lavender-200 hover:text-lavender-100' : 'text-lavender-800 hover:text-lavender-600'} px-3 py-2 rounded-md transition-colors duration-300 relative flex items-center`}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  {texts.admin}
                  
                  <AnimatePresence>
                    {hoveredLink === 'admin' && (
                      <motion.div
                        className={`absolute -bottom-1 h-0.5 bg-gradient-to-r ${theme === 'dark' ? 'from-lavender-400 to-mauve-500' : 'from-lavender-600 to-mauve-600'} rounded`}
                        variants={underlineVariants}
                        initial="initial"
                        animate="hover"
                        exit="exit"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            )}
            
            <motion.div
              variants={bookingButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="rounded-full overflow-hidden"
            >
              <Link 
                to="/booking" 
                className={`flex items-center justify-center relative rounded-full text-sm font-medium bg-transparent`}
                style={{ width: "fit-content", height: "40px", padding: "0 16px" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-lavender-600 to-mauve-600 rounded-full"
                  initial={{ opacity: 1 }}
                  whileHover={{ 
                    opacity: 0.9,
                    background: "linear-gradient(to right, rgb(124, 58, 237), rgb(219, 39, 119))"
                  }}
                />
                <Text3D
                  fontSize="text-sm"
                  fontWeight="font-medium"
                  depth={2}
                  textColor="text-white"
                  shadowColor="rgba(0, 0, 0, 0.2)"
                  followMouse={false}
                  shadowOpacity={0.3}
                  className="relative z-10"
                  glowIntensity={0}
                >
                  {texts.bookNow}
                </Text3D>
                <motion.div
                  className="absolute -inset-1 rounded-full z-0 opacity-0"
                  whileHover={{ 
                    opacity: 0.2,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `radial-gradient(circle at center, ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'}, transparent 70%)`,
                  }}
                />
              </Link>
            </motion.div>
            
            {/* Theme и Language селектори също с микро-анимации */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <LanguageSwitcher />
            </motion.div>
            
            {/* Бутон за изход - видим само при влязъл потребител */}
            {isAuthenticated && (
              <motion.button
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleLogout}
                className={`text-sm font-medium ${theme === 'dark' ? 'text-lavender-200 hover:text-red-300' : 'text-lavender-800 hover:text-red-600'} px-3 py-2 rounded-md transition-colors duration-300 flex items-center`}
              >
                <LogOut className="w-4 h-4 mr-1" />
                {texts.logout}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
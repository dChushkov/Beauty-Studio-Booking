import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'filled' | 'outlined' | 'glass';
  hoverEffect?: 'lift' | 'glow' | 'particle' | 'shine' | 'none';
  cornerIndicator?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'filled',
  hoverEffect = 'lift',
  cornerIndicator = false,
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Базови стилове според варианта
  const variantStyles = {
    filled: `${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} 
             ${theme === 'dark' ? 'border border-lavender-800/30' : 'border border-lavender-200/80'}`,
    outlined: `${theme === 'dark' ? 'bg-transparent' : 'bg-lavender-50/50'} 
               ${theme === 'dark' ? 'border border-lavender-700/50' : 'border border-lavender-300'}`,
    glass: `backdrop-blur-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-white/30'} 
            ${theme === 'dark' ? 'border border-white/10' : 'border border-lavender-200/50'}`,
  };
  
  // Анимации при hover
  const cardVariants = {
    initial: { 
      y: 0,
      boxShadow: `0 2px 10px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.2)' : 'rgba(109, 40, 217, 0.1)'}`,
    },
    hovered: { 
      y: hoverEffect === 'lift' ? -5 : 0,
      boxShadow: `0 10px 20px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.3)' : 'rgba(109, 40, 217, 0.15)'}`,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  // Обработване на движението на мишката за ефекта на light
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Нормализиране на позицията на мишката в рамките на картата
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    
    setMousePosition({ x, y });
  };

  // Създаване на частици за particle ефекта
  const renderParticles = () => {
    if (hoverEffect !== 'particle' || !isHovered) return null;
    
    return (
      <motion.div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-lavender-400' : 'bg-lavender-600'}`}
            initial={{ 
              opacity: 0,
              x: '50%',
              y: '50%',
              scale: 0,
            }}
            animate={{ 
              opacity: [0, 0.8, 0],
              x: ['50%', `${30 + Math.random() * 40}%`],
              y: ['50%', `${30 + Math.random() * 40}%`],
              scale: [0, 1 + Math.random() * 0.5, 0],
            }}
            transition={{
              duration: 1 + Math.random(),
              ease: "easeOut",
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative rounded-xl overflow-hidden transition-colors duration-300
        ${variantStyles[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      variants={cardVariants}
      initial="initial"
      whileHover="hovered"
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      {/* Glow ефект */}
      {hoverEffect === 'glow' && (
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 z-0"
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: theme === 'dark' ? 0.15 : 0.07,
            transition: { duration: 0.5 }
          }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${theme === 'dark' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.5)'}, 
              transparent 100%)`
          }}
        />
      )}

      {/* Shine ефект */}
      {hoverEffect === 'shine' && (
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 z-0"
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: 1,
            transition: { duration: 0.5 }
          }}
          animate={{
            background: `linear-gradient(45deg, transparent, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)'} 40%, transparent 60%)`,
            left: ['-100%', '200%']
          }}
          transition={{
            left: {
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2
            }
          }}
        />
      )}

      {/* Частици */}
      {renderParticles()}

      {/* Съдържание */}
      <div className="relative z-10">{children}</div>

      {/* Индикатор в ъгъла за интерактивност */}
      {cornerIndicator && (
        <motion.div 
          className={`absolute top-2 right-2 w-2 h-2 rounded-full 
            ${theme === 'dark' ? 'bg-lavender-500/70' : 'bg-lavender-600/70'}`}
          animate={{ 
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.7, 1, 0.7] : 0.7,
          }}
          transition={{ 
            duration: 1.5, 
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse"
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard; 
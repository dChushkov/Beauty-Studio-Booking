import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animationIntensity?: 'subtle' | 'medium' | 'intense';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  icon,
  disabled = false,
  fullWidth = false,
  size = 'md',
  animationIntensity = 'medium',
}) => {
  const { theme } = useTheme();
  
  // Стилове според размера
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Интензивност на анимацията
  const intensityScale = {
    subtle: { hover: 1.02, tap: 0.98 },
    medium: { hover: 1.05, tap: 0.95 },
    intense: { hover: 1.08, tap: 0.92 },
  };

  // Стилове според варианта
  const variantStyles = {
    primary: {
      bg: `bg-gradient-to-r ${theme === 'dark' ? 'from-lavender-600 to-mauve-600' : 'from-lavender-500 to-mauve-500'}`,
      text: 'text-white',
      hover: theme === 'dark' 
        ? 'linear-gradient(to right, rgb(124, 58, 237), rgb(219, 39, 119))' 
        : 'linear-gradient(to right, rgb(139, 92, 246), rgb(236, 72, 153))',
    },
    secondary: {
      bg: theme === 'dark' ? 'bg-lavender-700/30' : 'bg-lavender-200',
      text: theme === 'dark' ? 'text-lavender-200' : 'text-lavender-800',
      hover: theme === 'dark' ? 'rgba(109, 40, 217, 0.4)' : 'rgba(196, 181, 253, 1)',
    },
    outline: {
      bg: 'bg-transparent',
      text: theme === 'dark' ? 'text-lavender-300' : 'text-lavender-700',
      border: theme === 'dark' ? 'border border-lavender-500/50' : 'border border-lavender-500',
      hover: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
    },
    ghost: {
      bg: 'bg-transparent',
      text: theme === 'dark' ? 'text-lavender-300' : 'text-lavender-700',
      hover: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
    },
  };

  // Базови анимационни варианти
  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: variant === 'primary' 
        ? `0 4px 6px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.5)' : 'rgba(109, 40, 217, 0.2)'}` 
        : 'none',
      y: 0,
    },
    hover: { 
      scale: intensityScale[animationIntensity].hover,
      boxShadow: variant === 'primary' 
        ? `0 6px 10px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.6)' : 'rgba(109, 40, 217, 0.3)'}` 
        : 'none',
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: intensityScale[animationIntensity].tap,
      boxShadow: variant === 'primary' 
        ? `0 2px 4px ${theme === 'dark' ? 'rgba(30, 20, 70, 0.4)' : 'rgba(109, 40, 217, 0.15)'}` 
        : 'none',
      y: 1,
      transition: { duration: 0.1, ease: "easeIn" }
    },
    disabled: {
      opacity: 0.6,
      scale: 1,
      boxShadow: 'none',
      y: 0,
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg font-medium relative overflow-hidden transition-colors
        ${sizeStyles[size]}
        ${variantStyles[variant].text}
        ${variantStyles[variant].bg}
        ${variantStyles[variant].border || ''}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? "disabled" : "tap"}
      animate={disabled ? "disabled" : "initial"}
    >
      {/* Градиентен ефект при hover */}
      {variant === 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ background: variantStyles[variant].hover }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Фонов ефект за останалите варианти */}
      {variant !== 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ background: variantStyles[variant].hover }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Съдържание на бутона с икона, ако има такава */}
      <motion.div 
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{ 
          y: disabled ? 0 : [0, -1, 0]
        }}
        transition={{ 
          y: { delay: 0.1, duration: 0.3 }
        }}
      >
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
      </motion.div>
      
      {/* Ефект на вълна при клик */}
      {!disabled && variant === 'primary' && (
        <motion.div
          className="absolute -inset-1 rounded-lg z-0 opacity-0 pointer-events-none"
          whileTap={{ 
            opacity: 0.15,
            scale: 1.5,
            transition: { duration: 0.5 }
          }}
          style={{
            background: `radial-gradient(circle at center, white, transparent 70%)`,
          }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton; 
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Text3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  followMouse?: boolean;
  textColor?: string;
  shadowColor?: string;
  shadowOpacity?: number;
  fontWeight?: string;
  fontSize?: string;
  as?: React.ElementType;
  glowColor?: string;
  glowIntensity?: number;
}

const Text3D: React.FC<Text3DProps> = ({
  children,
  className = '',
  depth = 6,
  followMouse = true,
  textColor = 'text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 via-mauve-500 to-lavender-600',
  shadowColor = 'rgba(138, 92, 246, 0.6)',
  shadowOpacity = 0.6,
  fontWeight = 'font-bold',
  fontSize = 'text-4xl',
  as: Component = 'span',
  glowColor = 'rgba(138, 92, 246, 0.2)',
  glowIntensity = 0.5,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!followMouse || !textRef.current) return;

    const rect = textRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Максимално отклонение - малко за по-фин ефект
    const maxRotate = 2;
    
    // Изчисляване на ъгъла на завъртане спрямо центъра на елемента
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * maxRotate;
    const rotateYValue = -((e.clientX - centerX) / (rect.width / 2)) * maxRotate;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  // Създаваме множество сенки за 3D ефект
  const generateTextShadow = () => {
    let shadow = '';
    const opacityStep = shadowOpacity / depth;
    
    for (let i = 1; i <= depth; i++) {
      // Леко добавяме и движение от мишката за по-добър ефект
      const xOffset = hovered ? rotateY * 0.05 : 0;
      const yOffset = hovered ? rotateX * 0.05 : 0;
      shadow += `${xOffset}px ${yOffset + i}px 0px ${shadowColor.replace(')', `, ${opacityStep * i})`)}${i === depth ? '' : ', '}`;
    }
    
    return shadow;
  };

  return (
    <motion.div
      ref={textRef}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotateX(0);
        setRotateY(0);
      }}
      initial={{ 
        perspective: 1000,
      }}
      animate={{
        perspective: 1000,
        rotateX: followMouse ? rotateX : 0,
        rotateY: followMouse ? rotateY : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Сияние зад текста */}
      {hovered && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg blur-xl"
          style={{
            background: glowColor,
            opacity: glowIntensity,
            transform: 'translateZ(-20px)',
          }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [glowIntensity, glowIntensity * 1.2, glowIntensity],
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
    
      <Component
        className={`
          ${fontSize} ${fontWeight} ${textColor}
          relative inline-block transition-all duration-300
        `}
        style={{
          textShadow: generateTextShadow(),
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </Component>
    </motion.div>
  );
};

export default Text3D; 
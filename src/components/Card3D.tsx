import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  shine?: boolean;
  shadow?: boolean;
  rotationIntensity?: number;
  shineIntensity?: number;
  shadowIntensity?: number;
  onClick?: () => void;
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  shine = true,
  shadow = true,
  rotationIntensity = 10,
  shineIntensity = 0.15,
  shadowIntensity = 0.4,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize mouse position to range [-1, 1]
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    setMouseX(normalizedX);
    setMouseY(normalizedY);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMouseX(0);
    setMouseY(0);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className} overflow-hidden`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ willChange: "transform" }}
    >
      {/* Фиксираното съдържание - никога не се променя */}
      <div className="relative z-10 h-full">
        {children}
        
        {/* Click Indicator */}
        {onClick && isHovering && (
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-lavender-500/20 flex items-center justify-center backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-lavender-500/80 animate-pulse" />
          </div>
        )}
      </div>

      {/* Card hover effect - само повдигане */}
      <motion.div
        className="absolute inset-0 z-0 rounded-3xl"
        initial={{ y: 0 }}
        animate={{ y: isHovering ? -4 : 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
      />

      {/* Moving Shine Effect */}
      {shine && isHovering && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden"
          animate={{
            background: `radial-gradient(
              circle at 
              ${(mouseX * 0.5 + 0.5) * 100}% 
              ${(mouseY * 0.5 + 0.5) * 100}%, 
              rgba(255, 255, 255, ${shineIntensity}), 
              transparent 8rem
            )`
          }}
          transition={{ type: "tween", ease: "backOut" }}
        />
      )}

      {/* Shadow Effect */}
      {shadow && (
        <motion.div
          className="absolute -inset-2 rounded-3xl -z-10"
          animate={{
            boxShadow: isHovering 
              ? `0px 8px 30px rgba(0, 0, 0, ${shadowIntensity})`
              : '0px 0px 10px rgba(0, 0, 0, 0.1)',
            scale: isHovering ? 1.01 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
      )}
    </div>
  );
};

export default Card3D; 
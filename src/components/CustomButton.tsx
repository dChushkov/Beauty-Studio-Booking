import React from 'react';

interface CustomButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CustomButton = ({ 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '', 
  children 
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gradient-to-r from-lavender-600 to-mauve-600 
        hover:from-lavender-500 hover:to-mauve-500 
        text-white font-medium
        py-3 px-6 rounded-lg shadow-md 
        hover:shadow-lg transition-all duration-300
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CustomButton; 
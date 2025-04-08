import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navigation = [
    { name: 'Начало', href: '/' },
    { name: 'Услуги', href: '/services' },
    { name: 'Галерия', href: '/gallery' },
    { name: 'За мен', href: '/about' },
    { name: 'Контакти', href: '/contact' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black shadow-md py-3' 
          : 'bg-black/80 backdrop-blur-md py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-cormorant text-2xl font-bold bg-gradient-to-r from-lavender-400 via-mauve-500 to-lavender-600 text-transparent bg-clip-text">Beauty Studio</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors duration-300 relative ${
                isActive(item.href) 
                  ? 'text-lavender-400' 
                  : 'text-white hover:text-lavender-300'
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-lavender-400 to-mauve-500 rounded"></div>
              )}
            </Link>
          ))}
          <Link
            to="/booking"
            className="bg-gradient-to-r from-lavender-600 to-mauve-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-lavender-500 hover:to-mauve-500 transition-all"
          >
            Резервирай
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-lavender-400 hover:text-lavender-300 transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden pt-20`}
      >
        <nav className="container mx-auto px-4 py-5 flex flex-col space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-lg py-3 px-4 rounded-lg transition-colors duration-200 ${
                isActive(item.href) 
                  ? 'bg-lavender-900/30 text-lavender-400 font-medium' 
                  : 'text-white hover:bg-black/40 hover:text-lavender-300'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/booking"
            className="mt-6 bg-gradient-to-r from-lavender-600 to-mauve-600 text-white text-center py-4 rounded-lg text-base font-medium hover:from-lavender-500 hover:to-mauve-500 transition-all"
          >
            Резервирай
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
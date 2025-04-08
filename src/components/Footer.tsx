import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const socialIcons = [
    { icon: Instagram, href: "#", ariaLabel: "Instagram" },
    { icon: Facebook, href: "#", ariaLabel: "Facebook" },
    { icon: Mail, href: "mailto:contact@gmbeautystyle.com", ariaLabel: "Email" }
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-black' : 'bg-lavender-50'} shadow-inner mt-auto transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className={`${theme === 'dark' ? 'text-white' : 'text-lavender-900'} font-cormorant text-lg transition-colors duration-300`}>
              {t('footer.rights')}
            </p>
          </div>
          <div className="flex space-x-6">
            {socialIcons.map((social, index) => (
              <motion.a 
                key={index}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={social.href} 
                aria-label={social.ariaLabel}
                className={`${theme === 'dark' ? 'text-lavender-400 hover:text-mauve-400' : 'text-lavender-600 hover:text-mauve-600'} transition-colors duration-300`}
              >
                <social.icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
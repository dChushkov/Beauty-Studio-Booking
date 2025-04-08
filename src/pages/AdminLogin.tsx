import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const { t, ready } = useTranslation();
  const { theme } = useTheme();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState('admin@makeupstudio.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If the user is already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Successful login
        navigate('/admin/dashboard');
      } else {
        // Failed login
        setError(ready ? t('auth.invalidCredentials') : 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(ready ? t('auth.loginError') : 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Define texts, even if translations are not loaded
  const texts = {
    adminLogin: ready ? t('auth.adminLogin') : 'Admin Login',
    emailAddress: ready ? t('auth.emailAddress') : 'Email address',
    password: ready ? t('auth.password') : 'Password',
    signIn: ready ? t('auth.signIn') : 'Sign In',
    demoNote: ready ? t('auth.demoNote') : 'This is a demo version. Use the credentials below to log in as an administrator.',
    demoCredentials: ready ? t('auth.demoCredentials') : 'Demo credentials:'
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-black' : 'bg-lavender-50'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full space-y-8 ${theme === 'dark' ? 'bg-gray-900 border border-lavender-700/20' : 'bg-white'} p-8 rounded-lg shadow-lg`}
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-lavender-900/50 text-lavender-400' : 'bg-lavender-100 text-lavender-600'}`}
          >
            <Lock className="h-6 w-6" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`mt-6 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {texts.adminLogin}
          </motion.h2>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`flex items-center gap-2 p-3 rounded-md ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-2 p-3 rounded-md ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}
        >
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{texts.demoNote}</p>
        </motion.div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-lavender-300' : 'text-gray-700'}`}>
                {texts.emailAddress}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-lavender-500 focus:border-lavender-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-lavender-500 focus:border-lavender-500'
                } border rounded-md shadow-sm focus:outline-none`}
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-lavender-300' : 'text-gray-700'}`}>
                {texts.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-lavender-500 focus:border-lavender-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-lavender-500 focus:border-lavender-500'
                } border rounded-md shadow-sm focus:outline-none`}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-lavender-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-lavender-600 to-mauve-600 hover:from-lavender-500 hover:to-mauve-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 relative overflow-hidden`}
          >
            {loading && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-lavender-600/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
            {texts.signIn}
          </motion.button>
          
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            <span className="block font-medium mb-1">{texts.demoCredentials}</span>
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">admin@makeupstudio.com</span>
            <span className="mx-1">/</span>
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">admin123</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

// User role type
export type UserRole = 'admin' | 'user';

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for using the context - Fixed: Changed from arrow function to named function declaration
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On initialization, check if there's a saved token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the user is already authenticated
        const result = await api.getCurrentUser();
        
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          // If token is invalid, remove it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to authenticate with saved token', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Call the API login function
      const result = await api.login(email, password);
      
      if (result.success && result.user && result.token) {
        // Save the token and user data
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setUser(result.user);
        setLoading(false);
        return true;
      }
      
      // If login failed
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed', error);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = user !== null && user.role === 'admin';

  // Value provided to the context
  const value = {
    user,
    isAuthenticated: user !== null,
    isAdmin,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
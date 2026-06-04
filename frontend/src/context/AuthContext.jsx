import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

// Setup request interceptor to attach JWT token automatically to secure endpoints
axios.interceptors.request.use(
  (config) => {
    const saved = localStorage.getItem('hc_user');
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData = response.data; // contains token, name, email, phone
      setUser(userData);
      localStorage.setItem('hc_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      const message = typeof error.response?.data === 'string' ? error.response.data : 'Failed to login. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, phone, password });
      const userData = response.data; // contains token, name, email, phone
      setUser(userData);
      localStorage.setItem('hc_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      const message = typeof error.response?.data === 'string' ? error.response.data : 'Failed to register. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hc_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

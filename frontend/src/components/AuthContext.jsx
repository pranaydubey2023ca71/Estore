// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // Set token for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Fetch user data from localStorage if available (simple way)
      // A real app would have a /me route to verify token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  // login function saves user and token
  const login = (userData) => {
    setToken(userData.token);
    setUser({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      purchasedProducts: userData.purchasedProducts,
    });
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      purchasedProducts: userData.purchasedProducts,
    }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // This function is for updating user data (like after a purchase)
  const updateUser = (updatedUserData) => {
     setUser(updatedUserData);
     localStorage.setItem('user', JSON.stringify(updatedUserData));
  }

  const value = { user, token, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
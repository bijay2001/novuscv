import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // NEW: Add a loading state to prevent UI flashing
  const [loading, setLoading] = useState(true); 

  // NEW: Run this check once when the app loads
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user); // Session is valid, restore user!
    } catch (error) {
      setUser(null); // Session is invalid or expired
    } finally {
      setLoading(false); // Done checking, render the app
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {/* Do not render the app until we know who the user is */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
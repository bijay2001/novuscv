import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // 1. If we are still checking the session, show a clean loading screen
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 2. If it finished checking and there is no user, boot them to login
  if (!user) {
    return <Navigate to="/login" replace />; 
  }
  
  // 3. Otherwise, let them in!
  return children;
};

export default ProtectedRoute;
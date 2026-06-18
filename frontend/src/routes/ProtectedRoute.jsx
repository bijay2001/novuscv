import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo.png'; // Import the PNG directly

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // A premium, branded loading screen
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#0B1017' }}>
        
        {/* Using the direct image instead of the deleted component */}
        <img 
          src={logoImage} 
          alt="NovusCV Logo" 
          width="64" 
          height="64" 
          style={{ objectFit: 'contain' }} 
        />
        
        <div className="spinner-border text-primary mt-4" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        <p className="text-secondary mt-3 font-monospace small" style={{ letterSpacing: '1px' }}>
          VERIFYING SECURE CONNECTION...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
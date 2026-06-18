import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo'; // Make sure the path is correct!

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // A premium, branded loading screen (No "free tier" warnings!)
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#0B1017' }}>
        <Logo width={64} height={64} showText={false} />
        <div className="spinner-border text-success mt-4" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        <p className="text-secondary mt-3 font-monospace small">VERIFYING SECURE CONNECTION...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
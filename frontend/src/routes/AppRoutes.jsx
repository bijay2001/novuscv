import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import UploadResume from '../pages/UploadResume'; 
import Report from '../pages/Report';
import ProtectedRoute from './ProtectedRoute';

import Contact from '../pages/Contact'; // Import it at the top

// Import your global layout components
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRoutes = () => {
  return (
    /* Flexbox wrapper to keep the footer perfectly at the bottom */
    <div className="d-flex flex-column min-vh-100">
      
      {/* Global Header appears at the top of every page */}
      <Header />
      
      {/* Main content expands to fill the remaining space */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Upload Route */}
          <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
          
          {/* Report Route (dynamic ID) */}
          <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Global Footer appears at the bottom of every page */}
      <Footer />
      
    </div>
  );
};

export default AppRoutes;
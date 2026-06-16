import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import UploadResume from '../pages/UploadResume'; 
import Report from '../pages/Report';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* 2. Add the Upload Route */}
      <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
      
      {/* 3. Add the Report Route (dynamic ID) */}
      <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
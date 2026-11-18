import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import UploadResume from '../pages/UploadResume';
import Report from '../pages/Report';
import Contact from '../pages/Contact';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
        <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;
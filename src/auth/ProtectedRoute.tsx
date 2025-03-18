import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />; 
  }

  return <Outlet />; 
};

export default ProtectedRoute;
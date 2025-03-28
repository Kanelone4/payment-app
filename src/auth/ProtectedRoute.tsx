import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store'; 

const ProtectedRoute: React.FC = () => {

  const accessToken = useSelector((state: RootState) => state.auth.token);

  if (!accessToken) {
    return <Navigate to="auth/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
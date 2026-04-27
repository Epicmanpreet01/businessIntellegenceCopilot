import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserQuery from '../../hooks/queries/useUserQuery';
import LoadingSpinner from '../layout/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useUserQuery();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

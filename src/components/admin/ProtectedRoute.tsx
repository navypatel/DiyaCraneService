import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingState from '../common/LoadingState';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({ isAuthenticated, isCheckingAuth, children }: ProtectedRouteProps) {
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-brand-gray/50 flex flex-col items-center justify-center">
        <LoadingState message="Checking security credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

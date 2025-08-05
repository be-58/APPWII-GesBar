// src/router/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role.nombre ?? '')) {
    // Si el rol del usuario no está permitido, redirigir a una página de "no autorizado" o al inicio
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y tiene el rol correcto, renderiza el componente hijo
  return <Outlet />;
};

export default ProtectedRoute;

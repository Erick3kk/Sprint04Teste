// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!apiService.isLoggedIn()) {
    return <Navigate to="/acesso-paciente" replace />;
  }
  return <>{children}</>;
}
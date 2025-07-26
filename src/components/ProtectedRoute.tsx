// components/ProtectedRoute.tsx
// Componente para proteger rutas que requieren autenticación

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'buyer' | 'supplier' | 'both';
  requireVerified?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireVerified = true,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  // Mostrar loading mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zlc-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verificando sesión...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Verificar si el usuario está verificado (si es requerido)
  if (requireVerified && user.verificationStatus !== 'verified') {
    return (
      <div className="min-h-screen bg-zlc-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-zlc-gray-900">
                Cuenta no verificada
              </h2>
              <p className="text-zlc-gray-600">
                Su cuenta empresarial está en proceso de verificación. 
                Este proceso puede tomar de 1-3 días hábiles.
              </p>
              <p className="text-sm text-zlc-gray-500">
                Estado actual: {user.verificationStatus === 'pending' ? 'Pendiente' : 'Rechazada'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar rol si es requerido
  if (requiredRole) {
    const hasRequiredRole = 
      requiredRole === 'buyer' && (user.userType === 'buyer' || user.userType === 'both') ||
      requiredRole === 'supplier' && (user.userType === 'supplier' || user.userType === 'both') ||
      requiredRole === 'both' && user.userType === 'both';

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-zlc-gray-50 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-zlc-gray-900">
                  Acceso denegado
                </h2>
                <p className="text-zlc-gray-600">
                  No tiene permisos para acceder a esta sección.
                </p>
                <p className="text-sm text-zlc-gray-500">
                  Su rol actual: {user.userType}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Todo correcto, mostrar el contenido
  return <>{children}</>;
};

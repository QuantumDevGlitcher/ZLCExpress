// contexts/AuthContext.tsx
// Contexto de autenticación para la aplicación

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User, LoginCredentials } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{
    success: boolean;
    message: string;
    user?: User;
  }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  validateCurrentSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// Hook para obtener solo el usuario actual
export const useCurrentUser = (): User | null => {
  const { user } = useAuthContext();
  return user;
};

// Hook para verificar roles
export const useUserRole = () => {
  const { user } = useAuthContext();
  
  return {
    isBuyer: user?.userType === 'buyer' || user?.userType === 'both',
    isSupplier: user?.userType === 'supplier' || user?.userType === 'both',
    isAdmin: user?.userType === 'both',
    userType: user?.userType || null,
  };
};

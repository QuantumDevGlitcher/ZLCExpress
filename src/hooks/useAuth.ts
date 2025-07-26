// hooks/useAuth.ts
// Hook personalizado para manejar la autenticación

import { useState, useEffect } from 'react';
import { 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  validateSession, 
  getStoredUser, 
  isAuthenticated as checkAuth,
  type User,
  type LoginCredentials 
} from '@/services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{
    success: boolean;
    message: string;
    user?: User;
  }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  validateCurrentSession: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Inicializar el estado de autenticación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar si hay datos en localStorage
        const storedUser = getStoredUser();
        const hasAuth = checkAuth();
        
        if (storedUser && hasAuth) {
          // Validar la sesión con el backend
          const sessionValid = await validateSession();
          
          if (sessionValid.success && sessionValid.valid) {
            setState({
              user: storedUser,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            // Sesión inválida, limpiar datos
            await logoutUser();
            setState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await loginUser(credentials);
      
      if (response.success && response.user && response.token) {
        setState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return {
          success: true,
          message: response.message,
          user: response.user,
        };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: response.message,
          user: response.user,
        };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const refreshProfile = async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const response = await getUserProfile();
      
      if (response.success && response.user) {
        setState(prev => ({
          ...prev,
          user: response.user!,
        }));
      }
    } catch (error) {
      console.error('Error al refrescar perfil:', error);
    }
  };

  const validateCurrentSession = async (): Promise<boolean> => {
    try {
      const response = await validateSession();
      
      if (!response.success || !response.valid) {
        await logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al validar sesión:', error);
      await logout();
      return false;
    }
  };

  return {
    ...state,
    login,
    logout,
    refreshProfile,
    validateCurrentSession,
  };
};

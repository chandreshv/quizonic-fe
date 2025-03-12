import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState } from '../types/auth';
import { authService } from '../api/authService';

interface AuthContextType extends AuthState {
  login: typeof authService.login;
  register: typeof authService.register;
  logout: () => void;
  updateProfile: typeof authService.updateProfile;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: authService.isAuthenticated(),
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      if (state.isAuthenticated) {
        try {
          const user = await authService.getCurrentUser();
          setState(prev => ({ ...prev, user, loading: false }));
        } catch (error) {
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Session expired',
          }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, [state.isAuthenticated]);

  const login = async (...args: Parameters<typeof authService.login>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await authService.login(...args);
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: result.user,
        loading: false,
      }));
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Invalid credentials',
        loading: false,
      }));
      throw error;
    }
  };

  const register = async (...args: Parameters<typeof authService.register>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await authService.register(...args);
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: result.user,
        loading: false,
      }));
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Registration failed',
        loading: false,
      }));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const updateProfile = async (...args: Parameters<typeof authService.updateProfile>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await authService.updateProfile(...args);
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }));
      return user;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Profile update failed',
        loading: false,
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

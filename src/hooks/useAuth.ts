/**
 * useAuth hook
 *
 * Provides a clean interface to authentication state and actions.
 * Consumers should use this hook rather than accessing the store directly.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, AuthError } from '@/types/auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, token, status, error, setLoading, setAuthenticated, setError, clearError, logout: storeLogout } =
    useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading();
      try {
        const response = await authService.login(credentials);
        setAuthenticated(response.user, response.token);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err as AuthError);
      }
    },
    [setLoading, setAuthenticated, setError, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      navigate('/login', { replace: true });
    }
  }, [storeLogout, navigate]);

  return {
    user,
    token,
    status,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
    clearError,
  };
}

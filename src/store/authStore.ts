/**
 * Auth Store — Zustand
 *
 * Manages global authentication state.
 * Uses sessionStorage for security-conscious persistence:
 * - sessionStorage: clears on tab close (safer for shared workstations)
 * - localStorage: used only when "Remember Me" is active
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthError, User } from '@/types/auth.types';

interface AuthStore extends AuthState {
  // Actions
  setLoading: () => void;
  setAuthenticated: (user: User, token: string) => void;
  setError: (error: AuthError) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      status: 'unauthenticated',
      error: null,

      // Transition to loading
      setLoading: () =>
        set({ status: 'loading', error: null }),

      // Successful authentication
      setAuthenticated: (user, token) =>
        set({ user, token, status: 'authenticated', error: null }),

      // Authentication error
      setError: (error) =>
        set({ status: 'error', error, user: null, token: null }),

      // Clear transient error (e.g. on input change)
      clearError: () =>
        set({ error: null, status: 'unauthenticated' }),

      // Log out
      logout: () =>
        set({ user: null, token: null, status: 'unauthenticated', error: null }),
    }),
    {
      name: 'sih130-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the user session — not transient state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        status: state.status === 'authenticated' ? 'authenticated' : 'unauthenticated',
      }),
    }
  )
);

import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      set({ user: data.user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  logout: async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    set({ user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return;
        }
      }
    } catch {}
    set({ isLoading: false });
  },
}));

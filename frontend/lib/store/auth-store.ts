import { create } from 'zustand';
import { api } from '../api-client';

export type UserRole = 'USER' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  platformRole: UserRole;
  emailVerified: boolean;
  status: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  login: (user: User) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const res = await api.auth.me();
      if (res.success && res.data) {
        set({ user: res.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  }
}));

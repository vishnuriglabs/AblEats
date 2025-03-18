import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      signup: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage
    }
  )
);
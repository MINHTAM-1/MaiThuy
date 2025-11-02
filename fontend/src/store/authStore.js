import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      // Login function
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      // Logout function
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      // Update user profile
      updateProfile: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
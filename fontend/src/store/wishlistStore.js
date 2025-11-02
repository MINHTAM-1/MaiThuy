import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        if (existingItem) {
          return state; // Already in wishlist
        }
        return { items: [...state.items, { ...product, addedAt: new Date().toISOString() }] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.length;
      },

      // Move item to cart and remove from wishlist
      moveToCart: (productId, cartStore) => {
        const { items, removeItem } = get();
        const product = items.find(item => item.id === productId);
        if (product) {
          cartStore.addItem(product);
          removeItem(productId);
        }
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  
  // Add item to cart
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        items: [...items, { ...product, quantity: 1 }]
      });
    }
  },
  
  // Remove item from cart
  removeItem: (productId) => {
    const { items } = get();
    set({
      items: items.filter(item => item.id !== productId)
    });
  },
  
  // Update item quantity
  updateQuantity: (productId, quantity) => {
    const { items } = get();
    
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set({
      items: items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    });
  },
  
  // Clear cart
  clearCart: () => {
    set({ items: [] });
  },
  
  // Get total price
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // Get total items count
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
  
  // Check if item is in cart
  isInCart: (productId) => {
    const { items } = get();
    return items.some(item => item.id === productId);
  }
}));

export default useCartStore;
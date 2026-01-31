import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((i) => i.id !== id)
  })),
  updateQuantity: (id, delta) => set((state) => ({
    cart: state.cart.map((i) => 
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    )
  })),
  clearCart: () => set({ cart: [] }),
}));
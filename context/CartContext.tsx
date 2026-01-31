"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (meal: Meal) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // جلب البيانات من ذاكرة المتصفح عند البداية [cite: 2026-01-25]
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("albaraka_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  // حفظ البيانات عند كل تغيير [cite: 2026-01-25]
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("albaraka_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (meal: Meal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
    toast.success(`تمت إضافة ${meal.name} للسلة`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error("تمت الإزالة من السلة");
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
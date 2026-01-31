// src/types/index.ts

// The shape of a single meal from the External API (The MealDB)
export interface MealDBResponse {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  [key: string]: string | null; // For other dynamic fields like ingredients
}

// The clean shape we use in our Frontend
export interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};
export type CartItem = Meal & { quantity: number };
export interface CartContextType {
  cart: CartItem[];
  addToCart: (meal: Meal) => void; // هنا استخدمنا Meal بدلاً من any
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  totalPrice: number;
  cartCount: number;
}




// src/types/index.ts
export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  created_at?: string;
}

export interface CartItem extends Meal {
  quantity: number;
}
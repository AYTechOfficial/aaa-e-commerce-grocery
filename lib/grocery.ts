export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  description: string;
};

export type Store = {
  id: string;
  name: string;
  description: string;
  image: string;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  deliveryLabel: string;
  pickupLabel: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartState = {
  storeId: string;
  items: CartItem[];
};

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type GroceryOrder = {
  id: string;
  storeId: string;
  storeName: string;
  status: string;
  fulfillment: "Delivery" | "Pickup";
  createdAt: string;
  items: OrderLine[];
  substitutionDecision: "pending" | "approved" | "declined";
};

export const GROCERY_CART_KEY = "local-grocery:cart";
export const GROCERY_ORDERS_KEY = "local-grocery:orders";

export const stores: Store[] = [
  {
    id: "northside-market",
    name: "Northside Market",
    description: "Everyday produce, pantry favorites, and neighborhood-made goods.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=80",
    deliveryAvailable: true,
    pickupAvailable: true,
    deliveryLabel: "Delivery · simulated",
    pickupLabel: "Pickup · simulated",
  },
];

export const products: Product[] = [
  {
    id: "strawberries",
    name: "Fresh strawberries",
    category: "Produce",
    price: 4.99,
    image: "https://images.unsplash.com/photo- strawberries?auto=format&fit=crop&w=700&q=80".replace("photo- strawberries", "photo-1464965911861-746a04b4bca6"),
    available: true,
    description: "Sweet, bright berries · 1 pint",
  },
  {
    id: "avocados",
    name: "Ripe avocados",
    category: "Produce",
    price: 1.79,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
    available: true,
    description: "Ready to enjoy · each",
  },
  {
    id: "sourdough",
    name: "Country sourdough",
    category: "Bakery",
    price: 6.5,
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=700&q=80",
    available: true,
    description: "Small-batch loaf · baked today",
  },
  {
    id: "oat-milk",
    name: "Creamy oat milk",
    category: "Dairy & alternatives",
    price: 4.25,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80",
    available: true,
    description: "Unsweetened ·  आध gallon".replace("आध", "½"),
  },
  {
    id: "eggs",
    name: "Free-range eggs",
    category: "Dairy & alternatives",
    price: 5.75,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80",
    available: false,
    description: "A dozen · temporarily unavailable",
  },
  {
    id: "carrots",
    name: "Rainbow carrots",
    category: "Produce",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=80",
    available: true,
    description: "Colorful bunch · locally grown",
  },
];

export function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

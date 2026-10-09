import { readLocal, writeLocal } from "@/lib/persist";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
};

export type CartItem = { productId: string; quantity: number };
export type Fulfillment = "Delivery" | "Pickup";
export type OrderItem = { productId: string; name: string; price: number; quantity: number };
export type DemoOrder = {
  id: string;
  date: string;
  status: string;
  fulfillment: Fulfillment;
  address: string;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  total: number;
  substitution: string;
};

export const products: Product[] = [
  { id: "apples", slug: "honeycrisp-apples", name: "Honeycrisp Apples", price: 2.99, unit: "per lb", category: "Produce", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85", description: "Crisp, sweet apples with a refreshing bite. A neighborhood favorite for snacking and baking.", tags: ["Vegan", "Gluten-free"] },
  { id: "avocados", slug: "ripe-avocados", name: "Ripe Avocados", price: 1.49, unit: "each", category: "Produce", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85", description: "Creamy, ready-to-enjoy avocados selected for everyday meals.", tags: ["Vegan"] },
  { id: "tomatoes", slug: "heirloom-tomatoes", name: "Heirloom Tomatoes", price: 3.79, unit: "per lb", category: "Produce", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85", description: "Colorful, juicy tomatoes with a bright, garden-fresh flavor.", tags: ["Vegan", "Local favorite"] },
  { id: "greens", slug: "baby-spinach", name: "Baby Spinach", price: 3.49, unit: "5 oz bag", category: "Produce", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85", description: "Tender baby spinach, washed and ready for salads or a quick sauté.", tags: ["Vegan"] },
  { id: "carrots", slug: "rainbow-carrots", name: "Rainbow Carrots", price: 2.69, unit: "1 bunch", category: "Produce", image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85", description: "A bright bunch of sweet, crunchy carrots in assorted colors.", tags: ["Vegan"] },
  { id: "berries", slug: "blueberries", name: "Blueberries", price: 4.29, unit: "1 pint", category: "Produce", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=900&q=85", description: "Plump, sweet blueberries for breakfast, baking, or a snack.", tags: ["Vegan"] },
  { id: "chicken", slug: "chicken-breast", name: "Boneless Chicken Breast", price: 8.99, unit: "per lb", category: "Meat & Seafood", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85", description: "Lean, versatile chicken breast. Product and availability are simulated.", tags: ["Raised with care"] },
  { id: "salmon", slug: "atlantic-salmon", name: "Atlantic Salmon", price: 12.99, unit: "per lb", category: "Meat & Seafood", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85", description: "Rich, flaky salmon portions, perfect for a simple weeknight dinner.", tags: ["Seafood"] },
  { id: "eggs", slug: "free-range-eggs", name: "Free-Range Large Eggs", price: 5.49, unit: "dozen", category: "Dairy", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85", description: "A dozen large eggs for breakfast, baking, and everything in between.", tags: ["Vegetarian"] },
  { id: "milk", slug: "whole-milk", name: "Whole Milk", price: 4.19, unit: "half gallon", category: "Dairy", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85", description: "A creamy everyday staple. Product details and pricing are sample data.", tags: ["Dairy"] },
  { id: "cheese", slug: "sharp-cheddar", name: "Sharp Cheddar", price: 5.99, unit: "8 oz", category: "Dairy", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85", description: "A flavorful sharp cheddar for sandwiches, snacks, and cheese boards.", tags: ["Vegetarian"] },
  { id: "sourdough", slug: "sourdough-loaf", name: "Country Sourdough", price: 6.49, unit: "1 loaf", category: "Bakery", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=900&q=85", description: "A crusty country-style loaf with a soft, tangy center.", tags: ["Bakery"] },
  { id: "croissants", slug: "butter-croissants", name: "Butter Croissants", price: 5.99, unit: "4 pack", category: "Bakery", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85", description: "Flaky, buttery croissants for a relaxed breakfast.", tags: ["Vegetarian"] },
  { id: "pasta", slug: "rigatoni-pasta", name: "Rigatoni Pasta", price: 2.79, unit: "1 lb", category: "Pantry", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85", description: "Ridged pasta that holds your favorite sauce beautifully.", tags: ["Pantry staple"] },
  { id: "olive-oil", slug: "extra-virgin-olive-oil", name: "Extra Virgin Olive Oil", price: 11.99, unit: "16.9 fl oz", category: "Pantry", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85", description: "A versatile olive oil for dressings, roasting, and finishing.", tags: ["Vegan"] },
  { id: "beans", slug: "chickpeas", name: "Chickpeas", price: 1.69, unit: "15 oz can", category: "Pantry", image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=85", description: "A pantry-friendly staple for salads, soups, and hummus.", tags: ["Vegan", "Gluten-free"] },
  { id: "icecream", slug: "vanilla-ice-cream", name: "Vanilla Ice Cream", price: 6.99, unit: "pint", category: "Frozen", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85", description: "Smooth vanilla ice cream for a little something sweet.", tags: ["Frozen"] },
  { id: "peas", slug: "sweet-frozen-peas", name: "Sweet Frozen Peas", price: 2.49, unit: "12 oz bag", category: "Frozen", image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=900&q=85", description: "Sweet peas, frozen at their best for easy dinners.", tags: ["Vegan"] },
  { id: "coffee", slug: "house-blend-coffee", name: "House Blend Coffee", price: 10.49, unit: "12 oz bag", category: "Beverages", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85", description: "A balanced, easy-drinking coffee for the morning ritual.", tags: ["Ground coffee"] },
  { id: "juice", slug: "orange-juice", name: "Fresh Orange Juice", price: 5.29, unit: "half gallon", category: "Beverages", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85", description: "Bright citrus flavor for breakfast or an afternoon refresh.", tags: ["Chilled"] },
  { id: "soap", slug: "dish-soap", name: "Plant-Based Dish Soap", price: 4.99, unit: "16 fl oz", category: "Household Essentials", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=85", description: "A gentle, everyday dish soap. Sample household listing.", tags: ["Household"] },
  { id: "towels", slug: "paper-towels", name: "Paper Towels", price: 7.49, unit: "2 rolls", category: "Household Essentials", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85", description: "A handy household essential for everyday cleanups.", tags: ["Household"] },
];

export const stores = [
  { id: "northside-market", name: "Northside Market", neighborhood: "Northside", note: "Your friendly neighborhood market" },
  { id: "garden-district-grocer", name: "Garden District Grocer", neighborhood: "Garden District", note: "Fresh picks for the neighborhood" },
  { id: "riverside-foods", name: "Riverside Foods", neighborhood: "Riverside", note: "Good things for your table" },
];

export const seededOrders: DemoOrder[] = [
  {
    id: "demo-order-1042",
    date: "2025-02-18T17:30:00.000Z",
    status: "Ready for review",
    fulfillment: "Pickup",
    address: "Northside Market · Pickup counter",
    items: [
      { productId: "apples", name: "Honeycrisp Apples", price: 2.99, quantity: 2 },
      { productId: "sourdough", name: "Country Sourdough", price: 6.49, quantity: 1 },
      { productId: "eggs", name: "Free-Range Large Eggs", price: 5.49, quantity: 1 },
    ],
    subtotal: 17.96,
    fee: 0,
    total: 17.96,
    substitution: "No substitutions proposed for this demo order.",
  },
];

export const CART_KEY = "aaa-grocery-cart";
export const ORDERS_KEY = "aaa-grocery-orders";

export function loadCart(): CartItem[] {
  return readLocal<CartItem[]>(CART_KEY, []);
}

export function saveCart(cart: CartItem[]) {
  writeLocal(CART_KEY, cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-updated"));
}

export function loadOrders(): DemoOrder[] {
  return readLocal<DemoOrder[]>(ORDERS_KEY, seededOrders);
}

export function saveOrders(orders: DemoOrder[]) {
  writeLocal(ORDERS_KEY, orders);
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function productById(id: string) {
  return products.find((product) => product.id === id);
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

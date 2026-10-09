import { readLocal, writeLocal } from "@/lib/persist";

export const CART_KEY = "aaa-grocery:cart";
export const ORDERS_KEY = "aaa-grocery:orders";
export const FULFILLMENT_KEY = "aaa-grocery:fulfillment";

export const categories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"] as const;
export type Category = (typeof categories)[number];
export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  description: string;
  image: string;
  tags: string[];
};
export type CartItem = { slug: string; quantity: number };
export type Fulfillment = "delivery" | "pickup";
export type SavedOrder = {
  id: string;
  createdAt: string;
  fulfillment: Fulfillment;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  fee: number;
  total: number;
};

const photos: Record<Category, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=85",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  Pantry: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85",
  Frozen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  "Household Essentials": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=85",
};

const entries: [Category, string, number, string, string[]][] = [
  ["Produce", "Honeycrisp Apples", 1.29, "each", ["Vegan"]], ["Produce", "Avocados", 1.49, "each", ["Vegan"]],
  ["Produce", "Baby Spinach", 3.49, "5 oz bag", ["Vegan"]], ["Produce", "Organic Bananas", 0.79, "per lb", ["Organic"]],
  ["Produce", "English Cucumber", 1.79, "each", ["Vegan"]], ["Produce", "Heirloom Tomatoes", 4.99, "1 lb", ["Vegan"]],
  ["Produce", "Rainbow Carrots", 2.99, "1 bunch", ["Vegan"]], ["Produce", "Sweet Bell Peppers", 3.49, "3 count", ["Vegan"]],
  ["Meat & Seafood", "Atlantic Salmon Fillet", 10.99, "per lb", ["Fresh"]], ["Meat & Seafood", "Chicken Breast", 7.49, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Ground Beef 85% Lean", 6.99, "1 lb", ["Fresh"]], ["Meat & Seafood", "Pork Tenderloin", 8.99, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Large Raw Shrimp", 9.99, "12 oz", ["Frozen"]], ["Meat & Seafood", "Ground Turkey", 5.99, "1 lb", ["Fresh"]],
  ["Meat & Seafood", "Chicken Thighs", 5.49, "per lb", ["Fresh"]], ["Meat & Seafood", "Wild Cod Fillets", 11.49, "12 oz", ["Fresh"]],
  ["Dairy", "Whole Milk", 4.29, " half gallon", ["Refrigerated"]], ["Dairy", "Large Brown Eggs", 5.49, "12 count", ["Vegetarian"]],
  ["Dairy", "Greek Yogurt", 5.99, "32 oz", ["High protein"]], ["Dairy", "Sharp Cheddar", 4.99, "8 oz", ["Vegetarian"]],
  ["Dairy", "Salted Butter", 4.79, "16 oz", ["Vegetarian"]], ["Dairy", "Oat Milk", 4.49, "half gallon", ["Dairy-free"]],
  ["Dairy", "Cottage Cheese", 3.99, "16 oz", ["High protein"]], ["Dairy", "Mozzarella Cheese", 4.29, "8 oz", ["Vegetarian"]],
  ["Bakery", "Country Sourdough", 6.49, "loaf", ["Fresh baked"]], ["Bakery", "Butter Croissants", 5.99, "4 count", ["Fresh baked"]],
  ["Bakery", "Whole Wheat Sandwich Bread", 4.29, "loaf", ["Whole grain"]], ["Bakery", "Blueberry Muffins", 5.49, "4 count", ["Fresh baked"]],
  ["Bakery", "Everything Bagels", 4.99, "6 count", ["Fresh baked"]], ["Bakery", "Flour Tortillas", 3.49, "10 count", ["Bakery"]],
  ["Bakery", "Chocolate Chip Cookies", 5.99, "12 count", ["Bakery"]], ["Bakery", "Brioche Burger Buns", 4.49, "4 count", ["Bakery"]],
  ["Pantry", "Extra Virgin Olive Oil", 12.99, "500 ml", ["Mediterranean"]], ["Pantry", "San Marzano Tomatoes", 3.49, "28 oz", ["Vegan"]],
  ["Pantry", "Jasmine Rice", 7.99, "2 lb", ["Vegan"]], ["Pantry", "Penne Pasta", 2.49, "1 lb", ["Vegan"]],
  ["Pantry", "Creamy Peanut Butter", 4.99, "16 oz", ["Vegan"]], ["Pantry", "Maple Syrup", 9.99, "12 oz", ["Vegan"]],
  ["Pantry", "Black Beans", 1.79, "15 oz", ["Vegan"]], ["Pantry", "Rolled Oats", 5.49, "18 oz", ["Whole grain"]],
  ["Frozen", "Wild Blueberries", 6.49, "16 oz", ["Vegan"]], ["Frozen", "Peas & Carrots", 2.99, "12 oz", ["Vegan"]],
  ["Frozen", "Margherita Pizza", 8.99, "each", ["Vegetarian"]], ["Frozen", "Vanilla Bean Ice Cream", 6.99, "pint", ["Gluten-free"]],
  ["Frozen", "Edamame", 3.99, "12 oz", ["Vegan"]], ["Frozen", "Waffle Fries", 4.49, "20 oz", ["Vegan"]],
  ["Frozen", "Wild-Caught Fish Sticks", 7.49, "18 oz", ["Family favorite"]], ["Frozen", "Mango Chunks", 5.99, "16 oz", ["Vegan"]],
  ["Beverages", "Sparkling Water", 5.99, "8 pack", ["Zero sugar"]], ["Beverages", "Cold Brew Coffee", 5.49, "32 oz", ["Caffeinated"]],
  ["Beverages", "Fresh Orange Juice", 6.99, "half gallon", ["No added sugar"]], ["Beverages", "Green Tea", 4.49, "20 bags", ["Caffeinated"]],
  ["Beverages", "Coconut Water", 3.49, "1 liter", ["Hydrating"]], ["Beverages", "Lemonade", 4.29, "64 oz", ["Chilled"]],
  ["Beverages", "Ground Coffee", 10.99, "12 oz", ["Fair trade"]], ["Beverages", "Ginger Kombucha", 3.99, "16 oz", ["Probiotic"]],
  ["Household Essentials", "Dish Soap", 4.49, "18 oz", ["Plant based"]], ["Household Essentials", "Paper Towels", 8.99, "6 rolls", ["Everyday essential"]],
  ["Household Essentials", "Laundry Detergent", 12.99, "50 oz", ["Concentrated"]], ["Household Essentials", "Kitchen Trash Bags", 7.49, "30 count", ["Strong & reliable"]],
  ["Household Essentials", "All-Purpose Cleaner", 5.99, "24 oz", ["Plant based"]], ["Household Essentials", "Recycled Napkins", 3.49, "100 count", ["Recycled"]],
  ["Household Essentials", "Hand Soap", 3.99, "12 oz", ["Gentle"]], ["Household Essentials", "Sponges", 4.49, "3 count", ["Reusable"]],
];

export const products: Product[] = entries.map(([category, name, price, unit, tags]) => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  name,
  category,
  price,
  unit: unit.trim(),
  description: `${name}, selected for an easy everyday shop. Product availability, description, and price are illustrative sample information and may not reflect any real retailer.`,
  image: photos[category],
  tags,
}));

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function readCart(): CartItem[] {
  return readLocal<CartItem[]>(CART_KEY, []);
}

export function saveCart(cart: CartItem[]) {
  writeLocal(CART_KEY, cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-change"));
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + (getProduct(item.slug)?.price ?? 0) * item.quantity, 0);
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function addProduct(cart: CartItem[], slug: string): CartItem[] {
  const found = cart.find((item) => item.slug === slug);
  return found
    ? cart.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { slug, quantity: 1 }];
}

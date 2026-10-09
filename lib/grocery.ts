import { readLocal, writeLocal } from "@/lib/persist";

export type GroceryCategory = "Produce" | "Meat & Seafood" | "Dairy" | "Bakery" | "Pantry" | "Frozen" | "Beverages" | "Household Essentials";

export type Product = {
  slug: string;
  name: string;
  category: GroceryCategory;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
};

export type CartLine = { productId: string; quantity: number };
export type DemoOrder = {
  id: string;
  items: CartLine[];
  fulfillment: "delivery" | "pickup";
  subtotal: number;
  fee: number;
  total: number;
  placedAt: string;
};

export const CART_STORAGE_KEY = "aaa-grocery-cart";
export const ORDERS_STORAGE_KEY = "aaa-grocery-orders";

const photos: Record<GroceryCategory, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  Dairy: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  Pantry: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=900&q=85",
  Frozen: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=85",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  "Household Essentials": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
};

const productGroups: { category: GroceryCategory; names: string[]; prices: number[]; unit: string }[] = [
  { category: "Produce", names: ["Honeycrisp Apples", "Organic Baby Spinach", "Ripe Avocados", "Rainbow Carrots", "English Cucumber", "Sweet Strawberries", "Heirloom Tomatoes", "Fresh Lemons"], prices: [1.29, 4.49, 1.49, 2.99, 1.79, 4.99, 3.99, 0.79], unit: "each / pack" },
  { category: "Meat & Seafood", names: ["Air-Chilled Chicken Breast", "Atlantic Salmon Fillet", "Grass-Fed Ground Beef", "Italian Chicken Sausage", "Wild-Caught Shrimp", "Boneless Pork Chops", "Free-Range Chicken Thighs", "Mild Italian Sausage"], prices: [8.99, 12.99, 7.49, 6.99, 10.99, 8.49, 7.99, 6.49], unit: "per pack" },
  { category: "Dairy", names: ["Whole Milk", "Creamy Greek Yogurt", "Salted Sweet Cream Butter", "Sharp Cheddar Cheese", "Large Free-Range Eggs", "Oat Milk", "Fresh Mozzarella", "Vanilla Skyr"], prices: [4.29, 5.49, 4.99, 5.99, 5.49, 4.79, 5.49, 1.99], unit: "per item" },
  { category: "Bakery", names: ["Country Sourdough Loaf", "Butter Croissants", "Blueberry Muffins", "Whole Wheat Sandwich Bread", "Everything Bagels", "Cinnamon Coffee Cake", "Rustic Baguette", "Chocolate Chip Cookies"], prices: [6.49, 5.99, 5.49, 4.29, 4.99, 7.49, 3.49, 5.99], unit: "per item" },
  { category: "Pantry", names: ["Extra Virgin Olive Oil", "Organic Rolled Oats", "San Marzano Tomatoes", "Creamy Almond Butter", "Jasmine Rice", "Red Lentils", "Organic Black Beans", "Sea Salt Crackers"], prices: [12.99, 5.49, 3.49, 8.99, 6.49, 4.29, 2.49, 4.49], unit: "per item" },
  { category: "Frozen", names: ["Wild Blueberries", "Sweet Peas", "Margherita Pizza", "Mango Chunks", "Vegetable Dumplings", "Vanilla Bean Ice Cream", "Riced Cauliflower", "Spinach & Feta Flatbread"], prices: [6.99, 2.99, 8.99, 5.99, 7.49, 6.49, 3.49, 7.99], unit: "per item" },
  { category: "Beverages", names: ["Sparkling Mineral Water", "Cold Brew Coffee", "Freshly Pressed Orange Juice", "Green Tea", "Ginger Lemon Kombucha", "Apple Cider", "Oat Barista Blend", "Classic Lemonade"], prices: [5.49, 5.99, 6.49, 4.99, 3.49, 5.49, 4.79, 3.99], unit: "per item" },
  { category: "Household Essentials", names: ["Recycled Paper Towels", "Unscented Dish Soap", "Compostable Kitchen Bags", "All-Purpose Cleaner", "Laundry Detergent", "Bamboo Tissues", "Natural Sponges", "Hand Soap Refill"], prices: [8.99, 4.49, 7.99, 5.99, 12.49, 3.99, 3.49, 5.49], unit: "per item" },
];

const descriptions: Record<GroceryCategory, string> = {
  Produce: "Fresh-picked flavor for everyday meals, sourced with care and ready for your kitchen.",
  "Meat & Seafood": "A thoughtfully selected favorite, packed fresh and ready to make a delicious meal.",
  Dairy: "A fridge staple chosen for its comforting flavor and everyday quality.",
  Bakery: "A neighborhood bakery favorite, made for sharing at the table.",
  Pantry: "A dependable cupboard staple to keep your favorite recipes within reach.",
  Frozen: "Conveniently frozen to make an easy, satisfying meal or snack whenever you need it.",
  Beverages: "A refreshing everyday pick for your fridge, pantry, or next gathering.",
  "Household Essentials": "A practical home essential to help keep your everyday routine running smoothly.",
};

export const products: Product[] = productGroups.flatMap((group) =>
  group.names.map((name, index) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    category: group.category,
    price: group.prices[index],
    unit: group.unit,
    image: photos[group.category],
    description: descriptions[group.category],
    tags: name.toLowerCase().includes("organic") ? ["Organic"] : [],
  })),
);

export const categories: GroceryCategory[] = productGroups.map((group) => group.category);

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function readCart(): CartLine[] {
  const saved = readLocal<CartLine[]>(CART_STORAGE_KEY, []);
  return Array.isArray(saved)
    ? saved.filter((line) => typeof line.productId === "string" && Number.isFinite(line.quantity) && line.quantity > 0)
    : [];
}

export function saveCart(cart: CartLine[]): void {
  writeLocal(CART_STORAGE_KEY, cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-update"));
}

export function cartUnitCount(cart: CartLine[]): number {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

export function money(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

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
  { category: "Household Essentials", names: ["Recycled Paper Towels", "Unscented Dish Soap", "Compostable Kitchen Bags", "All-Purpose Cleaner", "Laundry Detergent", "Bamboo Tissues", "Natural Sponges", "Hand Soap Refill"], prices: [8.99, 4.49, 7.99, 5.99, 12.99, 3.99, 4.99, 6.49], unit: "per item" },
];

export const categories: GroceryCategory[] = productGroups.map((group) => group.category);

export const products: Product[] = productGroups.flatMap((group) =>
  group.names.map((name, index) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name,
    category: group.category,
    price: group.prices[index],
    unit: group.unit,
    image: photos[group.category],
    description: `${name}, thoughtfully selected for everyday meals and a well-stocked home. This sample listing is part of the AAA Grocery demo catalog; availability and pricing are simulated.`,
    tags: group.category === "Produce" ? ["Fresh", "Seasonal selection"] : group.category === "Meat & Seafood" ? ["Chilled", "Responsibly selected"] : [],
  })),
);

export function findProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCart(): CartLine[] {
  return readLocal<CartLine[]>("aaa-grocery-cart", []);
}

export function saveCart(cart: CartLine[]): void {
  writeLocal("aaa-grocery-cart", cart.filter((line) => line.quantity > 0));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(productId: string): void {
  const cart = getCart();
  const existing = cart.find((line) => line.productId === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  saveCart(cart);
}

export function getOrders(): DemoOrder[] {
  return readLocal<DemoOrder[]>("aaa-grocery-orders", []);
}

export function saveOrders(orders: DemoOrder[]): void {
  writeLocal("aaa-grocery-orders", orders);
}

import { readLocal, writeLocal } from "@/lib/persist";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  tags: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  status: string;
  fulfillment: "Delivery" | "Pickup";
  address: string;
  items: OrderItem[];
  subtotal: number;
  fees: number;
  total: number;
  substitution: string;
};

const categoryImages: Record<string, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80",
  Dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  Pantry: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=900&q=80",
  Frozen: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=900&q=80",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
  "Household Essentials": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
};

const catalog: Array<[string, string, number, string]> = [
  ["Produce", "Organic Bananas", 1.49, "per bunch"], ["Produce", "Honeycrisp Apples", 2.99, "per lb"], ["Produce", "Avocados", 1.79, "each"], ["Produce", "Baby Spinach", 3.49, "5 oz"], ["Produce", "English Cucumber", 1.29, "each"], ["Produce", "Rainbow Carrots", 2.49, "1 lb bag"], ["Produce", "Strawberries", 4.99, "1 lb"], ["Produce", "Roma Tomatoes", 2.49, "per lb"],
  ["Meat & Seafood", "Chicken Breast", 8.99, "per lb"], ["Meat & Seafood", "Ground Beef", 6.99, "per lb"], ["Meat & Seafood", "Atlantic Salmon", 12.99, "per lb"], ["Meat & Seafood", "Pork Tenderloin", 7.49, "per lb"], ["Meat & Seafood", "Turkey Meatballs", 6.49, "16 oz"], ["Meat & Seafood", "Wild Cod Fillets", 10.99, "per lb"], ["Meat & Seafood", "Chicken Thighs", 5.99, "per lb"], ["Meat & Seafood", "Smoked Turkey", 5.49, "8 oz"],
  ["Dairy", "Whole Milk", 4.29, "half gallon"], ["Dairy", "Greek Yogurt", 5.49, "32 oz"], ["Dairy", "Free-Range Eggs", 5.99, "dozen"], ["Dairy", "Salted Butter", 4.49, "16 oz"], ["Dairy", "Sharp Cheddar", 4.99, "8 oz"], ["Dairy", "Oat Milk", 4.79, "half gallon"], ["Dairy", "Cottage Cheese", 3.99, "16 oz"], ["Dairy", "Heavy Cream", 3.49, "pint"],
  ["Bakery", "Sourdough Loaf", 5.49, "each"], ["Bakery", "Butter Croissants", 5.99, "4 pack"], ["Bakery", "Everything Bagels", 4.49, "6 pack"], ["Bakery", "Blueberry Muffins", 5.49, "4 pack"], ["Bakery", "Whole Wheat Bread", 4.29, "loaf"], ["Bakery", "French Baguette", 3.49, "each"], ["Bakery", "Cinnamon Rolls", 6.49, "4 pack"], ["Bakery", "Chocolate Chip Cookies", 5.99, "12 pack"],
  ["Pantry", "Extra Virgin Olive Oil", 11.99, "500 ml"], ["Pantry", "Jasmine Rice", 6.49, "2 lb"], ["Pantry", "Penne Pasta", 2.49, "16 oz"], ["Pantry", "Crushed Tomatoes", 2.29, "28 oz"], ["Pantry", "Creamy Peanut Butter", 4.49, "16 oz"], ["Pantry", "Maple Syrup", 8.99, "12 oz"], ["Pantry", "Old-Fashioned Oats", 4.99, "18 oz"], ["Pantry", "Black Beans", 1.79, "15 oz"],
  ["Frozen", "Wild Blueberries", 5.49, "16 oz"], ["Frozen", "Garden Peas", 2.99, "12 oz"], ["Frozen", "Margherita Pizza", 8.99, "each"], ["Frozen", "Vanilla Ice Cream", 6.49, "pint"], ["Frozen", "Mixed Vegetables", 3.49, "16 oz"], ["Frozen", "Chicken Dumplings", 7.99, "12 oz"], ["Frozen", "Mango Chunks", 5.99, "16 oz"], ["Frozen", "Waffle Fries", 4.49, "20 oz"],
  ["Beverages", "Sparkling Water", 5.99, "8 pack"], ["Beverages", "Cold Brew Coffee", 5.49, "32 oz"], ["Beverages", "Orange Juice", 5.29, "half gallon"], ["Beverages", "Green Tea", 4.49, "20 bags"], ["Beverages", "Coconut Water", 3.49, "1 liter"], ["Beverages", "Lemonade", 3.99, "half gallon"], ["Beverages", "Ground Coffee", 10.99, "12 oz"], ["Beverages", "Ginger Kombucha", 3.29, "16 oz"],
  ["Household Essentials", "Dish Soap", 4.49, "24 oz"], ["Household Essentials", "Paper Towels", 8.99, "6 rolls"], ["Household Essentials", "Laundry Detergent", 12.99, "50 oz"], ["Household Essentials", "Kitchen Sponges", 3.49, "3 pack"], ["Household Essentials", "Recycled Trash Bags", 7.99, "20 count"], ["Household Essentials", "All-Purpose Cleaner", 4.99, "32 oz"], ["Household Essentials", "Toilet Paper", 9.49, "8 rolls"], ["Household Essentials", "Hand Soap", 3.99, "12 oz"],
];

const slugify = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const products: Product[] = catalog.map(([category, name, price, unit]) => ({
  id: slugify(name),
  name,
  category,
  price,
  unit,
  description: `${name}, selected for everyday freshness and quality. This is a simulated catalog item with a sample price; availability and details are for demonstration only.`,
  image: categoryImages[category],
  tags: category === "Produce" ? ["Fresh", "Sample item"] : ["Sample item"],
}));

export const categories = ["All", "Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];
export const cartStorageKey = "aaa-grocery-cart";
export const ordersStorageKey = "aaa-grocery-orders";

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function readCart(): CartItem[] {
  const saved = readLocal<CartItem[]>(cartStorageKey, readLocal<CartItem[]>("cart", []));
  if (!Array.isArray(saved)) return [];
  return saved.flatMap((item) => {
    const productId = typeof item?.productId === "string" ? item.productId : "";
    const quantity = Number(item?.quantity);
    return productId && Number.isFinite(quantity) && quantity > 0 ? [{ productId, quantity: Math.floor(quantity) }] : [];
  });
}

export function saveCart(cart: CartItem[]) {
  writeLocal(cartStorageKey, cart);
  writeLocal("cart", cart);
}

export function addProductToCart(productId: string, amount = 1) {
  const cart = readCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) existing.quantity += amount;
  else cart.push({ productId, quantity: amount });
  saveCart(cart);
  return cart;
}

export function readOrders(): DemoOrder[] {
  const saved = readLocal<DemoOrder[]>(ordersStorageKey, readLocal<DemoOrder[]>("orders", []));
  return Array.isArray(saved) ? saved : [];
}

export function saveOrders(orders: DemoOrder[]) {
  writeLocal(ordersStorageKey, orders);
  writeLocal("orders", orders);
}

export function seededOrder(): DemoOrder {
  const bananas = getProduct("organic-bananas")!;
  const sourdough = getProduct("sourdough-loaf")!;
  const items: OrderItem[] = [bananas, sourdough].map((product, index) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit,
    quantity: index === 0 ? 2 : 1,
    image: product.image,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id: "demo-order-1042",
    createdAt: "2025-05-18T10:30:00.000Z",
    status: "Completed demo order",
    fulfillment: "Pickup",
    address: "Northside Market pickup",
    items,
    subtotal,
    fees: 0,
    total: subtotal,
    substitution: "No substitutions were needed in this sample order.",
  };
}

export function allOrders(): DemoOrder[] {
  const saved = readOrders();
  return saved.length ? saved : [seededOrder()];
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

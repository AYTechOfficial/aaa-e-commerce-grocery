import { readLocal, writeLocal } from "@/lib/persist";

export const categories = [
  "Produce",
  "Meat & Seafood",
  "Dairy",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household Essentials",
] as const;

export type GroceryCategory = (typeof categories)[number];

export type Product = {
  slug: string;
  name: string;
  category: GroceryCategory;
  price: number;
  unit: string;
  description: string;
  image: string;
  tags: string[];
};

export type CartItem = {
  slug: string;
  quantity: number;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  fulfillment: string;
  name: string;
  address: string;
  items: Array<CartItem & { name: string; price: number; unit: string; image: string }>;
  subtotal: number;
  fee: number;
  total: number;
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const productRows: Array<[GroceryCategory, string[], number, string, string]> = [
  ["Produce", ["Avocados", "Honeycrisp Apples", "Baby Spinach", "Strawberries", "English Cucumbers", "Roma Tomatoes", "Rainbow Carrots", "Yellow Onions"], 2.49, "each / pack", "Fresh, carefully selected produce for everyday meals."],
  ["Meat & Seafood", ["Chicken Breast", "Ground Beef", "Atlantic Salmon", "Pork Tenderloin", "Chicken Thighs", "Wild-Caught Shrimp", "Ground Turkey", "Cod Fillets"], 7.99, "per pack", "Quality protein, packed fresh and ready for your kitchen."],
  ["Dairy", ["Whole Milk", "Greek Yogurt", "Salted Butter", "Sharp Cheddar", "Large Brown Eggs", "Oat Milk", "Sour Cream", "Cream Cheese"], 3.49, "per item", "A dependable fridge staple selected for great everyday meals."],
  ["Bakery", ["Sourdough Loaf", "Butter Croissants", "Blueberry Muffins", "Everything Bagels", "Country White Bread", "Chocolate Chip Cookies", "Pita Bread", "Cinnamon Rolls"], 4.29, "per item", "Fresh-baked favorites with a little neighborhood bakery warmth."],
  ["Pantry", ["Extra Virgin Olive Oil", "Long Grain Rice", "Penne Pasta", "Black Beans", "Rolled Oats", "Tomato Basil Sauce", "Creamy Peanut Butter", "Maple Syrup"], 3.99, "per item", "Kitchen cupboard essentials for simple, satisfying meals."],
  ["Frozen", ["Sweet Peas", "Mixed Berries", "Margherita Pizza", "Vanilla Ice Cream", "Broccoli Florets", "Chicken Dumplings", "Mango Chunks", "Waffle Fries"], 4.79, "per item", "Convenient frozen favorites, ready when you are."],
  ["Beverages", ["Cold Brew Coffee", "Sparkling Water", "Orange Juice", "Green Tea", "Apple Cider", "Lemonade", "Coconut Water", "Ground Coffee"], 3.79, "per item", "A refreshing pick for your fridge, pantry, or next picnic."],
  ["Household Essentials", ["Paper Towels", "Dish Soap", "Laundry Detergent", "Kitchen Trash Bags", "All-Purpose Cleaner", "Facial Tissues", "Toilet Paper", "Reusable Sponges"], 5.49, "per item", "Useful home essentials for keeping things running smoothly."],
];

const categoryPhotos: Record<GroceryCategory, string> = {
  Produce: "photo-1542838132-92c53300491e",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  Dairy: "photo-1628088062854-d1870b4553da",
  Bakery: "photo-1509440159596-0249088772ff",
  Pantry: "photo-1547592180-85f173990554",
  Frozen: "photo- frozen",
  Beverages: "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1583947581924-860bda6a26df",
};

export const products: Product[] = productRows.flatMap(([category, names, basePrice, unit, description], categoryIndex) =>
  names.map((name, itemIndex) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const imageId = categoryPhotos[category] === "photo- frozen" ? "photo- frozen" : categoryPhotos[category];
    return {
      slug,
      name,
      category,
      price: Number((basePrice + itemIndex * 0.37 + categoryIndex * 0.23).toFixed(2)),
      unit,
      description,
      image: photo(imageId === "photo- frozen" ? "photo- frozen" : imageId),
      tags: category === "Produce" ? ["Fresh", "Vegetarian"] : [],
    };
  }),
);

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCart(): CartItem[] {
  const stored = readLocal<CartItem[]>("aaa-grocery-cart", []);
  return Array.isArray(stored)
    ? stored.filter((item) => typeof item.slug === "string" && Number.isFinite(item.quantity) && item.quantity > 0)
    : [];
}

function saveCart(cart: CartItem[]) {
  writeLocal("aaa-grocery-cart", cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(slug: string) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);
  if (existing) existing.quantity += 1;
  else cart.push({ slug, quantity: 1 });
  saveCart(cart);
}

export function setCartQuantity(slug: string, quantity: number) {
  const cart = getCart()
    .map((item) => item.slug === slug ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);
  saveCart(cart);
}

export function removeFromCart(slug: string) {
  saveCart(getCart().filter((item) => item.slug !== slug));
}

export function getSavedOrder(id: string): DemoOrder | null {
  const orders = readLocal<DemoOrder[]>("aaa-grocery-orders", []);
  return Array.isArray(orders) ? orders.find((order) => order.id === id) ?? null : null;
}

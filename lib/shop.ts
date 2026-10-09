import { readLocal, writeLocal } from "@/lib/persist";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
  storeIds: string[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  placedAt: string;
  fulfillment: string;
  items: CartItem[];
  subtotal: number;
  fee: number;
  total: number;
  substitution: string;
};

const stores = ["northside-market", "garden-district", "riverside-grocer"];

export const products: Product[] = [
  { id: "apples", slug: "crisp-apples", name: "Crisp Gala Apples", category: "Produce", price: 1.49, unit: "per lb", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85", description: "Sweet, crisp apples selected for a satisfying everyday snack.", tags: ["Vegetarian", "Gluten-free"], storeIds: stores },
  { id: "avocado", slug: "ripe-avocados", name: "Ripe Hass Avocados", category: "Produce", price: 1.25, unit: "each", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85", description: "Creamy, ready-to-enjoy avocados with a rich, buttery texture.", tags: ["Vegan", "Gluten-free"], storeIds: stores },
  { id: "tomatoes", slug: "heirloom-tomatoes", name: "Heirloom Tomatoes", category: "Produce", price: 3.99, unit: "per lb", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85", description: "Colorful, juicy tomatoes with a bright, garden-fresh flavor.", tags: ["Vegan", "Gluten-free"], storeIds: stores },
  { id: "greens", slug: "baby-spinach", name: "Baby Spinach", category: "Produce", price: 3.49, unit: "5 oz bag", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85", description: "Tender baby spinach, washed and ready for salads or sautés.", tags: ["Vegan"], storeIds: stores },
  { id: "carrots", slug: "rainbow-carrots", name: "Rainbow Carrots", category: "Produce", price: 2.99, unit: "1 lb bunch", image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85", description: "A colorful bunch of sweet, crunchy seasonal carrots.", tags: ["Vegan", "Gluten-free"], storeIds: stores },
  { id: "chicken", slug: "chicken-breast", name: "Free-Range Chicken Breast", category: "Meat & Seafood", price: 8.99, unit: "per lb", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85", description: "Lean, versatile chicken breast for a weeknight favorite.", tags: ["No antibiotics ever"], storeIds: stores },
  { id: "salmon", slug: "atlantic-salmon", name: "Atlantic Salmon Fillet", category: "Meat & Seafood", price: 12.99, unit: "per lb", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85", description: "A tender salmon fillet, delicious roasted, grilled, or pan-seared.", tags: ["Responsibly sourced"], storeIds: stores },
  { id: "eggs", slug: "farm-eggs", name: "Pasture-Raised Eggs", category: "Dairy", price: 5.49, unit: "12 count", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85", description: "A dozen farm eggs for breakfast, baking, and everything in between.", tags: ["Pasture-raised"], storeIds: stores },
  { id: "milk", slug: "whole-milk", name: "Local Whole Milk", category: "Dairy", price: 4.29, unit: "half gallon", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85", description: "Creamy whole milk from a nearby dairy, kept chilled.", tags: ["Local"], storeIds: stores },
  { id: "cheddar", slug: "sharp-cheddar", name: "Aged Sharp Cheddar", category: "Dairy", price: 6.49, unit: "8 oz", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85", description: "Aged cheddar with a pleasantly bold, savory finish.", tags: ["Vegetarian"], storeIds: stores },
  { id: "bread", slug: "sourdough-loaf", name: "Country Sourdough Loaf", category: "Bakery", price: 6.99, unit: "loaf", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=900&q=85", description: "A golden-crusted sourdough loaf with a soft, airy center.", tags: ["Small-batch"], storeIds: stores },
  { id: "croissants", slug: "butter-croissants", name: "Butter Croissants", category: "Bakery", price: 5.99, unit: "4 count", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85", description: "Flaky, buttery croissants baked fresh for a special breakfast.", tags: ["Small-batch"], storeIds: stores },
  { id: "oats", slug: "rolled-oats", name: "Organic Rolled Oats", category: "Pantry", price: 4.49, unit: "18 oz", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=85", description: "Whole-grain rolled oats for warm breakfasts and homemade baking.", tags: ["Organic", "Vegan"], storeIds: stores },
  { id: "pasta", slug: "rigatoni-pasta", name: "Bronze-Cut Rigatoni", category: "Pantry", price: 3.79, unit: "16 oz", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=900&q=85", description: "Ridged bronze-cut pasta that holds on to your favorite sauce.", tags: ["Vegetarian"], storeIds: stores },
  { id: "coffee", slug: "house-coffee", name: "Neighborhood House Coffee", category: "Beverages", price: 11.99, unit: "12 oz bag", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=900&q=85", description: "A balanced, medium-roast coffee for slow mornings.", tags: ["Fair trade"], storeIds: stores },
  { id: "juice", slug: "orange-juice", name: "Fresh Orange Juice", category: "Beverages", price: 5.49, unit: "32 fl oz", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85", description: "Bright, refreshing orange juice with a fresh citrus taste.", tags: ["No added sugar"], storeIds: stores },
  { id: "icecream", slug: "vanilla-ice-cream", name: "Vanilla Bean Ice Cream", category: "Frozen", price: 6.99, unit: "pint", image: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=900&q=85", description: "A smooth, creamy frozen treat made with real vanilla bean.", tags: ["Vegetarian"], storeIds: stores },
  { id: "peas", slug: "frozen-sweet-peas", name: "Frozen Sweet Peas", category: "Frozen", price: 2.99, unit: "12 oz", image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=900&q=85", description: "Sweet garden peas picked and frozen at their freshest.", tags: ["Vegan"], storeIds: stores },
  { id: "soap", slug: "dish-soap", name: "Plant-Based Dish Soap", category: "Household Essentials", price: 4.99, unit: "16 fl oz", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=85", description: "A gentle, effective dish soap made with plant-based ingredients.", tags: ["Plant-based"], storeIds: stores },
  { id: "towels", slug: "paper-towels", name: "Recycled Paper Towels", category: "Household Essentials", price: 7.49, unit: "2 rolls", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85", description: "Absorbent everyday paper towels made with recycled material.", tags: ["Recycled"], storeIds: stores },
];

export const categories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];

export const storeDetails: Record<string, { name: string; neighborhood: string; description: string }> = {
  "northside-market": { name: "Northside Market", neighborhood: "Northside", description: "A friendly neighborhood market with fresh produce and everyday favorites." },
  "garden-district": { name: "Garden District Grocer", neighborhood: "Garden District", description: "Seasonal picks, local bakery treats, and pantry staples close to home." },
  "riverside-grocer": { name: "Riverside Grocer", neighborhood: "Riverside", description: "A curated selection of fresh food and household essentials for your week." },
};

export function getCart(): CartItem[] {
  const saved = readLocal<CartItem[]>("cart", []);
  if (!Array.isArray(saved)) return [];
  return saved.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const product = products.find((entry) => entry.id === item.productId || entry.slug === item.slug);
    if (!product) return [];
    const quantity = Number(item.quantity);
    return [{ productId: product.id, slug: product.slug, name: product.name, price: product.price, unit: product.unit, image: product.image, quantity: Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1 }];
  });
}

export function saveCart(items: CartItem[]) {
  writeLocal("cart", items);
}

export function getOrders(): Order[] {
  return readLocal<Order[]>("orders", []);
}

export function seedOrders(): Order[] {
  const existing = getOrders();
  if (existing.length) return existing;
  const sampleItems: CartItem[] = [
    { productId: "apples", slug: "crisp-apples", name: "Crisp Gala Apples", price: 1.49, unit: "per lb", image: products[0].image, quantity: 2 },
    { productId: "bread", slug: "sourdough-loaf", name: "Country Sourdough Loaf", price: 6.99, unit: "loaf", image: products[10].image, quantity: 1 },
  ];
  const subtotal = sampleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order: Order = { id: "demo-1042", status: "Completed", placedAt: "2025-02-18T11:30:00.000Z", fulfillment: "Pickup", items: sampleItems, subtotal, fee: 0, total: subtotal, substitution: "No substitutions were needed." };
  writeLocal("orders", [order]);
  return [order];
}

export function money(value: number) {
  return `$${value.toFixed(2)}`;
}

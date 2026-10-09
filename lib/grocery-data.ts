export type GroceryCategory =
  | "Produce"
  | "Meat & Seafood"
  | "Dairy"
  | "Bakery"
  | "Pantry"
  | "Frozen"
  | "Beverages"
  | "Household Essentials";

export type Product = {
  slug: string;
  name: string;
  category: GroceryCategory;
  price: number;
  size: string;
  image: string;
  description: string;
  tags: string[];
};

export const categories: GroceryCategory[] = [
  "Produce",
  "Meat & Seafood",
  "Dairy",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household Essentials",
];

const categoryImages: Record<GroceryCategory, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80",
  Dairy: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  Pantry: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=900&q=80",
  Frozen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
  "Household Essentials": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
};

const selections: { category: GroceryCategory; names: string[]; price: number; size: string; tags?: string[] }[] = [
  { category: "Produce", price: 2.49, size: "1 lb", names: ["Honeycrisp Apples", "Ripe Avocados", "Baby Spinach", "Sweet Strawberries", "Heirloom Tomatoes", "Rainbow Carrots", "English Cucumber", "Lemons"], tags: ["Fresh pick"] },
  { category: "Meat & Seafood", price: 8.99, size: "1 lb", names: ["Boneless Chicken Breast", "Atlantic Salmon Fillet", "Ground Turkey", "Grass-Fed Ground Beef", "Pork Tenderloin", "Wild-Caught Shrimp", "Chicken Thighs", "Cod Fillets"], tags: ["Keep refrigerated"] },
  { category: "Dairy", price: 4.29, size: "32 oz", names: ["Whole Milk", "Oat Milk", "Greek Yogurt", "Salted Butter", "Sharp Cheddar", "Free-Range Eggs", "Cottage Cheese", "Heavy Cream"], tags: ["Everyday favorite"] },
  { category: "Bakery", price: 4.99, size: "1 loaf", names: ["Sourdough Country Loaf", "Butter Croissants", "Everything Bagels", "Whole Wheat Sandwich Bread", "Blueberry Muffins", "Ciabatta Rolls", "Chocolate Chip Cookies", "Flour Tortillas"], tags: ["Baked fresh"] },
  { category: "Pantry", price: 3.49, size: "16 oz", names: ["Extra Virgin Olive Oil", "Organic Rolled Oats", "Brown Rice", "Penne Pasta", "Creamy Peanut Butter", "Black Beans", "Crushed Tomatoes", "Wildflower Honey"], tags: ["Pantry staple"] },
  { category: "Frozen", price: 5.49, size: "16 oz", names: ["Sweet Peas", "Mixed Berries", "Margherita Pizza", "Vanilla Bean Ice Cream", "Vegetable Dumplings", "Cut Green Beans", "Mango Chunks", "Potato Wedges"], tags: ["Keep frozen"] },
  { category: "Beverages", price: 3.99, size: "64 fl oz", names: ["Fresh Orange Juice", "Sparkling Lime Water", "Cold Brew Coffee", "Green Tea", "Apple Cider", "Ginger Lemon Kombucha", "Coconut Water", "Crisp Mineral Water"], tags: ["Refreshing"] },
  { category: "Household Essentials", price: 6.99, size: "1 pack", names: ["Recycled Paper Towels", "Unscented Dish Soap", "Laundry Detergent", "Compostable Kitchen Bags", "All-Purpose Cleaner", "Soft Bath Tissue", "Reusable Sponges", "Hand Soap"], tags: ["Home essential"] },
];

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const products: Product[] = selections.flatMap((selection) =>
  selection.names.map((name, index) => ({
    slug: slugify(name),
    name,
    category: selection.category,
    price: Number((selection.price + (index % 4) * 0.73).toFixed(2)),
    size: selection.category === "Produce" ? ["1 lb", "each", "5 oz", "1 pint"][index % 4] : selection.size,
    image: categoryImages[selection.category],
    description: `${name}, selected for a delicious everyday grocery shop. Product availability, images, and prices are simulated for this demo.`,
    tags: selection.tags ?? [],
  })),
);

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export type CartLine = { slug: string; quantity: number };
export type DemoOrder = {
  id: string;
  createdAt: string;
  items: CartLine[];
  fulfillment: "Delivery" | "Pickup";
  address: string;
  subtotal: number;
  fee: number;
  total: number;
};

export const CART_KEY = "aaa-grocery-cart";
export const ORDERS_KEY = "aaa-grocery-orders";

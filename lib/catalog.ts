export const categories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"] as const;

export type Category = (typeof categories)[number];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
};

const photoByCategory: Record<Category, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=85",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  Pantry: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85",
  Frozen: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=900&q=85",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  "Household Essentials": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=85",
};

const selections: [Category, string, number, string, string[]][] = [
  ["Produce", "Honeycrisp Apples", 1.29, "each", ["Vegan", "Gluten-free"]],
  ["Produce", "Organic Bananas", 0.79, "per lb", ["Organic", "Vegan"]],
  ["Produce", "Avocados", 1.49, "each", ["Vegan", "Gluten-free"]],
  ["Produce", "Baby Spinach", 3.49, "5 oz bag", ["Organic", "Vegan"]],
  ["Produce", "Roma Tomatoes", 1.99, "per lb", ["Vegan", "Gluten-free"]],
  ["Produce", "English Cucumber", 1.79, "each", ["Vegan", "Gluten-free"]],
  ["Produce", "Sweet Potatoes", 1.49, "per lb", ["Vegan", "Gluten-free"]],
  ["Produce", "Strawberries", 4.99, "1 lb pack", ["Vegan", "Gluten-free"]],
  ["Meat & Seafood", "Boneless Chicken Breast", 8.99, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Ground Beef 90% Lean", 7.49, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Atlantic Salmon Fillet", 12.99, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Pork Tenderloin", 6.99, "per lb", ["Fresh"]],
  ["Meat & Seafood", "Turkey Breast Cutlets", 8.49, "per lb", ["Lean"]],
  ["Meat & Seafood", "Wild-Caught Shrimp", 10.99, "12 oz pack", ["Wild-caught"]],
  ["Meat & Seafood", "Italian Sausage", 5.99, "1 lb pack", ["Fresh"]],
  ["Meat & Seafood", "Stew Beef", 9.49, "per lb", ["Fresh"]],
  ["Dairy", "Whole Milk", 3.99, "half gallon", ["Local"]],
  ["Dairy", "Large Brown Eggs", 4.49, "12 count", ["Free-range"]],
  ["Dairy", "Salted Butter", 4.29, "1 lb", ["Creamy"]],
  ["Dairy", "Sharp Cheddar", 5.49, "8 oz", ["Aged"]],
  ["Dairy", "Plain Greek Yogurt", 5.99, "32 oz", ["High protein"]],
  ["Dairy", "Oat Milk", 4.49, "half gallon", ["Dairy-free"]],
  ["Dairy", "Heavy Cream", 3.79, "pint", ["Local"]],
  ["Dairy", "Shredded Mozzarella", 4.29, "8 oz", ["Melts well"]],
  ["Bakery", "Sourdough Boule", 5.49, "loaf", ["Fresh baked"]],
  ["Bakery", "Everything Bagels", 4.99, "6 count", ["Fresh baked"]],
  ["Bakery", "Butter Croissants", 5.99, "4 count", ["Fresh baked"]],
  ["Bakery", "Whole Wheat Sandwich Bread", 4.29, "loaf", ["Whole grain"]],
  ["Bakery", "Blueberry Muffins", 5.49, "4 count", ["Fresh baked"]],
  ["Bakery", "Flour Tortillas", 3.99, "10 count", ["Soft"]],
  ["Bakery", "French Baguette", 2.99, "each", ["Fresh baked"]],
  ["Bakery", "Chocolate Chip Cookies", 5.99, "8 count", ["Bakery favorite"]],
  ["Pantry", "Extra Virgin Olive Oil", 10.99, "16.9 fl oz", ["Mediterranean"]],
  ["Pantry", "Basmati Rice", 6.49, "2 lb bag", ["Pantry staple"]],
  ["Pantry", "Penne Pasta", 2.49, "1 lb", ["Italian"]],
  ["Pantry", "Marinara Sauce", 3.99, "24 oz jar", ["Slow simmered"]],
  ["Pantry", "Black Beans", 1.79, "15 oz can", ["Plant-based"]],
  ["Pantry", "Creamy Peanut Butter", 4.49, "16 oz jar", ["Protein source"]],
  ["Pantry", "Rolled Oats", 4.99, "18 oz canister", ["Whole grain"]],
  ["Pantry", "Maple Syrup", 8.99, "12 fl oz", ["Pure maple"]],
  ["Frozen", "Wild Blueberries", 5.99, "12 oz bag", ["No added sugar"]],
  ["Frozen", "Peas & Carrots", 2.49, "12 oz bag", ["Flash frozen"]],
  ["Frozen", "Margherita Pizza", 7.99, "12 inch", ["Easy dinner"]],
  ["Frozen", "Vanilla Bean Ice Cream", 6.49, "pint", ["Small batch"]],
  ["Frozen", "Broccoli Florets", 2.99, "16 oz bag", ["Flash frozen"]],
  ["Frozen", "Veggie Potstickers", 6.99, "12 oz bag", ["Plant-based"]],
  ["Frozen", "Waffle Fries", 4.49, "20 oz bag", ["Oven ready"]],
  ["Frozen", "Mango Chunks", 5.49, "12 oz bag", ["No added sugar"]],
  ["Beverages", "Sparkling Mineral Water", 5.99, "8 pack", ["Unsweetened"]],
  ["Beverages", "Fresh Orange Juice", 5.49, "half gallon", ["Refrigerated"]],
  ["Beverages", "Medium Roast Coffee", 10.99, "12 oz bag", ["Fair trade"]],
  ["Beverages", "Green Tea", 4.99, "20 bags", ["Bright & fresh"]],
  ["Beverages", "Lemonade", 3.99, "52 fl oz", ["Made with lemons"]],
  ["Beverages", "Coconut Water", 3.49, "1 liter", ["Hydrating"]],
  ["Beverages", "Ginger Kombucha", 3.29, "16 fl oz", ["Live cultures"]],
  ["Beverages", "Apple Cider", 4.99, "half gallon", ["Pressed locally"]],
  ["Household Essentials", "Dish Soap", 4.49, "24 fl oz", ["Plant-based"]],
  ["Household Essentials", "Paper Towels", 8.99, "6 rolls", ["Strong & absorbent"]],
  ["Household Essentials", "Laundry Detergent", 11.99, "50 fl oz", ["Fresh scent"]],
  ["Household Essentials", "Kitchen Sponges", 3.49, "4 count", ["Reusable"]],
  ["Household Essentials", "Recycled Trash Bags", 7.49, "20 count", ["Recycled material"]],
  ["Household Essentials", "All-Purpose Cleaner", 5.49, "32 fl oz", ["Plant-based"]],
  ["Household Essentials", "Bathroom Tissue", 9.99, "12 rolls", ["Soft & strong"]],
  ["Household Essentials", "Hand Soap", 3.99, "12 fl oz", ["Gentle"]],
];

export const products: Product[] = selections.map(([category, name, price, unit, tags]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  category,
  price,
  unit,
  image: photoByCategory[category],
  description: `${name}, selected for your everyday table. This sample listing has simulated pricing and availability for the AAA Grocery demo.`,
  tags,
}));

export function findProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

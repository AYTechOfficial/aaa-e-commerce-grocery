export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
};

const categoryImages: Record<string, string> = {
  Produce: "photo-1542838132-92c53300491e",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  Dairy: "photo-1550583724-b2692b85b150",
  Bakery: "photo-1509440159596-0249088772ff",
  Pantry: "photo-1606787366850-de6330128bfc",
  Frozen: "photo-1570197788417-0e82375c9371",
  Beverages: "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1583947581924-860bda6a26df",
};

const entries: Array<[string, string, string, number, string, string[]]> = [
  ["organic-strawberries", "Organic Strawberries", "Produce", 5.49, "1 lb basket", ["Organic"]],
  ["avocados", "Ripe Hass Avocados", "Produce", 1.49, "each", ["Vegan"]],
  ["baby-spinach", "Baby Spinach", "Produce", 3.99, "5 oz clamshell", ["Organic", "Vegan"]],
  ["rainbow-carrots", "Rainbow Carrots", "Produce", 3.49, "1 bunch", ["Local"]],
  ["lemons", "Fresh Lemons", "Produce", 0.79, "each", ["Vegan"]],
  ["cherry-tomatoes", "Cherry Tomatoes", "Produce", 4.29, "1 pint", ["Local"]],
  ["yellow-onions", "Yellow Onions", "Produce", 1.29, "1 lb", ["Vegan"]],
  ["gala-apples", "Gala Apples", "Produce", 2.99, "per lb", ["Local"]],
  ["chicken-breast", "Boneless Chicken Breast", "Meat & Seafood", 8.99, "per lb", ["Fresh"]],
  ["ground-turkey", "Ground Turkey", "Meat & Seafood", 6.49, "1 lb package", ["Lean"]],
  ["atlantic-salmon", "Atlantic Salmon Fillet", "Meat & Seafood", 12.99, "per lb", ["Fresh"]],
  ["large-eggs", "Free-Range Large Eggs", "Dairy", 5.29, "dozen", ["Free-range"]],
  ["whole-milk", "Whole Milk", "Dairy", 4.19, " half gallon", ["Local"]],
  ["greek-yogurt", "Plain Greek Yogurt", "Dairy", 5.99, "32 oz tub", ["High protein"]],
  ["sharp-cheddar", "Sharp Cheddar Cheese", "Dairy", 4.79, "8 oz block", ["Vegetarian"]],
  ["salted-butter", "Salted Butter", "Dairy", 4.49, "1 lb", ["Local"]],
  ["sourdough-loaf", "Country Sourdough Loaf", "Bakery", 6.49, "loaf", ["Baked fresh"]],
  ["butter-croissants", "Butter Croissants", "Bakery", 5.99, "4 pack", ["Baked fresh"]],
  ["blueberry-muffins", "Blueberry Muffins", "Bakery", 5.49, "4 pack", ["Vegetarian"]],
  ["bagels", "Everything Bagels", "Bakery", 4.29, "6 pack", ["Baked fresh"]],
  ["rolled-oats", "Old-Fashioned Rolled Oats", "Pantry", 4.49, "32 oz", ["Whole grain"]],
  ["pasta", "Penne Pasta", "Pantry", 2.29, "16 oz", ["Vegan"]],
  ["marinara-sauce", "Tomato Basil Marinara", "Pantry", 4.99, "24 oz jar", ["Vegan"]],
  ["olive-oil", "Extra Virgin Olive Oil", "Pantry", 10.99, "16.9 fl oz", ["Cold pressed"]],
  ["black-beans", "Organic Black Beans", "Pantry", 1.99, "15 oz can", ["Organic", "Vegan"]],
  ["brown-rice", "Long-Grain Brown Rice", "Pantry", 4.99, "2 lb bag", ["Whole grain"]],
  ["vanilla-ice-cream", "Vanilla Bean Ice Cream", "Frozen", 6.49, "1 pint", ["Vegetarian"]],
  ["frozen-blueberries", "Frozen Blueberries", "Frozen", 5.99, "16 oz bag", ["Vegan"]],
  ["veggie-pizza", "Roasted Vegetable Pizza", "Frozen", 8.99, "12 inch", ["Vegetarian"]],
  ["sparkling-water", "Lemon Sparkling Water", "Beverages", 5.49, "8 pack", ["Zero sugar"]],
  ["orange-juice", "Fresh Orange Juice", "Beverages", 6.99, "52 fl oz", ["No pulp"]],
  ["ground-coffee", "House Blend Ground Coffee", "Beverages", 10.49, "12 oz bag", ["Fair trade"]],
  ["green-tea", "Green Tea Bags", "Beverages", 4.99, "20 count", ["Caffeine"]],
  ["dish-soap", "Plant-Based Dish Soap", "Household Essentials", 4.99, "16 fl oz", ["Plant based"]],
  ["paper-towels", "Recycled Paper Towels", "Household Essentials", 8.49, "6 rolls", ["Recycled"]],
  ["laundry-detergent", "Free & Clear Laundry Detergent", "Household Essentials", 12.99, "32 loads", ["Fragrance free"]],
  ["compost-bags", "Compostable Kitchen Bags", "Household Essentials", 7.99, "30 count", ["Compostable"]],
];

export const categories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];

export const products: Product[] = entries.map(([id, name, category, price, unit, tags]) => ({
  id,
  name,
  category,
  price,
  unit: unit.trim(),
  image: `https://images.unsplash.com/${categoryImages[category]}?auto=format&fit=crop&w=900&q=85`,
  description: `${name}, selected for this neighborhood demo catalog. Product availability, description, and price are sample information only.`,
  tags,
}));

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export const stores: Record<string, { name: string; neighborhood: string }> = {
  "northside-market": { name: "Northside Market", neighborhood: "Northside" },
  "garden-street-grocer": { name: "Garden Street Grocer", neighborhood: "Garden Street" },
  "oak-and-olive": { name: "Oak & Olive Market", neighborhood: "Oak District" },
};

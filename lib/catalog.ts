export type GroceryCategory = "Produce" | "Meat & Seafood" | "Dairy" | "Bakery" | "Pantry" | "Frozen" | "Beverages" | "Household Essentials";

export type GroceryProduct = {
  slug: string;
  name: string;
  category: GroceryCategory;
  price: number;
  unit: string;
  description: string;
  tags: string[];
  image: string;
};

const groups: { category: GroceryCategory; image: string; items: [string, string][] }[] = [
  { category: "Produce", image: "photo-1542838132-92c53300491e", items: [["Organic Honeycrisp Apples", "1 lb"], ["Ripe Avocados", "each"], ["Baby Spinach", "5 oz"], ["Sweet Strawberries", "1 pint"], ["Rainbow Carrots", "1 bunch"], ["Roma Tomatoes", "1 lb"], ["English Cucumber", "each"], ["Lemons", "1 lb"]] },
  { category: "Meat & Seafood", image: "photo-1607623814075-e51df1bdc82f", items: [["Chicken Breast", "1 lb"], ["Ground Beef", "1 lb"], ["Atlantic Salmon Fillet", "6 oz"], ["Pork Tenderloin", "1 lb"], ["Mild Italian Sausage", "1 lb"], ["Wild-Caught Shrimp", "12 oz"], ["Chicken Thighs", "1 lb"], ["Grass-Fed Steaks", "each"]] },
  { category: "Dairy", image: "photo-1628088062854-d1870b4553da", items: [["Whole Milk", "half gallon"], ["Farmhouse Cheddar", "8 oz"], ["Greek Yogurt", "32 oz"], ["Salted Butter", "1 lb"], ["Free-Range Eggs", "dozen"], ["Oat Milk", "half gallon"], ["Shredded Mozzarella", "8 oz"], ["Cottage Cheese", "16 oz"]] },
  { category: "Bakery", image: "photo-1509440159596-0249088772ff", items: [["Sourdough Boule", "each"], ["Butter Croissants", "4 pack"], ["Country White Bread", "loaf"], ["Blueberry Muffins", "4 pack"], ["Everything Bagels", "6 pack"], ["French Baguette", "each"], ["Chocolate Chip Cookies", "6 pack"], ["Whole Wheat Pita", "6 pack"]] },
  { category: "Pantry", image: "photo-1606787366850-de6330128bfc", items: [["Extra Virgin Olive Oil", "16.9 oz"], ["Penne Pasta", "1 lb"], ["San Marzano Tomatoes", "28 oz"], ["Rolled Oats", "18 oz"], ["Creamy Peanut Butter", "16 oz"], ["Black Beans", "15 oz"], ["Basmati Rice", "2 lb"], ["Maple Syrup", "12 oz"]] },
  { category: "Frozen", image: "photo- frozen", items: [["Sweet Peas", "12 oz"], ["Wild Blueberries", "12 oz"], ["Margherita Pizza", "each"], ["Vanilla Ice Cream", "pint"], ["Mixed Vegetables", "16 oz"], ["Chicken Pot Pie", "each"], ["Mango Chunks", "12 oz"], ["Waffle Fries", "20 oz"]] },
  { category: "Beverages", image: "photo-1544145945-f90425340c7e", items: [["Sparkling Water", "8 pack"], ["Cold Brew Coffee", "32 oz"], ["Fresh Orange Juice", "half gallon"], ["Green Tea", "20 bags"], ["Ginger Lemon Kombucha", "bottle"], ["Apple Cider", "half gallon"], ["Coconut Water", "1 liter"], ["Ground Coffee", "12 oz"]] },
  { category: "Household Essentials", image: "photo-1583947215259-38e31be8751f", items: [["Recycled Paper Towels", "2 rolls"], ["Dish Soap", "16 oz"], ["Laundry Detergent", "32 oz"], ["Compostable Trash Bags", "20 count"], ["All-Purpose Cleaner", "24 oz"], ["Soft Facial Tissues", "120 count"], ["Sponge Set", "3 pack"], ["Hand Soap", "12 oz"]] },
];

const imageIds: Record<GroceryCategory, string> = {
  Produce: "photo-1542838132-92c53300491e",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  Dairy: "photo-1628088062854-d1870b4553da",
  Bakery: "photo-1509440159596-0249088772ff",
  Pantry: "photo-1606787366850-de6330128bfc",
  Frozen: "photo- freezer",
  Beverages: "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1583947215259-38e31be8751f",
};

function photoUrl(category: GroceryCategory, index: number) {
  const fallbacks: Record<GroceryCategory, string[]> = {
    Produce: ["photo-1542838132-92c53300491e", "photo-1540420773420-3366772f4999", "photo-1566385101042-1a0aa0c1268c"],
    "Meat & Seafood": ["photo-1607623814075-e51df1bdc82f", "photo-1604503468506-a8da13d82791", "photo-1519708227418-c8fd9a32b7a2"],
    Dairy: ["photo-1628088062854-d1870b4553da", "photo-1550583724-b2692b85b150", "photo-1563636619-e9143da7973b"],
    Bakery: ["photo-1509440159596-0249088772ff", "photo-1585478259715-876acc5be8eb", "photo-1608198093002-ad4e0054846d"],
    Pantry: ["photo-1606787366850-de6330128bfc", "photo-1473093295043-cdd812d0e601", "photo-1515542622106-78bda8ba0e5b"],
    Frozen: ["photo- frozen", "photo- frozen", "photo- frozen"],
    Beverages: ["photo-1544145945-f90425340c7e", "photo-1513558161293-cdaf765edfd7", "photo-1517701604599-bb29b565090c"],
    "Household Essentials": ["photo-1583947215259-38e31be8751f", "photo-1556228720-195a672e8a03", "photo-1585421514284-efb74c2b69ba"],
  };
  const id = fallbacks[category][index % fallbacks[category].length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
}

export const categories: GroceryCategory[] = groups.map((group) => group.category);

export const products: GroceryProduct[] = groups.flatMap((group, groupIndex) =>
  group.items.map(([name, unit], index) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    category: group.category,
    price: Number((2.49 + ((groupIndex * 7 + index * 3) % 17) * 0.63).toFixed(2)),
    unit,
    description: `A thoughtfully selected ${name.toLowerCase()} from our neighborhood grocery collection. Product availability and pricing are simulated for this demo.`,
    tags: index % 3 === 0 ? ["Popular", "Demo selection"] : ["Demo selection"],
    image: photoUrl(group.category, index),
  })),
);

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

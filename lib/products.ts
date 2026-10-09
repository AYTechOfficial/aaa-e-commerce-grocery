export type GroceryProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
};

const groups = [
  {
    category: "Produce",
    image: "photo-1542838132-92c53300491e",
    items: ["Avocados", "Baby Spinach", "Blueberries", "Broccoli", "Carrots", "Honeycrisp Apples", "Lemons", "Strawberries"],
    units: ["each", "5 oz bag", "6 oz box", "each", "1 lb bag", "per lb", "each", "1 lb box"],
    prices: [1.49, 3.49, 4.99, 2.29, 1.99, 2.49, 0.79, 4.49],
  },
  {
    category: "Meat & Seafood",
    image: "photo-1607623814075-e51df1bdc82f",
    items: ["Atlantic Salmon Fillet", "Chicken Breast", "Ground Beef", "Pork Tenderloin", "Raw Shrimp", "Chicken Thighs", "Turkey Burgers", "Grass-Fed Steak"],
    units: ["per lb", "per lb", "per lb", "per lb", "1 lb pack", "per lb", "4 pack", "per lb"],
    prices: [12.99, 6.99, 7.49, 8.99, 10.99, 5.49, 8.49, 15.99],
  },
  {
    category: "Dairy",
    image: "photo-1628088062854-d1870b4553da",
    items: ["Whole Milk", "Oat Milk", "Greek Yogurt", "Salted Butter", "Sharp Cheddar", "Free-Range Eggs", "Cottage Cheese", "Heavy Cream"],
    units: ["half gallon", "64 oz carton", "32 oz tub", "1 lb box", "8 oz block", "dozen", "16 oz tub", "pint"],
    prices: [3.29, 4.49, 5.99, 4.29, 3.99, 5.49, 3.79, 3.49],
  },
  {
    category: "Bakery",
    image: "photo-1509440159596-0249088772ff",
    items: ["Sourdough Loaf", "Everything Bagels", "Butter Croissants", "Country White Bread", "Blueberry Muffins", "Flour Tortillas", "Brioche Buns", "Cinnamon Rolls"],
    units: ["loaf", "6 pack", "4 pack", "loaf", "4 pack", "10 count", "4 pack", "4 pack"],
    prices: [5.49, 4.29, 6.49, 3.99, 5.99, 3.49, 4.99, 5.49],
  },
  {
    category: "Pantry",
    image: "photo-1584473457409-ae5c91d7d6e2",
    items: ["Extra Virgin Olive Oil", "Organic Pasta", "Jasmine Rice", "Black Beans", "Creamy Peanut Butter", "Diced Tomatoes", "Old-Fashioned Oats", "Maple Syrup"],
    units: ["500 ml bottle", "1 lb box", "2 lb bag", "15 oz can", "16 oz jar", "14.5 oz can", "18 oz canister", "12 oz bottle"],
    prices: [11.99, 2.49, 5.99, 1.29, 4.49, 1.49, 4.29, 9.99],
  },
  {
    category: "Frozen",
    image: "photo- frozen",
    items: ["Wild Blueberries", "Garden Peas", "Margherita Pizza", "Vanilla Ice Cream", "Edamame", "Mixed Vegetables", "Waffle Fries", "Mango Chunks"],
    units: ["12 oz bag", "16 oz bag", "12 inch pizza", "pint", "12 oz bag", "16 oz bag", "20 oz bag", "12 oz bag"],
    prices: [5.49, 2.49, 8.99, 5.99, 3.49, 2.29, 4.49, 4.99],
  },
  {
    category: "Beverages",
    image: "photo-1544145945-f90425340c7e",
    items: ["Sparkling Water", "Cold Brew Coffee", "Orange Juice", "Green Tea", "Lemonade", "Almond Milk", "Ginger Kombucha", "Ground Coffee"],
    units: ["8 pack", "32 oz bottle", "half gallon", "20 tea bags", "half gallon", "half gallon", "16 oz bottle", "12 oz bag"],
    prices: [4.99, 6.49, 5.29, 4.49, 3.99, 3.79, 3.49, 10.99],
  },
  {
    category: "Household Essentials",
    image: "photo-1583947215259-38e31be8751f",
    items: ["Paper Towels", "Dish Soap", "Laundry Detergent", "Kitchen Sponges", "Recycled Tissues", "Trash Bags", "Hand Soap", "All-Purpose Cleaner"],
    units: ["6 roll pack", "16 oz bottle", "50 oz bottle", "3 pack", "4 box pack", "20 count", "12 oz bottle", "24 oz bottle"],
    prices: [9.99, 3.49, 12.99, 3.29, 6.99, 8.49, 4.29, 5.49],
  },
];

const imageOverrides: Record<string, string> = {
  "photo- frozen": "photo- frozen",
};

export const categories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];

export const products: GroceryProduct[] = groups.flatMap((group) =>
  group.items.map((name, index) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const imageId = imageOverrides[group.image] ?? group.image;
    return {
      slug,
      name,
      category: group.category,
      price: group.prices[index],
      unit: group.units[index],
      image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=82`,
      description: `${name}, selected for everyday meals and stocked as part of our curated neighborhood grocery demo. Product availability and details are simulated.`,
      tags: group.category === "Produce" ? ["Fresh", "Plant based"] : [],
    };
  }),
);

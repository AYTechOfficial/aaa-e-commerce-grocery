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

const categories = [
  {
    name: "Produce",
    image: "photo-1540420773420-3366772f4999",
    products: ["Avocados", "Bananas", "Blueberries", "Broccoli", "Carrots", "Fuji Apples", "Baby Spinach", "Roma Tomatoes"],
  },
  {
    name: "Meat & Seafood",
    image: "photo-1607623814075-e51df1bdc82f",
    products: ["Atlantic Salmon", "Chicken Breast", "Ground Beef", "Pork Chops", "Wild Shrimp", "Chicken Thighs", "Grass-Fed Steak", "Ground Turkey"],
  },
  {
    name: "Dairy",
    image: "photo-1628088062854-d1870b4553da",
    products: ["Whole Milk", "Greek Yogurt", "Salted Butter", "Sharp Cheddar", "Free-Range Eggs", "Oat Milk", "Cottage Cheese", "Heavy Cream"],
  },
  {
    name: "Bakery",
    image: "photo-1509440159596-0249088772ff",
    products: ["Sourdough Loaf", "Butter Croissants", "Blueberry Muffins", "Everything Bagels", "Baguette", "Country White Bread", "Cinnamon Rolls", "Dinner Rolls"],
  },
  {
    name: "Pantry",
    image: "photo-1584473457409-ae5c91d7d8b5",
    products: ["Rolled Oats", "Extra Virgin Olive Oil", "Penne Pasta", "Black Beans", "Jasmine Rice", "Peanut Butter", "Marinara Sauce", "Maple Syrup"],
  },
  {
    name: "Frozen",
    image: "photo- frozen",
    products: ["Frozen Strawberries", "Vanilla Ice Cream", "Peas & Carrots", "Margherita Pizza", "Mango Chunks", "Waffle Fries", "Spinach Ravioli", "Mixed Berries"],
  },
  {
    name: "Beverages",
    image: "photo-1544145945-f90425340c7e",
    products: ["Sparkling Water", "Cold Brew Coffee", "Orange Juice", "Green Tea", "Lemonade", "Apple Cider", "Coconut Water", "Cola"],
  },
  {
    name: "Household Essentials",
    image: "photo-1583947215259-38e31be8751f",
    products: ["Paper Towels", "Dish Soap", "Laundry Detergent", "Kitchen Trash Bags", "All-Purpose Cleaner", "Toilet Paper", "Hand Soap", "Sponges"],
  },
];

const imageOverrides: Record<string, string> = {
  "Frozen": "photo- frozen",
};

const imageUrls: Record<string, string> = {
  Produce: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=85",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  Pantry: "https://images.unsplash.com/photo-1584473457409-ae5c91d7d8b5?auto=format&fit=crop&w=900&q=85",
  Frozen: "https://images.unsplash.com/photo- frozen?auto=format&fit=crop&w=900&q=85",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  "Household Essentials": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
};

const units: Record<string, string> = {
  Produce: "each / 1 lb",
  "Meat & Seafood": "per lb",
  Dairy: "each",
  Bakery: "each",
  Pantry: "each",
  Frozen: "each",
  Beverages: "each",
  "Household Essentials": "each",
};

export const groceryCategories = ["All", ...categories.map((category) => category.name)];

export const groceryProducts: GroceryProduct[] = categories.flatMap((category, categoryIndex) =>
  category.products.map((name, productIndex) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const price = Number((1.99 + categoryIndex * 0.83 + productIndex * 0.71).toFixed(2));
    return {
      slug,
      name,
      category: category.name,
      price,
      unit: units[category.name],
      image: imageUrls[category.name],
      description: `A thoughtfully selected ${name.toLowerCase()} from our neighborhood grocery assortment. Product availability and pricing are simulated demo details.`,
      tags: category.name === "Produce" ? ["Fresh pick"] : category.name === "Meat & Seafood" ? ["Keep refrigerated"] : [],
    };
  }),
);

export function findGroceryProduct(slug: string): GroceryProduct | undefined {
  return groceryProducts.find((product) => product.slug === slug);
}

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

export type Category = (typeof categories)[number];

export type Product = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  image: string;
  description: string;
  tags: string[];
};

const sections: {
  category: Category;
  image: string;
  items: [string, number, string][];
}[] = [
  {
    category: "Produce",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Honeycrisp Apples", 1.49, "each"],
      ["Organic Bananas", 0.79, "per lb"],
      ["Avocados", 1.25, "each"],
      ["Baby Spinach", 3.49, "5 oz"],
      ["Heirloom Tomatoes", 3.99, "per lb"],
      ["Rainbow Carrots", 2.99, "1 bunch"],
      ["English Cucumber", 1.79, "each"],
      ["Strawberries", 4.49, "1 pint"],
    ],
  },
  {
    category: "Meat & Seafood",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Chicken Breast", 8.99, "per lb"],
      ["Ground Turkey", 6.49, "1 lb"],
      ["Atlantic Salmon Fillet", 12.99, "per lb"],
      ["Grass-Fed Ground Beef", 7.99, "1 lb"],
      ["Pork Tenderloin", 9.49, "per lb"],
      ["Wild-Caught Shrimp", 10.99, "12 oz"],
      ["Chicken Thighs", 5.99, "per lb"],
      ["Smoked Salmon", 8.49, "4 oz"],
    ],
  },
  {
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Whole Milk", 4.29, "half gallon"],
      ["Greek Yogurt", 5.49, "32 oz"],
      ["Free-Range Eggs", 5.99, "dozen"],
      ["Salted Butter", 4.79, "1 lb"],
      ["Sharp Cheddar", 5.99, "8 oz"],
      ["Oat Milk", 4.49, "half gallon"],
      ["Cottage Cheese", 3.99, "16 oz"],
      ["Shredded Mozzarella", 4.29, "8 oz"],
    ],
  },
  {
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Sourdough Boule", 6.49, "loaf"],
      ["Butter Croissants", 5.99, "4 pack"],
      ["Multigrain Sandwich Bread", 4.79, "loaf"],
      ["Blueberry Muffins", 5.49, "4 pack"],
      ["Everything Bagels", 4.99, "6 pack"],
      ["Classic Baguette", 3.49, "each"],
      ["Chocolate Chip Cookies", 6.99, "6 pack"],
      ["Flour Tortillas", 3.99, "10 pack"],
    ],
  },
  {
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Jasmine Rice", 7.49, "2 lb"],
      ["Extra Virgin Olive Oil", 11.99, "500 ml"],
      ["Old-Fashioned Oats", 4.49, "18 oz"],
      ["Black Beans", 1.79, "15 oz"],
      ["Rigatoni Pasta", 2.49, "1 lb"],
      ["Creamy Peanut Butter", 4.99, "16 oz"],
      ["Maple Syrup", 9.49, "8 oz"],
      ["Crushed Tomatoes", 2.29, "28 oz"],
    ],
  },
  {
    category: "Frozen",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Wild Blueberries", 5.99, "12 oz"],
      ["Peas & Carrots", 2.99, "16 oz"],
      ["Spinach Ravioli", 7.49, "12 oz"],
      ["Cauliflower Pizza", 8.99, "each"],
      ["Vanilla Bean Ice Cream", 6.99, "pint"],
      ["Mango Chunks", 5.49, "16 oz"],
      ["Vegetable Dumplings", 6.49, "12 oz"],
      ["Waffle Fries", 4.99, "20 oz"],
    ],
  },
  {
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Fresh-Squeezed Orange Juice", 6.49, "half gallon"],
      ["Sparkling Mineral Water", 5.99, "8 pack"],
      ["Cold Brew Coffee", 6.99, "32 oz"],
      ["Green Tea", 4.49, "16 bags"],
      ["Lemonade", 4.99, "52 oz"],
      ["Coconut Water", 3.49, "1 liter"],
      ["Whole Bean Coffee", 12.99, "12 oz"],
      ["Ginger Kombucha", 3.79, "16 oz"],
    ],
  },
  {
    category: "Household Essentials",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
    items: [
      ["Dish Soap", 4.49, "18 oz"],
      ["Paper Towels", 8.99, "6 rolls"],
      ["Laundry Detergent", 12.49, "40 oz"],
      ["Reusable Kitchen Sponges", 5.99, "3 pack"],
      ["All-Purpose Cleaner", 5.49, "28 oz"],
      ["Facial Tissues", 3.99, "3 boxes"],
      ["Compostable Trash Bags", 9.49, "20 pack"],
      ["Hand Soap", 3.49, "12 oz"],
    ],
  },
];

function makeSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const products: Product[] = sections.flatMap(({ category, image, items }) =>
  items.map(([name, price, unit]) => ({
    slug: makeSlug(name),
    name,
    price,
    unit,
    category,
    image,
    description: `${name}, selected as a neighborhood favorite. Product details and availability are sample information for this demo catalog.`,
    tags: category === "Produce" ? ["Fresh pick"] : [],
  })),
);

export type CartLine = { slug: string; quantity: number };

export type DemoOrder = {
  id: string;
  createdAt: string;
  fulfillment: string;
  items: { slug: string; quantity: number; price: number; name: string }[];
  subtotal: number;
  fee: number;
  total: number;
};

export const cartStorageKey = "aaa-grocery-cart";
export const ordersStorageKey = "aaa-grocery-orders";
export const cartUpdatedEvent = "aaa-grocery-cart-updated";

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

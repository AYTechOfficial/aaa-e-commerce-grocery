export type GroceryProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image: string;
};

const collections: { category: string; image: string; items: [string, string, number, string][] }[] = [
  {
    category: "Produce",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Organic Baby Spinach", "organic-baby-spinach", 4.49, "5 oz"],
      ["Ripe Hass Avocados", "ripe-hass-avocados", 1.49, "each"],
      ["Sweet Strawberries", "sweet-strawberries", 5.99, "1 lb"],
      ["Heirloom Tomatoes", "heirloom-tomatoes", 4.99, "1 lb"],
      ["Crisp Honeycrisp Apples", "honeycrisp-apples", 3.99, "1 lb"],
      ["English Cucumber", "english-cucumber", 2.49, "each"],
      ["Rainbow Carrots", "rainbow-carrots", 3.49, "1 bunch"],
      ["Sweet Yellow Onions", "yellow-onions", 2.99, "2 lb bag"],
    ],
  },
  {
    category: "Meat & Seafood",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Atlantic Salmon Fillet", "atlantic-salmon-fillet", 12.99, "8 oz"],
      ["Boneless Chicken Breast", "boneless-chicken-breast", 8.99, "1 lb"],
      ["Grass-Fed Ground Beef", "grass-fed-ground-beef", 9.49, "1 lb"],
      ["Wild-Caught Shrimp", "wild-caught-shrimp", 11.99, "12 oz"],
      ["Pork Tenderloin", "pork-tenderloin", 10.99, "1 lb"],
      ["Chicken Thighs", "chicken-thighs", 7.49, "1.5 lb"],
      ["Italian Sausage", "italian-sausage", 6.99, "1 lb"],
      ["Fresh Cod Fillet", "fresh-cod-fillet", 10.49, "8 oz"],
    ],
  },
  {
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Whole Milk", "whole-milk", 4.29, "half gallon"],
      ["Organic Oat Milk", "organic-oat-milk", 5.49, "64 oz"],
      ["Free-Range Large Eggs", "free-range-eggs", 5.99, "dozen"],
      ["Creamy Greek Yogurt", "creamy-greek-yogurt", 6.49, "32 oz"],
      ["Salted European Butter", "salted-european-butter", 4.99, "8 oz"],
      ["Sharp Cheddar Cheese", "sharp-cheddar-cheese", 5.49, "8 oz"],
      ["Whipped Cream Cheese", "whipped-cream-cheese", 3.99, "8 oz"],
      ["Cultured Sour Cream", "cultured-sour-cream", 3.49, "16 oz"],
    ],
  },
  {
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Country Sourdough Loaf", "country-sourdough-loaf", 6.49, "loaf"],
      ["Buttery Croissants", "buttery-croissants", 5.99, "4 pack"],
      ["Everything Bagels", "everything-bagels", 4.49, "6 pack"],
      ["Cinnamon Morning Rolls", "cinnamon-morning-rolls", 6.99, "4 pack"],
      ["Whole Wheat Sandwich Bread", "whole-wheat-sandwich-bread", 4.99, "loaf"],
      ["Blueberry Muffins", "blueberry-muffins", 5.49, "4 pack"],
      ["Soft Flour Tortillas", "soft-flour-tortillas", 3.99, "10 pack"],
      ["Rustic Baguette", "rustic-baguette", 3.49, "each"],
    ],
  },
  {
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Extra Virgin Olive Oil", "extra-virgin-olive-oil", 12.99, "16.9 oz"],
      ["Organic Fusilli Pasta", "organic-fusilli-pasta", 3.49, "16 oz"],
      ["San Marzano Tomatoes", "san-marzano-tomatoes", 4.29, "28 oz"],
      ["Creamy Almond Butter", "creamy-almond-butter", 8.49, "12 oz"],
      ["Pure Clover Honey", "pure-clover-honey", 6.99, "12 oz"],
      ["Jasmine Rice", "jasmine-rice", 7.49, "2 lb"],
      ["Old-Fashioned Oats", "old-fashioned-oats", 5.49, "18 oz"],
      ["Black Beans", "black-beans", 1.99, "15 oz"],
    ],
  },
  {
    category: "Frozen",
    image: "https://images.unsplash.com/photo- frozen-food?auto=format&fit=crop&w=1000&q=85".replace("photo- frozen-food", "photo- frozen-food"),
    items: [
      ["Wild Blueberries", "wild-blueberries", 6.49, "12 oz"],
      ["Peas & Sweet Corn", "peas-sweet-corn", 3.49, "12 oz"],
      ["Spinach & Ricotta Ravioli", "spinach-ricotta-ravioli", 8.49, "12 oz"],
      ["Margherita Pizza", "margherita-pizza", 9.99, "12 inch"],
      ["Mango Sorbet", "mango-sorbet", 6.99, "pint"],
      ["Crispy Potato Wedges", "crispy-potato-wedges", 4.49, "20 oz"],
      ["Vegetable Dumplings", "vegetable-dumplings", 7.49, "12 oz"],
      ["Chocolate Chip Cookie Dough", "chocolate-chip-cookie-dough", 5.99, "16 oz"],
    ],
  },
  {
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Freshly Squeezed Orange Juice", "fresh-orange-juice", 6.49, "32 oz"],
      ["Sparkling Mineral Water", "sparkling-mineral-water", 5.99, "8 pack"],
      ["Cold Brew Coffee", "cold-brew-coffee", 6.99, "32 oz"],
      ["Matcha Green Tea", "matcha-green-tea", 7.49, "12 oz"],
      ["Ginger Lemon Kombucha", "ginger-lemon-kombucha", 3.99, "16 oz"],
      ["Cranberry Juice", "cranberry-juice", 4.49, "32 oz"],
      ["Classic Black Tea", "classic-black-tea", 5.49, "20 bags"],
      ["Coconut Water", "coconut-water", 3.49, "16 oz"],
    ],
  },
  {
    category: "Household Essentials",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1000&q=85",
    items: [
      ["Plant-Based Dish Soap", "plant-based-dish-soap", 5.49, "16 oz"],
      ["Recycled Paper Towels", "recycled-paper-towels", 8.99, "2 rolls"],
      ["Free & Clear Laundry Detergent", "free-clear-laundry-detergent", 12.99, "32 loads"],
      ["Compostable Kitchen Bags", "compostable-kitchen-bags", 9.49, "30 bags"],
      ["All-Purpose Cleaner", "all-purpose-cleaner", 6.49, "24 oz"],
      ["Soft Facial Tissues", "soft-facial-tissues", 4.99, "3 boxes"],
      ["Natural Hand Soap", "natural-hand-soap", 4.49, "12 oz"],
      ["Recycled Napkins", "recycled-napkins", 3.99, "100 count"],
    ],
  },
];

export const groceryCategories = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];

export const groceryProducts: GroceryProduct[] = collections.flatMap((collection) =>
  collection.items.map(([name, slug, price, unit]) => ({
    slug,
    name,
    category: collection.category,
    price,
    unit,
    description: `${name}, selected for everyday meals and good things around the table. Product availability and details are simulated for this demo catalog.`,
    image: collection.image,
  })),
);

export function findGroceryProduct(slug: string) {
  return groceryProducts.find((product) => product.slug === slug);
}

export type GroceryCartLine = { slug: string; quantity: number };
export const groceryCartStorageKey = "aaa-grocery-cart";
export const groceryOrdersStorageKey = "aaa-grocery-orders";

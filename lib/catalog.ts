export type Product = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
};

const photos = {
  produce: "photo-1542838132-92c53300491e",
  meat: "photo-1607623814075-e51df1bdc82f",
  dairy: "photo-1628088062854-d1870b4553da",
  bakery: "photo-1509440159596-0249088772ff",
  pantry: "photo-1584473457409-ae5c91d7d1b3",
  frozen: "photo-1570197788417-0e82375c9371",
  beverages: "photo-1544145945-f90425340c7e",
  household: "photo-1583947215259-38e31be8751f",
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

function makeProducts(category: string, imageId: string, rows: [string, string, number, string, string[]][]): Product[] {
  return rows.map(([slug, name, price, unit, tags]) => ({
    slug,
    name,
    price,
    unit,
    category,
    tags,
    image: image(imageId),
    description: `${name}, selected as a fresh sample for your neighborhood grocery basket. Product details, availability, and pricing are simulated for this demo.`,
  }));
}

export const categories = [
  "Produce",
  "Meat & Seafood",
  "Dairy",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household Essentials",
];

export const products: Product[] = [
  ...makeProducts("Produce", photos.produce, [
    ["organic-bananas", "Organic Bananas", 1.29, "per lb", ["Organic", "Vegan"]],
    ["honeycrisp-apples", "Honeycrisp Apples", 2.49, "per lb", ["Gluten-free", "Vegan"]],
    ["avocados", "Ripe Hass Avocados", 1.50, "each", ["Vegan"]],
    ["baby-spinach", "Baby Spinach", 3.49, "5 oz bag", ["Organic", "Vegan"]],
    ["strawberries", "Fresh Strawberries", 4.99, "1 lb pack", ["Vegan"]],
    ["blueberries", "Blueberries", 4.49, "6 oz pack", ["Vegan"]],
    ["roma-tomatoes", "Roma Tomatoes", 1.99, "per lb", ["Vegan"]],
    ["english-cucumber", "English Cucumber", 1.79, "each", ["Vegan"]],
  ]),
  ...makeProducts("Meat & Seafood", photos.meat, [
    ["chicken-breast", "Boneless Chicken Breast", 8.99, "per lb", ["Gluten-free"]],
    ["ground-turkey", "Lean Ground Turkey", 6.49, "16 oz pack", ["Gluten-free"]],
    ["salmon-fillet", "Atlantic Salmon Fillet", 12.99, "per lb", ["Gluten-free"]],
    ["ground-beef", "Ground Beef 90% Lean", 7.99, "per lb", ["Gluten-free"]],
    ["pork-chops", "Center Cut Pork Chops", 6.99, "per lb", ["Gluten-free"]],
    ["wild-shrimp", "Wild-Caught Shrimp", 10.99, "12 oz pack", ["Gluten-free"]],
    ["italian-sausage", "Italian Chicken Sausage", 5.99, "12 oz pack", []],
    ["cod-fillets", "Pacific Cod Fillets", 9.49, "per lb", ["Gluten-free"]],
  ]),
  ...makeProducts("Dairy", photos.dairy, [
    ["whole-milk", "Whole Milk", 4.29, "half gallon", []],
    ["oat-milk", "Unsweetened Oat Milk", 4.49, "half gallon", ["Vegan"]],
    ["greek-yogurt", "Plain Greek Yogurt", 5.49, "32 oz tub", []],
    ["salted-butter", "Creamy Salted Butter", 4.99, "16 oz", []],
    ["sharp-cheddar", "Sharp Cheddar Cheese", 4.79, "8 oz block", []],
    ["free-range-eggs", "Free-Range Large Eggs", 5.49, "dozen", []],
    ["cottage-cheese", "Cottage Cheese", 3.99, "16 oz tub", []],
    ["parmesan", "Shaved Parmesan", 5.99, "5 oz tub", []],
  ]),
  ...makeProducts("Bakery", photos.bakery, [
    ["sourdough-loaf", "Country Sourdough Loaf", 6.49, "loaf", ["Vegan"]],
    ["everything-bagels", "Everything Bagels", 4.99, "6 count", ["Vegan"]],
    ["buttery-croissants", "Butter Croissants", 5.49, "4 count", []],
    ["whole-wheat-bread", "Whole Wheat Sandwich Bread", 4.29, "loaf", ["Vegan"]],
    ["blueberry-muffins", "Blueberry Muffins", 5.99, "4 count", []],
    ["flour-tortillas", "Soft Flour Tortillas", 3.49, "10 count", ["Vegan"]],
    ["dinner-rolls", "Soft Dinner Rolls", 3.99, "8 count", []],
    ["cinnamon-raisin-bread", "Cinnamon Raisin Bread", 5.29, "loaf", ["Vegan"]],
  ]),
  ...makeProducts("Pantry", photos.pantry, [
    ["rolled-oats", "Old-Fashioned Rolled Oats", 4.49, "18 oz", ["Vegan"]],
    ["jasmine-rice", "Jasmine Rice", 6.99, "2 lb bag", ["Gluten-free", "Vegan"]],
    ["penne-pasta", "Penne Rigate", 2.49, "16 oz", ["Vegan"]],
    ["marinara-sauce", "Classic Marinara Sauce", 4.29, "24 oz jar", ["Vegan"]],
    ["black-beans", "Black Beans", 1.49, "15 oz can", ["Vegan", "Gluten-free"]],
    ["peanut-butter", "Creamy Peanut Butter", 4.99, "16 oz jar", ["Vegan"]],
    ["extra-virgin-olive-oil", "Extra Virgin Olive Oil", 11.99, "16.9 oz bottle", ["Vegan"]],
    ["maple-syrup", "Pure Maple Syrup", 8.49, "12 oz bottle", ["Vegan"]],
  ]),
  ...makeProducts("Frozen", photos.frozen, [
    ["frozen-blueberries", "Frozen Wild Blueberries", 5.99, "12 oz bag", ["Vegan"]],
    ["peas-carrots", "Peas & Carrots", 2.99, "12 oz bag", ["Vegan", "Gluten-free"]],
    ["veggie-pizza", "Roasted Veggie Pizza", 8.99, "12 inch", ["Vegetarian"]],
    ["vanilla-ice-cream", "Vanilla Bean Ice Cream", 6.49, "1 pint", []],
    ["frozen-mango", "Frozen Mango Chunks", 4.99, "16 oz bag", ["Vegan"]],
    ["chicken-dumplings", "Chicken Dumplings", 7.49, "16 oz bag", []],
    ["frozen-broccoli", "Cut Broccoli Florets", 3.49, "12 oz bag", ["Vegan"]],
    ["berry-sorbet", "Mixed Berry Sorbet", 5.99, "1 pint", ["Vegan"]],
  ]),
  ...makeProducts("Beverages", photos.beverages, [
    ["sparkling-water", "Lime Sparkling Water", 5.99, "8 pack", ["Vegan"]],
    ["cold-brew", "Smooth Cold Brew Coffee", 6.49, "32 oz bottle", ["Vegan"]],
    ["orange-juice", "Fresh Orange Juice", 5.49, "half gallon", ["Vegan"]],
    ["green-tea", "Jasmine Green Tea", 4.99, "20 tea bags", ["Vegan"]],
    ["coconut-water", "Pure Coconut Water", 3.49, "1 liter", ["Vegan"]],
    ["lemonade", "Homestyle Lemonade", 4.29, "half gallon", ["Vegan"]],
    ["ground-coffee", "House Blend Coffee", 10.99, "12 oz bag", ["Vegan"]],
    ["apple-juice", "Cloudy Apple Juice", 4.49, "32 oz bottle", ["Vegan"]],
  ]),
  ...makeProducts("Household Essentials", photos.household, [
    ["paper-towels", "Recycled Paper Towels", 8.99, "6 rolls", ["Recycled"]],
    ["dish-soap", "Plant-Based Dish Soap", 4.99, "16 oz bottle", ["Plant-based"]],
    ["laundry-detergent", "Free & Clear Laundry Detergent", 12.99, "32 loads", ["Fragrance-free"]],
    ["compost-bags", "Compostable Kitchen Bags", 7.49, "30 count", ["Compostable"]],
    ["all-purpose-cleaner", "All-Purpose Cleaner", 5.49, "24 oz bottle", ["Plant-based"]],
    ["bath-tissue", "Soft Bath Tissue", 9.99, "12 rolls", ["Recycled"]],
    ["sponges", "Cellulose Kitchen Sponges", 3.99, "3 count", ["Plant-based"]],
    ["hand-soap", "Gentle Hand Soap", 4.49, "12 oz bottle", ["Plant-based"]],
  ]),
];

export function findProduct(slug: string | string[] | undefined): Product | undefined {
  const value = Array.isArray(slug) ? slug[0] : slug;
  return products.find((product) => product.slug === value);
}

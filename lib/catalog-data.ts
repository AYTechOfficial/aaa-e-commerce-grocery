export type GroceryProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  tags: string[];
  image: string;
};

const categoryImages: Record<string, string> = {
  Produce: "photo-1542838132-92c53300491e",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  Dairy: "photo-1550583724-b2692b85b150",
  Bakery: "photo-1509440159596-0249088772ff",
  Pantry: "photo-1606787366850-de6330128bfc",
  Frozen: "photo- frozen",
  Beverages: "photo- beverage",
  "Household Essentials": "photo- household",
};

const photoOverrides: Record<string, string> = {
  Frozen: "photo-1570197788417-0e82375c9371",
  Beverages: "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1585421514284-efb74c2b69ba",
};

const entries: Array<[string, string, number, string, string, string[]]> = [
  ["Produce", "Organic strawberries", 5.49, "1 lb basket", "Sweet, fragrant berries picked at peak ripeness.", ["Organic", "Vegan"]],
  ["Produce", "Honeycrisp apples", 1.29, "each", "Crisp apples with a bright sweetness and gentle tartness.", ["Vegan"]],
  ["Produce", "Avocados", 1.49, "each", "Creamy, ready-to-enjoy avocados.", ["Vegan"]],
  ["Produce", "Baby spinach", 3.99, "5 oz clamshell", "Tender baby spinach, washed and ready to use.", ["Organic", "Vegan"]],
  ["Produce", "Rainbow carrots", 2.99, "1 lb bunch", "Colorful, crisp carrots for snacking or roasting.", ["Vegan"]],
  ["Produce", "Lemons", 0.79, "each", "Bright, juicy lemons for cooking and drinks.", ["Vegan"]],
  ["Produce", "English cucumber", 1.99, "each", "Cool and crunchy with tender skin.", ["Vegan"]],
  ["Produce", "Cherry tomatoes", 3.49, "1 pint", "Juicy little tomatoes with a garden-fresh flavor.", ["Vegan"]],
  ["Meat & Seafood", "Chicken breast", 8.99, "1 lb", "Boneless, skinless chicken breast, simply versatile.", ["Gluten-free"]],
  ["Meat & Seafood", "Ground beef", 7.49, "1 lb", "Fresh ground beef for weeknight favorites.", ["Gluten-free"]],
  ["Meat & Seafood", "Atlantic salmon fillet", 12.99, "12 oz", "Responsibly sourced salmon with a rich, buttery finish.", ["Gluten-free"]],
  ["Meat & Seafood", "Pork tenderloin", 9.99, "1 lb", "Lean, tender pork that is easy to roast or grill.", ["Gluten-free"]],
  ["Meat & Seafood", "Ground turkey", 6.99, "1 lb", "A lean, mild favorite for burgers and sauces.", ["Gluten-free"]],
  ["Meat & Seafood", "Wild shrimp", 11.49, "12 oz", "Peeled and deveined shrimp, ready for a quick meal.", ["Gluten-free"]],
  ["Meat & Seafood", "Italian chicken sausage", 6.49, "4 links", "Savory chicken sausage seasoned with herbs.", ["Gluten-free"]],
  ["Meat & Seafood", "Beef stew meat", 8.49, "1 lb", "Tender-cut beef for slow-cooked comfort food.", ["Gluten-free"]],
  ["Dairy", "Whole milk", 4.29, "half gallon", "Creamy, locally sourced whole milk.", ["Gluten-free"]],
  ["Dairy", "Greek yogurt", 5.49, "32 oz", "Thick, tangy yogurt with a satisfying protein boost.", ["Gluten-free"]],
  ["Dairy", "Salted butter", 4.99, "1 lb", "Rich butter for baking, cooking, and toast.", ["Gluten-free"]],
  ["Dairy", "Sharp cheddar", 5.99, "8 oz block", "Aged cheddar with a bold, balanced bite.", ["Gluten-free"]],
  ["Dairy", "Free-range eggs", 5.49, "dozen", "Farm-fresh large brown eggs.", ["Gluten-free"]],
  ["Dairy", "Oat milk", 4.49, "half gallon", "Smooth, creamy oat milk for coffee and cereal.", ["Vegan"]],
  ["Dairy", "Shredded mozzarella", 4.29, "8 oz", "Mild, melty mozzarella for pizza and pasta.", ["Gluten-free"]],
  ["Dairy", "Cottage cheese", 3.99, "16 oz", "Creamy cottage cheese with a fresh, mild flavor.", ["Gluten-free"]],
  ["Bakery", "Sourdough loaf", 6.49, "1 loaf", "Crusty artisan sourdough with a tender center.", ["Vegetarian"]],
  ["Bakery", "Everything bagels", 4.99, "6 count", "Chewy bagels topped with a savory seed blend.", ["Vegetarian"]],
  ["Bakery", "Butter croissants", 6.99, "4 count", "Flaky, golden croissants made with real butter.", ["Vegetarian"]],
  ["Bakery", "Whole wheat sandwich bread", 4.49, "1 loaf", "Soft whole-grain slices for everyday sandwiches.", ["Vegan"]],
  ["Bakery", "Blueberry muffins", 5.99, "4 count", "Bakery-style muffins bursting with blueberries.", ["Vegetarian"]],
  ["Bakery", "Flour tortillas", 3.49, "10 count", "Soft, flexible tortillas for wraps and tacos.", ["Vegan"]],
  ["Bakery", "Chocolate chip cookies", 5.49, "8 count", "Small-batch cookies with plenty of chocolate chips.", ["Vegetarian"]],
  ["Bakery", "Dinner rolls", 4.99, "12 count", "Soft, golden rolls ready for the dinner table.", ["Vegetarian"]],
  ["Pantry", "Rolled oats", 4.29, "18 oz", "Whole-grain oats for a warm breakfast or baking.", ["Vegan"]],
  ["Pantry", "Extra virgin olive oil", 11.99, "16.9 fl oz", "Fragrant olive oil for dressings and everyday cooking.", ["Vegan"]],
  ["Pantry", "Basmati rice", 6.49, "2 lb bag", "Long-grain rice with a delicate aroma.", ["Vegan"]],
  ["Pantry", "Black beans", 1.79, "15 oz can", "Hearty black beans, ready to heat and serve.", ["Vegan"]],
  ["Pantry", "Penne pasta", 2.49, "1 lb", "Durum wheat pasta that holds sauce beautifully.", ["Vegan"]],
  ["Pantry", "Marinara sauce", 4.49, "24 oz jar", "Slow-simmered tomato sauce with Italian herbs.", ["Vegan"]],
  ["Pantry", "Creamy peanut butter", 4.99, "16 oz", "Roasted peanuts blended into a smooth spread.", ["Vegan"]],
  ["Pantry", "Maple syrup", 9.99, "12 fl oz", "Pure maple syrup with a warm, rich sweetness.", ["Vegan"]],
  ["Frozen", "Wild blueberry blend", 6.99, "16 oz", "Frozen berries for smoothies, oatmeal, and baking.", ["Vegan"]],
  ["Frozen", "Peas and carrots", 2.99, "12 oz", "A convenient mix of sweet peas and tender carrots.", ["Vegan"]],
  ["Frozen", "Margherita pizza", 8.49, "14 oz", "Stone-baked crust with tomato, mozzarella, and basil.", ["Vegetarian"]],
  ["Frozen", "Vanilla ice cream", 6.49, "1 pint", "Classic vanilla ice cream made with fresh cream.", ["Vegetarian"]],
  ["Frozen", "Cauliflower florets", 3.99, "16 oz", "Flash-frozen florets, ready for roasting or steaming.", ["Vegan"]],
  ["Frozen", "Veggie dumplings", 7.49, "12 oz", "Savory vegetable dumplings for an easy meal.", ["Vegan"]],
  ["Frozen", "Waffle fries", 4.49, "20 oz", "Crispy, golden waffle-cut potatoes.", ["Vegan"]],
  ["Frozen", "Mango chunks", 5.99, "16 oz", "Sweet frozen mango pieces for smoothies and snacks.", ["Vegan"]],
  ["Beverages", "Sparkling water", 5.99, "8 pack", "Crisp sparkling water with a clean, refreshing finish.", ["Vegan"]],
  ["Beverages", "Cold brew coffee", 5.49, "32 fl oz", "Smooth, slow-steeped coffee, ready to pour over ice.", ["Vegan"]],
  ["Beverages", "Orange juice", 5.99, "52 fl oz", "Bright, refreshing orange juice with no added sugar.", ["Vegan"]],
  ["Beverages", "Green tea", 4.49, "20 bags", "A gentle, grassy cup for any time of day.", ["Vegan"]],
  ["Beverages", "Lemon ginger kombucha", 3.49, "16 fl oz", "A lively fermented tea with citrus and ginger.", ["Vegan"]],
  ["Beverages", "Almond milk", 3.99, "half gallon", "Light, smooth almond milk for cereal and coffee.", ["Vegan"]],
  ["Beverages", "Apple cider", 4.99, "half gallon", "Aromatic apple cider with a crisp orchard flavor.", ["Vegan"]],
  ["Beverages", "Coconut water", 3.49, "1 liter", "Lightly sweet coconut water for a refreshing sip.", ["Vegan"]],
  ["Household Essentials", "Dish soap", 4.99, "16 fl oz", "Plant-derived dish soap with a fresh citrus scent.", ["Household"]],
  ["Household Essentials", "Paper towels", 8.49, "6 rolls", "Absorbent everyday paper towels for quick cleanups.", ["Household"]],
  ["Household Essentials", "Laundry detergent", 12.99, "50 fl oz", "A concentrated detergent for everyday laundry.", ["Household"]],
  ["Household Essentials", "Kitchen trash bags", 7.49, "30 count", "Strong drawstring bags for your kitchen bin.", ["Household"]],
  ["Household Essentials", "All-purpose cleaner", 5.49, "24 fl oz", "A versatile cleaner for common household surfaces.", ["Household"]],
  ["Household Essentials", "Bathroom tissue", 9.99, "12 rolls", "Soft, dependable tissue for everyday use.", ["Household"]],
  ["Household Essentials", "Reusable storage bags", 6.99, "6 count", "Washable bags for storing snacks and leftovers.", ["Household"]],
  ["Household Essentials", "Sponges", 3.49, "4 count", "Durable scrub sponges for dishes and kitchen surfaces.", ["Household"]],
];

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

export const products: GroceryProduct[] = entries.map(([category, name, price, unit, description, tags]) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const photo = photoOverrides[category] ?? categoryImages[category];
  return {
    slug,
    name,
    category,
    price,
    unit,
    description,
    tags,
    image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=80`,
  };
});

export function findProduct(slug: string): GroceryProduct | undefined {
  return products.find((product) => product.slug === slug);
}

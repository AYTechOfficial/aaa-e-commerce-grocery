export type Category = "Produce" | "Meat & Seafood" | "Dairy" | "Bakery" | "Pantry" | "Frozen" | "Beverages" | "Household Essentials";

export type Product = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  description: string;
  image: string;
  tags: string[];
  ingredients: string;
};

export const categories: Category[] = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Pantry", "Frozen", "Beverages", "Household Essentials"];

const photo: Record<Category, string> = {
  "Produce": "photo-1542838132-92c53300491e",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  "Dairy": "photo-1628088062854-d1870b4553da",
  "Bakery": "photo-1509440159596-0249088772ff",
  "Pantry": "photo-1606787366850-de6330128bfc",
  "Frozen": "photo- frozen",
  "Beverages": "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1583947215259-38e31be8751f",
};

const entries: [Category, string, number, string, string, string[]][] = [
  ["Produce", "Honeycrisp Apples", 4.49, "per 2 lb bag", "Crisp, sweet apples picked at their seasonal best.", ["Vegan", "Gluten-free"]],
  ["Produce", "Organic Baby Spinach", 3.99, "5 oz clamshell", "Tender organic leaves, washed and ready for salads or sautés.", ["Organic", "Vegan"]],
  ["Produce", "Avocados", 2.49, "each", "Creamy, ready-to-enjoy avocados.", ["Vegan", "Gluten-free"]],
  ["Produce", "Heirloom Tomatoes", 4.99, "per 1 lb", "Juicy, colorful tomatoes with a naturally rich flavor.", ["Vegan"]],
  ["Produce", "English Cucumber", 2.29, "each", "Cool, crisp cucumber with tender skin.", ["Vegan", "Gluten-free"]],
  ["Produce", "Sweet Strawberries", 5.49, "1 lb carton", "A fragrant carton of bright, sweet berries.", ["Vegan"]],
  ["Produce", "Rainbow Carrots", 3.49, "1 lb bunch", "A colorful bunch of naturally sweet carrots.", ["Vegan", "Gluten-free"]],
  ["Produce", "Lemons", 3.29, "per 4", "Bright, zesty lemons for cooking and fresh drinks.", ["Vegan", "Gluten-free"]],
  ["Meat & Seafood", "Free-Range Chicken Breast", 9.99, "per 1 lb", "Lean, thoughtfully raised chicken breast.", ["Raised without antibiotics"]],
  ["Meat & Seafood", "Ground Beef, 85% Lean", 7.99, "per 1 lb", "Versatile ground beef, freshly packed.", []],
  ["Meat & Seafood", "Atlantic Salmon Fillet", 12.99, "per portion", "Rich, flaky salmon, ideal for a quick weeknight dinner.", ["Responsibly sourced"]],
  ["Meat & Seafood", "Pork Tenderloin", 8.49, "per 1 lb", "A tender, lean cut that roasts beautifully.", []],
  ["Meat & Seafood", "Ground Turkey", 6.49, "per 1 lb", "A lighter, versatile staple for tacos and more.", []],
  ["Meat & Seafood", "Wild-Caught Shrimp", 10.99, "12 oz bag", "Peeled and deveined shrimp, frozen at peak freshness.", ["Wild-caught"]],
  ["Meat & Seafood", "厚-Cut Bacon", 6.99, "12 oz pack", "Smoky, thick-cut bacon for brunch or dinner.", []],
  ["Meat & Seafood", "Italian Chicken Sausage", 5.99, "12 oz pack", "Savory chicken sausage with classic Italian herbs.", []],
  ["Dairy", "Whole Milk", 4.19, "half gallon", "Creamy, locally sourced whole milk.", []],
  ["Dairy", "Creamy Greek Yogurt", 5.49, "32 oz tub", "Thick, tangy plain Greek yogurt with live cultures.", ["High protein"]],
  ["Dairy", "Salted Butter", 4.99, "1 lb pack", "Rich, creamy butter for cooking and spreading.", []],
  ["Dairy", "Sharp Cheddar", 5.29, "8 oz block", "Aged cheddar with a bold, satisfying bite.", []],
  ["Dairy", "Free-Range Large Eggs", 5.49, "dozen", "Farm-fresh eggs from free-range hens.", ["Free-range"]],
  ["Dairy", "Oat Milk", 4.79, "half gallon", "Smooth, creamy oat milk made for coffee and cereal.", ["Dairy-free", "Vegan"]],
  ["Dairy", "Whipped Cream Cheese", 3.99, "8 oz tub", "Light, spreadable cream cheese for bagels and dips.", []],
  ["Dairy", "Shredded Mozzarella", 4.49, "8 oz bag", "Mild, melty mozzarella, ready for pizza night.", []],
  ["Bakery", "Sourdough Country Loaf", 6.49, "loaf", "Slow-fermented loaf with a crisp crust and tender crumb.", ["Vegan"]],
  ["Bakery", "Butter Croissants", 5.99, "4 pack", "Flaky, golden croissants made with real butter.", []],
  ["Bakery", "Everything Bagels", 4.99, "6 pack", "Chewy bagels with a savory everything topping.", []],
  ["Bakery", "Blueberry Muffins", 5.49, "4 pack", "Soft-baked muffins bursting with blueberries.", []],
  ["Bakery", "Whole Wheat Sandwich Bread", 4.29, "loaf", "A soft, hearty everyday loaf made with whole wheat.", ["Whole grain"]],
  ["Bakery", "Cinnamon Rolls", 6.99, "4 pack", "Pillowy cinnamon rolls finished with sweet icing.", []],
  ["Bakery", "Chocolate Chip Cookies", 5.99, "6 pack", "Small-batch cookies with generous chocolate chips.", []],
  ["Bakery", "Flour Tortillas", 3.79, "10 pack", "Soft, flexible tortillas for wraps and tacos.", []],
  ["Pantry", "Extra Virgin Olive Oil", 12.99, "500 ml bottle", "Bright, balanced olive oil for everyday cooking.", ["Vegan"]],
  ["Pantry", "Organic Rolled Oats", 5.49, "18 oz bag", "Whole-grain oats for a warm, nourishing breakfast.", ["Organic", "Vegan"]],
  ["Pantry", "Penne Rigate", 2.49, "1 lb box", "Bronze-cut pasta that holds sauce beautifully.", ["Vegan"]],
  ["Pantry", "San Marzano Tomatoes", 3.99, "28 oz can", "Sweet, whole peeled tomatoes for rich sauces.", ["Vegan"]],
  ["Pantry", "Creamy Peanut Butter", 4.99, "16 oz jar", "Roasted peanuts blended into a smooth spread.", ["Vegan", "Gluten-free"]],
  ["Pantry", "Jasmine Rice", 6.49, "2 lb bag", "Fragrant long-grain rice with a soft, fluffy texture.", ["Vegan", "Gluten-free"]],
  ["Pantry", "Black Beans", 1.79, "15 oz can", "Hearty, ready-to-use black beans.", ["Vegan", "Gluten-free"]],
  ["Pantry", "Pure Maple Syrup", 9.99, "12 oz bottle", "Amber maple syrup with a smooth, clean finish.", ["Vegan"]],
  ["Frozen", "Wild Blueberries", 6.49, "16 oz bag", "Frozen wild blueberries, picked and packed at peak ripeness.", ["Vegan"]],
  ["Frozen", "Sweet Peas", 2.99, "12 oz bag", "Tender green peas frozen to keep their fresh-picked taste.", ["Vegan"]],
  ["Frozen", "Margherita Pizza", 8.99, "12 inch pizza", "A crisp crust topped with tomato, mozzarella, and basil.", []],
  ["Frozen", "Vanilla Bean Ice Cream", 6.99, "pint", "Creamy vanilla ice cream made with real vanilla.", []],
  ["Frozen", "Vegetable Dumplings", 7.49, "12 oz bag", "Savory vegetable dumplings, ready for a quick pan-fry.", ["Vegetarian"]],
  ["Frozen", "Mango Chunks", 5.49, "16 oz bag", "Sweet mango pieces for smoothies and snacks.", ["Vegan", "Gluten-free"]],
  ["Frozen", "Hash Brown Patties", 4.49, "10 pack", "Crispy-on-the-outside potato patties for breakfast.", ["Vegan"]],
  ["Frozen", "Spinach & Feta Pie", 7.99, "9 oz pie", "Flaky pastry filled with spinach and tangy feta.", ["Vegetarian"]],
  ["Beverages", "Sparkling Mineral Water", 5.99, "8 cans", "Bright, refreshing bubbles with no added flavors.", ["Zero sugar"]],
  ["Beverages", "Cold Brew Coffee", 5.49, "32 oz bottle", "Smooth-steeped coffee with a rich, mellow finish.", ["Dairy-free"]],
  ["Beverages", "Fresh Orange Juice", 6.99, "half gallon", "Bright, gently pasteurized orange juice.", []],
  ["Beverages", "Green Tea", 4.49, "20 tea bags", "Fresh, grassy green tea for a calming cup.", ["Vegan"]],
  ["Beverages", "Ginger Lemon Kombucha", 3.49, "16 oz bottle", "Bright ginger and lemon in a lightly sparkling brew.", ["Vegan"]],
  ["Beverages", "Coconut Water", 4.99, "1 liter carton", "Naturally refreshing coconut water.", ["Vegan"]],
  ["Beverages", "House Blend Coffee", 11.99, "12 oz bag", "A balanced medium roast with cocoa and caramel notes.", ["Whole bean"]],
  ["Beverages", "Raspberry Lemonade", 4.99, "64 oz bottle", "A refreshing blend of tart lemon and ripe raspberry.", []],
  ["Household Essentials", "Recycled Paper Towels", 8.99, "2 rolls", "Strong, absorbent paper towels made with recycled fiber.", ["Recycled"]],
  ["Household Essentials", "Plant-Based Dish Soap", 5.49, "16 oz bottle", "A gentle, effective dish soap with a fresh citrus scent.", ["Plant-based"]],
  ["Household Essentials", "Laundry Detergent", 12.99, "32 loads", "Concentrated detergent for a fresh, clean wash.", []],
  ["Household Essentials", "Compostable Kitchen Bags", 7.99, "30 bags", "Sturdy compostable bags for everyday kitchen cleanup.", ["Compostable"]],
  ["Household Essentials", "All-Purpose Cleaner", 5.99, "24 oz spray", "A plant-derived cleaner for everyday household surfaces.", ["Plant-based"]],
  ["Household Essentials", "Bamboo Facial Tissues", 4.49, "3 boxes", "Soft, gentle tissues made with bamboo fiber.", ["Bamboo fiber"]],
  ["Household Essentials", "Hand Soap Refill", 6.49, "32 oz pouch", "A mild, moisturizing hand soap in a refill pouch.", []],
  ["Household Essentials", "Recycled Sandwich Bags", 4.99, "50 bags", "Convenient resealable bags made with recycled plastic.", ["Recycled"]],
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const products: Product[] = entries.map(([category, name, price, unit, description, tags]) => ({
  slug: slugify(name),
  name,
  price,
  unit,
  category,
  description,
  image: `https://images.unsplash.com/${photo[category]}?auto=format&fit=crop&w=900&q=82`,
  tags,
  ingredients: tags.includes("Vegan") ? "No animal-derived ingredients." : "See product packaging for complete ingredient and allergen information.",
}));

export const findProduct = (slug: string) => products.find((product) => product.slug === slug);
export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

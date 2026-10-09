export const groceryCategories = [
  "Produce",
  "Meat & Seafood",
  "Dairy",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Household Essentials",
] as const;

export type GroceryCategory = (typeof groceryCategories)[number];

export type GroceryProduct = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  category: GroceryCategory;
  description: string;
  image: string;
  tags: string[];
};

const photos: Record<GroceryCategory, string> = {
  Produce: "photo-1540420773420-3366772f4999",
  "Meat & Seafood": "photo-1607623814075-e51df1bdc82f",
  Dairy: "photo-1550583724-b2692b85b150",
  Bakery: "photo-1509440159596-0249088772ff",
  Pantry: "photo-1606787366850-de6330128bfc",
  Frozen: "photo- frozen",
  Beverages: "photo-1544145945-f90425340c7e",
  "Household Essentials": "photo-1583947215259-38e31be8751f",
};

const collections: Array<{
  category: GroceryCategory;
  entries: Array<[string, number, string, string]>;
}> = [
  {
    category: "Produce",
    entries: [
      ["Organic Baby Spinach", 3.49, "5 oz clamshell", "Tender organic leaves, ready for salads and smoothies."],
      ["Honeycrisp Apples", 1.29, "each", "Crisp, sweet apples selected for an easy everyday snack."],
      ["Ripe Avocados", 1.79, "each", "Creamy avocados that are delicious on toast or in a salad."],
      ["Rainbow Carrots", 2.99, "1 lb bunch", "Colorful, sweet carrots with their fresh greens attached."],
      ["English Cucumber", 1.99, "each", "Cool and crisp cucumber for salads, snacks, and sandwiches."],
      ["Blueberries", 4.49, "6 oz pack", "Plump berries with a bright, naturally sweet flavor."],
      ["Roma Tomatoes", 2.49, "1 lb", "Firm, flavorful tomatoes for sauces and fresh salsas."],
      ["Lemons", 0.79, "each", "Juicy lemons to brighten cooking, drinks, and dressings."],
    ],
  },
  {
    category: "Meat & Seafood",
    entries: [
      ["Chicken Breast", 8.99, "per lb", "Boneless, skinless chicken breast, trimmed for weeknight meals."],
      ["Ground Beef 85% Lean", 6.99, "per lb", "Versatile ground beef for burgers, tacos, and family dinners."],
      ["Atlantic Salmon Fillet", 12.99, "per lb", "Rich, flaky salmon portions, great baked or pan-seared."],
      ["Pork Tenderloin", 7.49, "per lb", "A tender, lean cut that roasts beautifully."],
      ["Italian Sausage", 5.99, "1 lb pack", "Seasoned pork sausage, perfect for pasta and sheet-pan meals."],
      ["Large Raw Shrimp", 10.99, "12 oz bag", "Peeled and deveined shrimp, ready for a quick sauté."],
      ["Ground Turkey", 5.49, "1 lb pack", "Lean ground turkey for a lighter take on everyday favorites."],
      ["Chicken Thighs", 4.99, "per lb", "Juicy, boneless chicken thighs that stay tender when roasted."],
    ],
  },
  {
    category: "Dairy",
    entries: [
      ["Whole Milk", 4.29, "half gallon", "Creamy, farm-style whole milk for breakfast and baking."],
      ["Free-Range Large Eggs", 5.49, "dozen", "A dozen large eggs from free-range hens."],
      ["Salted Butter", 4.79, "1 lb box", "Classic creamy butter for toast, cooking, and baking."],
      ["Sharp Cheddar", 4.99, "8 oz block", "Aged cheddar with a savory, satisfyingly sharp finish."],
      ["Plain Greek Yogurt", 5.99, "32 oz tub", "Thick, tangy yogurt with plenty of protein."],
      ["Oat Milk", 4.49, "half gallon", "Smooth, unsweetened oat milk for coffee and cereal."],
      ["Shredded Mozzarella", 3.99, "8 oz bag", "Mild, melty mozzarella for pizza, pasta, and casseroles."],
      ["Vanilla Yogurt Cups", 4.29, "4 pack", "Creamy vanilla yogurt in convenient single-serve cups."],
    ],
  },
  {
    category: "Bakery",
    entries: [
      ["Sourdough Country Loaf", 6.49, "loaf", "A crusty, slow-fermented loaf with a tender center."],
      ["Butter Croissants", 5.99, "4 pack", "Golden, flaky croissants made for a leisurely breakfast."],
      ["Everything Bagels", 4.49, "6 pack", "Chewy bagels topped with a savory everything blend."],
      ["Blueberry Muffins", 5.49, "4 pack", "Soft bakery muffins filled with juicy blueberries."],
      ["Multigrain Sandwich Bread", 4.99, "loaf", "A hearty sliced loaf with a wholesome grain blend."],
      ["Cinnamon Rolls", 6.99, "4 pack", "Soft cinnamon rolls finished with sweet icing."],
      ["French Baguette", 3.49, "each", "A crisp, golden baguette for sharing at the table."],
      ["Chocolate Chip Cookies", 5.99, "6 pack", "Soft-baked cookies with generous chocolate chips."],
    ],
  },
  {
    category: "Pantry",
    entries: [
      ["Extra Virgin Olive Oil", 11.99, "16.9 fl oz", "A fruity, versatile olive oil for cooking and finishing."],
      ["Old-Fashioned Oats", 4.49, "18 oz", "Whole-grain oats for warm breakfasts and homemade baking."],
      ["Organic Penne Pasta", 3.29, "1 lb", "Durum wheat penne that holds sauces beautifully."],
      ["Crushed Tomatoes", 2.49, "28 oz can", "Ripe tomatoes, ready to become a quick homemade sauce."],
      ["Creamy Peanut Butter", 4.99, "16 oz jar", "Smooth, roasted peanut butter for toast and snacks."],
      ["Basmati Rice", 7.49, "2 lb bag", "Fragrant long-grain rice for curries and everyday sides."],
      ["Black Beans", 1.79, "15 oz can", "Hearty black beans, ready to add to soups and bowls."],
      ["Pure Maple Syrup", 9.99, "12 fl oz", "Rich amber maple syrup for pancakes and baking."],
    ],
  },
  {
    category: "Frozen",
    entries: [
      ["Sweet Peas", 2.99, "12 oz bag", "Sweet, tender peas picked at their peak and frozen fresh."],
      ["Wild Blueberries", 5.49, "12 oz bag", "Frozen wild blueberries for smoothies and oatmeal."],
      ["Margherita Pizza", 8.99, "14 oz pizza", "A crisp-baked pizza topped with tomato, basil, and mozzarella."],
      ["Vanilla Ice Cream", 6.49, "pint", "Rich vanilla ice cream made for a simple dessert."],
      ["Frozen Broccoli Florets", 3.49, "12 oz bag", "Convenient broccoli florets, ready for your favorite sides."],
      ["Veggie Dumplings", 7.99, "16 oz bag", "Savory vegetable dumplings for a quick snack or meal."],
      ["Strawberry Smoothie Blend", 5.99, "16 oz bag", "A colorful frozen fruit blend for easy smoothies."],
      ["Hash Brown Patties", 4.29, "10 pack", "Crispy, golden potato patties for breakfast or brunch."],
    ],
  },
  {
    category: "Beverages",
    entries: [
      ["Sparkling Mineral Water", 5.99, "8 pack", "Bright, bubbly mineral water in recyclable cans."],
      ["Cold Brew Coffee", 6.49, "32 fl oz", "Smooth, slow-steeped coffee, ready to pour over ice."],
      ["Fresh Orange Juice", 6.99, "52 fl oz", "Bright citrus juice for a refreshing breakfast."],
      ["Green Tea", 4.49, "20 bags", "A mellow, fragrant green tea for any time of day."],
      ["Ginger Lemon Kombucha", 3.49, "16 fl oz", "Tart lemon and warming ginger in a sparkling brew."],
      ["Coconut Water", 4.99, "1 liter", "Light, refreshing coconut water for an easy pick-me-up."],
      ["Organic Apple Juice", 5.49, "64 fl oz", "A family-size bottle of crisp, naturally sweet apple juice."],
      ["Ground House Coffee", 10.99, "12 oz bag", "A balanced medium roast for a comforting daily cup."],
    ],
  },
  {
    category: "Household Essentials",
    entries: [
      ["Recycled Paper Towels", 8.99, "6 rolls", "Soft, absorbent paper towels made with recycled fiber."],
      ["Dish Soap", 4.49, "24 fl oz", "A fresh-scented dish soap for everyday cleanup."],
      ["Laundry Detergent", 12.99, "64 fl oz", "A concentrated detergent for a bright, clean wash."],
      ["Kitchen Compost Bags", 6.49, "30 count", "Sturdy compostable liners for countertop food scraps."],
      ["Unscented Hand Soap", 3.99, "12 fl oz", "A gentle, fragrance-free hand soap for the whole home."],
      ["All-Purpose Cleaner", 5.99, "28 fl oz", "A dependable cleaner for everyday kitchen surfaces."],
      ["Bamboo Toothbrushes", 7.49, "4 pack", "Everyday toothbrushes with comfortable bamboo handles."],
      ["Facial Tissues", 4.99, "3 boxes", "Soft tissues for home, desk, or bedside."],
    ],
  },
];

export const groceryProducts: GroceryProduct[] = collections.flatMap(({ category, entries }) =>
  entries.map(([name, price, unit, description]) => {
    const slug = name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const photo = photos[category].replace("photo- frozen", "photo-1578662996442-48f60103fc96");
    return {
      slug,
      name,
      price,
      unit,
      category,
      description,
      image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=85`,
      tags: category === "Produce" ? ["Fresh", "Sample item"] : ["Sample item"],
    };
  }),
);

export function findGroceryProduct(slug: string): GroceryProduct | undefined {
  return groceryProducts.find((product) => product.slug === slug);
}

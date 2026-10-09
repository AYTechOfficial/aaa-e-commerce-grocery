export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  tags: string[];
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const entries: Array<[string, string, string, number, string, string[]]> = [
  ['heirloom-tomatoes', 'Heirloom Tomatoes', 'Produce', 4.49, 'per lb', ['Local favorite']],
  ['baby-spinach', 'Baby Spinach', 'Produce', 3.29, '5 oz', ['Vegan']],
  ['avocados', 'Ripe Avocados', 'Produce', 1.49, 'each', ['Vegan']],
  ['fuji-apples', 'Fuji Apples', 'Produce', 2.99, 'per lb', ['Vegan']],
  ['rainbow-carrots', 'Rainbow Carrots', 'Produce', 3.49, '1 bunch', ['Vegan']],
  ['english-cucumbers', 'English Cucumbers', 'Produce', 1.99, 'each', ['Vegan']],
  ['strawberries', 'Organic Strawberries', 'Produce', 5.49, '1 pint', ['Organic']],
  ['lemons', 'Fresh Lemons', 'Produce', 0.79, 'each', ['Vegan']],
  ['chicken-breast', 'Free-Range Chicken Breast', 'Meat & Seafood', 8.99, 'per lb', ['Raised without antibiotics']],
  ['ground-beef', 'Grass-Fed Ground Beef', 'Meat & Seafood', 7.49, 'per lb', ['Grass-fed']],
  ['atlantic-salmon', 'Atlantic Salmon Fillet', 'Meat & Seafood', 12.99, 'per lb', ['Responsibly sourced']],
  ['pork-chops', 'Boneless Pork Chops', 'Meat & Seafood', 6.99, 'per lb', []],
  ['turkey-breast', 'Oven-Ready Turkey Breast', 'Meat & Seafood', 9.49, 'per lb', []],
  ['large-eggs', 'Pasture-Raised Eggs', 'Meat & Seafood', 6.49, '12 count', ['Pasture-raised']],
  ['raw-shrimp', 'Wild-Caught Shrimp', 'Meat & Seafood', 10.99, '1 lb', ['Wild-caught']],
  ['chicken-thighs', 'Boneless Chicken Thighs', 'Meat & Seafood', 6.49, 'per lb', []],
  ['whole-milk', 'Creamy Whole Milk', 'Dairy', 4.29, 'half gallon', []],
  ['greek-yogurt', 'Plain Greek Yogurt', 'Dairy', 5.49, '32 oz', ['High protein']],
  ['sharp-cheddar', 'Sharp Cheddar Cheese', 'Dairy', 4.99, '8 oz', []],
  ['salted-butter', 'European-Style Butter', 'Dairy', 5.29, '8 oz', []],
  ['oat-milk', 'Barista Oat Milk', 'Dairy', 4.49, '32 oz', ['Dairy-free']],
  ['cottage-cheese', 'Small Curd Cottage Cheese', 'Dairy', 3.99, '16 oz', ['High protein']],
  ['fresh-mozzarella', 'Fresh Mozzarella', 'Dairy', 5.99, '8 oz', []],
  ['heavy-cream', 'Heavy Whipping Cream', 'Dairy', 3.79, 'pint', []],
  ['sourdough-loaf', 'Country Sourdough Loaf', 'Bakery', 6.49, 'loaf', ['Naturally leavened']],
  ['butter-croissants', 'Butter Croissants', 'Bakery', 5.99, '4 count', []],
  ['blueberry-muffins', 'Blueberry Muffins', 'Bakery', 5.49, '4 count', []],
  ['bagels', 'Everything Bagels', 'Bakery', 4.49, '6 count', []],
  ['whole-wheat-bread', 'Whole Wheat Sandwich Bread', 'Bakery', 4.29, 'loaf', []],
  ['chocolate-chip-cookies', 'Chocolate Chip Cookies', 'Bakery', 6.49, '6 count', []],
  ['ciabatta-rolls', 'Rustic Ciabatta Rolls', 'Bakery', 4.99, '4 count', []],
  ['cinnamon-rolls', 'Cinnamon Rolls', 'Bakery', 6.99, '4 count', []],
  ['extra-virgin-olive-oil', 'Extra Virgin Olive Oil', 'Pantry', 12.99, '500 ml', []],
  ['penne-pasta', 'Bronze-Cut Penne', 'Pantry', 3.49, '1 lb', []],
  ['marinara-sauce', 'Roasted Garlic Marinara', 'Pantry', 5.49, '24 oz', []],
  ['jasmine-rice', 'Fragrant Jasmine Rice', 'Pantry', 7.99, '2 lb', []],
  ['black-beans', 'Organic Black Beans', 'Pantry', 1.99, '15 oz', ['Organic']],
  ['rolled-oats', 'Old-Fashioned Rolled Oats', 'Pantry', 5.99, '18 oz', []],
  ['maple-syrup', 'Pure Maple Syrup', 'Pantry', 10.99, '8 oz', []],
  ['almond-butter', 'Creamy Almond Butter', 'Pantry', 8.49, '12 oz', []],
  ['vanilla-ice-cream', 'Vanilla Bean Ice Cream', 'Frozen', 6.99, 'pint', []],
  ['frozen-blueberries', 'Wild Blueberries', 'Frozen', 5.49, '12 oz', []],
  ['vegetable-potstickers', 'Vegetable Potstickers', 'Frozen', 7.49, '16 oz', ['Plant-based']],
  ['margherita-pizza', 'Margherita Pizza', 'Frozen', 9.99, '12 inch', []],
  ['frozen-peas', 'Sweet Garden Peas', 'Frozen', 2.99, '12 oz', []],
  ['mango-chunks', 'Frozen Mango Chunks', 'Frozen', 4.99, '16 oz', []],
  ['hash-browns', 'Crispy Hash Brown Patties', 'Frozen', 4.49, '10 count', []],
  ['vegetable-lasagna', 'Roasted Vegetable Lasagna', 'Frozen', 8.99, '24 oz', []],
  ['sparkling-water', 'Lime Sparkling Water', 'Beverages', 5.99, '8 cans', []],
  ['cold-brew-coffee', 'Smooth Cold Brew Coffee', 'Beverages', 6.49, '32 oz', []],
  ['orange-juice', 'Fresh-Squeezed Orange Juice', 'Beverages', 6.99, '32 oz', []],
  ['green-tea', 'Organic Green Tea', 'Beverages', 4.99, '20 bags', ['Organic']],
  ['whole-bean-coffee', 'House Blend Coffee Beans', 'Beverages', 12.99, '12 oz', []],
  ['lemonade', 'Classic Lemonade', 'Beverages', 4.49, 'half gallon', []],
  ['coconut-water', 'Pure Coconut Water', 'Beverages', 3.49, '1 liter', []],
  ['ginger-beer', 'Craft Ginger Beer', 'Beverages', 6.99, '4 bottles', []],
  ['dish-soap', 'Plant-Based Dish Soap', 'Household Essentials', 5.49, '16 oz', []],
  ['paper-towels', 'Recycled Paper Towels', 'Household Essentials', 8.99, '6 rolls', ['Recycled']],
  ['laundry-detergent', 'Gentle Laundry Detergent', 'Household Essentials', 12.49, '32 loads', []],
  ['kitchen-sponges', 'Compostable Kitchen Sponges', 'Household Essentials', 4.99, '3 count', ['Compostable']],
  ['all-purpose-cleaner', 'Citrus All-Purpose Cleaner', 'Household Essentials', 6.49, '24 oz', []],
  ['bath-tissue', 'Soft Recycled Bath Tissue', 'Household Essentials', 9.49, '6 rolls', ['Recycled']],
  ['food-storage-bags', 'Reusable Food Storage Bags', 'Household Essentials', 7.99, '5 count', ['Reusable']],
  ['hand-soap', 'Botanical Hand Soap', 'Household Essentials', 5.99, '12 oz', []],
];

const categoryPhotos: Record<string, string> = {
  Produce: photo('photo-1540420773420-3366772f4999'),
  'Meat & Seafood': photo('photo-1607623814075-e51df1bdc82f'),
  Dairy: photo('photo-1550583724-b2692b85b150'),
  Bakery: photo('photo-1509440159596-0249088772ff'),
  Pantry: photo('photo-1547592180-85f173990554'),
  Frozen: photo('photo- frozen'),
  Beverages: photo('photo-1513558161293-cdaf765edfd7'),
  'Household Essentials': photo('photo-1556228578-0d85b1a4d571'),
};

export const categories = ['Produce', 'Meat & Seafood', 'Dairy', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Household Essentials'];

export const products: Product[] = entries.map(([slug, name, category, price, unit, tags]) => ({
  slug,
  name,
  category,
  price,
  unit,
  tags,
  image: categoryPhotos[category],
  description: `${name}, selected for everyday freshness and quality. This is a sample catalog item; availability and pricing are simulated for this demo.`,
}));

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

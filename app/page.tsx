'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { readLocal, writeLocal } from '@/lib/persist';
import { Badge, Button, Card } from '@/components/ui';

type RecordItem = { id: string; title: string; notes: string; createdAt: string };
type Product = { slug: string; name: string; category: string; price: number; unit: string; image: string; description: string; tag?: string };

const STORAGE_KEY = 'lastmile:aaa-e-commerce-grocery:Product (static sample catalog)';
const categories = ['All', 'Produce', 'Meat & seafood', 'Dairy', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Household'];
const categoryImages: Record<string, string> = {
  Produce: 'photo-1542838132-92c53300491e',
  'Meat & seafood': 'photo-1607623814075-e51df1bdc82f',
  Dairy: 'photo-1550583724-b2692b85b150',
  Bakery: 'photo-1509440159596-0249088772ff',
  Pantry: 'photo-1604908176997-125f25cc6f3d',
  Frozen: 'photo- frozen',
  Beverages: 'photo-1544145945-f90425340c7e',
  Household: 'photo-1583947215259-38e31be8751f',
};
const imageOverrides: Record<string, string> = {
  'photo- frozen': 'photo- frozen',
};

const catalog: Product[] = [
  ...[
    ['Organic avocados', 2.49, 'each', 'Ripe, creamy Hass avocados, ready for toast or tacos.', 'Organic'],
    ['Honeycrisp apples', 4.99, '3 lb bag', 'Crisp, sweet apples picked for a satisfying crunch.'],
    ['Baby spinach', 3.49, '5 oz', 'Tender, washed leaves for salads and quick sautés.'],
    ['Strawberries', 4.29, '1 lb', 'Bright, juicy berries from the season’s sample selection.'],
    ['Rainbow carrots', 2.99, '1 bunch', 'Colorful, naturally sweet carrots with their greens.'],
    ['English cucumber', 1.79, 'each', 'Cool, crisp cucumber with a thin, seed-light skin.'],
    ['Cherry tomatoes', 3.99, '1 pint', 'Sweet little tomatoes for snacking and salads.'],
    ['Lemons', 3.49, '2 lb bag', 'Fresh lemons for brightening meals and drinks.'],
  ].map(([name, price, unit, description, tag]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), tag: tag ? String(tag) : undefined, category: 'Produce', slug: slugify(String(name)), image: categoryImages.Produce })),
  ...[
    ['Atlantic salmon fillet', 12.99, 'per lb', 'Responsibly sourced sample fillet, rich and tender.'],
    ['Chicken breast', 8.49, 'per lb', 'Boneless, skinless chicken breast for weeknight dinners.'],
    ['Ground beef 85% lean', 7.99, '1 lb', 'Everyday ground beef, freshly packed for this sample catalog.'],
    ['Pork tenderloin', 9.99, 'per lb', 'Lean, mild pork tenderloin that roasts beautifully.'],
    ['Large raw shrimp', 10.99, '1 lb', 'Peeled and deveined shrimp, ready for the skillet.'],
    ['Turkey burger patties', 7.49, '4 patties', 'Seasoned lightly and ready for the grill or pan.'],
    ['Beef stew meat', 8.99, '1 lb', 'Tender-cut beef pieces for a cozy slow-cooked stew.'],
    ['Wild cod portions', 11.49, '12 oz', 'Mild, flaky cod portions, individually packed.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Meat & seafood', slug: slugify(String(name)), image: categoryImages['Meat & seafood'] })),
  ...[
    ['Whole milk', 4.19, 'half gallon', 'Creamy whole milk, a fridge staple for the whole family.'],
    ['Greek yogurt, plain', 5.49, '32 oz', 'Thick, tangy yogurt with simple ingredients.'],
    ['Sharp cheddar', 4.99, '8 oz', 'Aged cheddar with a rich, pleasantly sharp finish.'],
    ['Unsalted butter', 4.79, '1 lb', 'Sweet cream butter for baking, cooking, and spreading.'],
    ['Free-range eggs', 5.99, 'dozen', 'Large brown eggs from free-range hens.'],
    ['Oat milk', 4.49, 'half gallon', 'Smooth, dairy-free oat drink with a gentle sweetness.'],
    ['Cottage cheese', 3.99, '16 oz', 'Creamy small-curd cottage cheese, high in protein.'],
    ['Mozzarella pearls', 5.29, '8 oz', 'Soft, milky mozzarella bites for salads and snacks.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Dairy', slug: slugify(String(name)), image: categoryImages.Dairy })),
  ...[
    ['Sourdough boule', 5.49, 'loaf', 'Crusty artisan-style sourdough with a tangy crumb.'],
    ['Everything bagels', 4.49, '6 count', 'Chewy bagels finished with a savory everything topping.'],
    ['Butter croissants', 6.99, '4 count', 'Flaky, golden pastries with a buttery center.'],
    ['Country white bread', 3.99, 'loaf', 'Soft-sliced sandwich bread baked for everyday lunches.'],
    ['Blueberry muffins', 5.99, '4 count', 'Tender muffins dotted with real blueberries.'],
    ['Flour tortillas', 3.49, '10 count', 'Soft, flexible tortillas for wraps, quesadillas, and tacos.'],
    ['Chocolate chip cookies', 5.49, '8 count', 'Bakery cookies with a soft center and chocolate chips.'],
    ['Rye sandwich bread', 4.29, 'loaf', 'Hearty sliced rye with a gently earthy flavor.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Bakery', slug: slugify(String(name)), image: categoryImages.Bakery })),
  ...[
    ['Extra virgin olive oil', 11.99, '16.9 fl oz', 'Peppery, versatile olive oil for dressings and cooking.'],
    ['Penne pasta', 2.49, '1 lb', 'Classic bronze-cut pasta that holds onto every sauce.'],
    ['Jasmine rice', 6.99, '2 lb', 'Fragrant long-grain rice with a soft, fluffy finish.'],
    ['Black beans', 1.79, '15 oz can', 'Ready-to-use black beans, a handy pantry protein.'],
    ['Creamy peanut butter', 4.99, '16 oz', 'Roasted peanuts blended into a smooth, spreadable classic.'],
    ['Maple syrup', 9.49, '8 fl oz', 'Pure maple syrup with warm, rich sweetness.'],
    ['Rolled oats', 4.49, '18 oz', 'Whole-grain oats for breakfast, baking, and more.'],
    ['Roasted tomato pasta sauce', 4.29, '24 oz', 'Slow-simmered tomato sauce with roasted garlic.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Pantry', slug: slugify(String(name)), image: categoryImages.Pantry })),
  ...[
    ['Wild blueberry blend', 6.49, '16 oz', 'Frozen blueberries picked at peak ripeness.'],
    ['Garden vegetable medley', 3.99, '16 oz', 'A colorful mix, ready to steam or stir-fry.'],
    ['Margherita pizza', 8.99, '12 inch', 'A thin crust topped with tomato, mozzarella, and basil.'],
    ['Vanilla bean ice cream', 6.99, '1 pint', 'A creamy, classic scoop with real vanilla flavor.'],
    ['Chicken dumplings', 7.49, '20 oz', 'Savory chicken and vegetables wrapped in tender dough.'],
    ['Sweet corn', 3.49, '4 ears', 'Frozen sweet corn, ready whenever you need it.'],
    ['Mango chunks', 5.49, '16 oz', 'Sweet, sunny mango pieces for smoothies and bowls.'],
    ['Spinach & ricotta ravioli', 7.99, '9 oz', 'Pillowy pasta filled with spinach and creamy ricotta.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Frozen', slug: slugify(String(name)), image: 'photo- frozen' })),
  ...[
    ['Sparkling mineral water', 5.99, '8 cans', 'Crisp, lightly sparkling water for a refreshing break.'],
    ['Cold brew coffee', 5.49, '32 fl oz', 'Smooth, slow-steeped coffee, ready over ice.'],
    ['Orange juice', 5.99, 'half gallon', 'Bright, refreshing juice made from oranges.'],
    ['Green tea', 4.49, '20 bags', 'Delicate green tea bags for a mellow daily cup.'],
    ['Lemon seltzer', 4.99, '8 cans', 'Bubbly lemon water with a clean, citrus finish.'],
    ['Oat milk chocolate drink', 4.99, '32 fl oz', 'A smooth, chocolatey plant-based treat.'],
    ['Coconut water', 3.49, '16.9 fl oz', 'Naturally refreshing coconut water for on-the-go.'],
    ['Ground coffee, medium roast', 10.99, '12 oz', 'Balanced, aromatic coffee for your morning routine.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Beverages', slug: slugify(String(name)), image: categoryImages.Beverages })),
  ...[
    ['Dish soap, citrus', 4.49, '18 fl oz', 'A fresh-scented dish soap for everyday washing.'],
    ['Laundry detergent', 12.99, '50 fl oz', 'Concentrated detergent for a dependable clean.'],
    ['Paper towels', 8.99, '6 rolls', 'Absorbent paper towels for kitchen spills and cleanup.'],
    ['Bathroom tissue', 9.49, '12 rolls', 'Soft, dependable bathroom tissue for home essentials.'],
    ['All-purpose cleaner', 5.99, '24 fl oz', 'Everyday surface cleaner with a fresh, clean scent.'],
    ['Kitchen compost bags', 6.49, '30 count', 'Sturdy bags sized for countertop compost pails.'],
    ['Reusable food storage bags', 8.49, '4 count', 'Washable, reusable bags for snacks and leftovers.'],
    ['Sponge scrubbers', 3.99, '3 count', 'Dual-sided scrubbers for dishes and kitchen surfaces.'],
  ].map(([name, price, unit, description]) => ({ name: String(name), price: Number(price), unit: String(unit), description: String(description), category: 'Household', slug: slugify(String(name)), image: categoryImages.Household })),
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function imageUrl(id: string) {
  const safeId = imageOverrides[id] && imageOverrides[id] !== 'photo- frozen' ? imageOverrides[id] : id;
  if (safeId === 'photo- frozen') return 'https://images.unsplash.com/photo- frozen?auto=format&fit=crop&w=900&q=80';
  return `https://images.unsplash.com/${safeId}?auto=format&fit=crop&w=900&q=80`;
}
function quantityOf(item: RecordItem) {
  try { return Math.max(0, Number(JSON.parse(item.notes || '{}').quantity) || 0); } catch { return 0; }
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<RecordItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { setCart(readLocal<RecordItem[]>(STORAGE_KEY, [])); }
    catch { setNotice('Your saved cart could not be loaded. You can still browse and try adding items.'); }
    setReady(true);
  }, []);

  const cartCount = cart.reduce((total, item) => total + quantityOf(item), 0);
  const visibleProducts = useMemo(() => catalog.filter((product) => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const searchMatch = product.name.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && searchMatch;
  }), [selectedCategory, query]);

  function addToCart(product: Product) {
    const existing = cart.find((item) => item.id === product.slug);
    const updated = existing
      ? cart.map((item) => item.id === product.slug ? { ...item, notes: JSON.stringify({ quantity: quantityOf(item) + 1, price: product.price, unit: product.unit }) } : item)
      : [...cart, { id: product.slug, title: product.name, notes: JSON.stringify({ quantity: 1, price: product.price, unit: product.unit }), createdAt: new Date().toISOString() }];
    try {
      writeLocal(STORAGE_KEY, updated);
      setCart(updated);
      setNotice(`${product.name} added to your demo cart.`);
    } catch {
      setNotice('Could not save your cart. Please check browser storage settings and try again.');
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <div className="border-b border-black/5 bg-[#1a1d21] text-center px-4 py-2 text-xs font-medium tracking-wide text-white/85">
        AAA Grocery is a demo · Sample prices, products, fees, and availability are not live store information
      </div>
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="AAA Grocery home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#4f8cff] text-xl font-black text-white shadow-lg shadow-blue-200">A</span>
            <span className="text-lg font-extrabold tracking-tight">AAA <span className="text-[#4f8cff]">Grocery</span></span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#shop" className="transition hover:text-[#4f8cff]">Shop</a>
            <a href="#categories" className="transition hover:text-[#4f8cff]">Categories</a>
            <Link href="/help" className="transition hover:text-[#4f8cff]">How it works</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:block">Account</Link>
            <Link href="/cart" className="inline-flex items-center gap-2 rounded-xl bg-[#1a1d21] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700" aria-label={`Cart, ${cartCount} items`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
              Cart <span className="grid min-w-5 h-5 place-items-center rounded-full bg-[#4f8cff] px-1 text-[11px]">{ready ? cartCount : 0}</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 pb-10 pt-8 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:pb-14 lg:pt-12">
        <div className="relative flex min-h-[330px] flex-col justify-center overflow-hidden rounded-[2rem] bg-[#edf3ff] px-7 py-9 sm:px-12 lg:min-h-[400px]">
          <div className="absolute -right-14 -top-20 h-72 w-72 rounded-full bg-[#4f8cff]/10" />
          <div className="absolute -bottom-28 right-24 h-64 w-64 rounded-full border-[36px] border-white/55" />
          <div className="relative z-10 max-w-xl">
            <Badge tone="brand">A little closer to delicious</Badge>
            <h1 className="mt-5 max-w-lg text-4xl font-black leading-[1.06] tracking-[-0.045em] sm:text-6xl">Good food.<br /><span className="text-[#4f8cff]">Good mood.</span></h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">Meet your new neighborhood grocery run. Explore a handpicked sample of everyday favorites, fresh finds, and feel-good essentials.</p>
            <a href="#shop" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1a1d21] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/50 transition hover:-translate-y-0.5">Explore the shop <span aria-hidden="true">↘</span></a>
          </div>
          <div className="absolute -bottom-2 right-4 hidden h-[300px] w-[40%] overflow-hidden rounded-t-[10rem] sm:block lg:right-12 lg:h-[360px]">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85" alt="Colorful fresh produce at the market" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d21]/20 to-transparent" />
          </div>
          <div className="absolute bottom-7 right-7 z-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl sm:block lg:right-12">
            <div className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Your daily little win</div>
            <div className="mt-1 text-sm font-extrabold">Fresh picks, easy choices ✦</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-rows-2">
          <a href="#categories" className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-[1.7rem] bg-[#dcebe2] p-5 transition hover:-translate-y-1 sm:p-6">
            <span className="text-3xl">🥬</span><div><div className="text-xs font-bold uppercase tracking-widest text-slate-600">Fresh from the field</div><div className="mt-1 text-lg font-extrabold">Produce, please <span className="transition group-hover:translate-x-1 inline-block">→</span></div></div>
          </a>
          <a href="#categories" className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-[1.7rem] bg-[#fae9d8] p-5 transition hover:-translate-y-1 sm:p-6">
            <span className="text-3xl">🥐</span><div><div className="text-xs font-bold uppercase tracking-widest text-slate-600">Made for slow mornings</div><div className="mt-1 text-lg font-extrabold">Bakery favorites <span className="transition group-hover:translate-x-1 inline-block">→</span></div></div>
          </a>
          <div className="col-span-2 flex items-center justify-between gap-5 rounded-[1.7rem] bg-[#fff] p-5 shadow-sm ring-1 ring-black/[.035] sm:p-6">
            <div><div className="text-xs font-bold uppercase tracking-widest text-[#4f8cff]">Thoughtfully simple</div><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Browse the sample shop at your own pace. Your cart stays yours in this browser.</p></div>
            <span className="hidden text-4xl sm:block">🧺</span>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 pb-9 lg:px-8">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#4f8cff]">Aisles worth wandering</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Shop by category</h2></div><span className="hidden text-sm text-slate-500 sm:block">8 corners of the grocery store</span></div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {[
            ['Produce', '🥑', '#e4f1e8'], ['Meat & seafood', '🐟', '#e5efff'], ['Dairy', '🥛', '#f7efd9'], ['Bakery', '🥖', '#fae8d9'],
            ['Pantry', '🫙', '#f0e9fa'], ['Frozen', '🧊', '#e2f3f4'], ['Beverages', '🧃', '#fce8ec'], ['Household', '🧽', '#eceff2'],
          ].map(([name, icon, color]) => (
            <button key={name} onClick={() => { setSelectedCategory(name); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center ring-1 ring-black/[.04] transition hover:-translate-y-1 hover:shadow-md sm:p-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl transition group-hover:scale-105" style={{ backgroundColor: color }}>{icon}</span>
              <span className="text-[11px] font-bold leading-tight text-slate-700 sm:text-xs">{name}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 pb-20 pt-3 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#4f8cff]">The good stuff</p><h2 className="mt-1 text-3xl font-extrabold tracking-tight">Find your favorites</h2><p className="mt-2 text-sm text-slate-500">A sample selection for inspiration. Prices and availability are demo data.</p></div>
          <label className="relative block w-full sm:max-w-xs"><span className="sr-only">Search products</span><svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the sample catalog" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#4f8cff] focus:ring-4 focus:ring-blue-100" /></label>
        </div>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-[#1a1d21] text-white' : 'bg-white text-slate-600 ring-1 ring-black/[.07] hover:bg-slate-50'}`}>{category}</button>)}
        </div>
        {notice && <div role="status" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900"><span className="break-words">{notice}</span><button onClick={() => setNotice('')} className="shrink-0 font-bold" aria-label="Dismiss message">×</button></div>}
        {visibleProducts.length === 0 ? (
          <Card className="p-10 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">🔎</div><h3 className="mt-4 text-lg font-extrabold">No matching groceries just yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">We couldn’t find a sample product{query ? ` matching “${query}”` : ''}. Try another search or browse all categories.</p><Button className="mt-5" onClick={() => { setQuery(''); setSelectedCategory('All'); }}>Show all products</Button></Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500"><span>{visibleProducts.length} sample {visibleProducts.length === 1 ? 'product' : 'products'}</span><span>Prices shown in USD · demo only</span></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product, index) => (
                <Card key={product.slug} className="group overflow-hidden rounded-2xl border-0 p-0 shadow-sm ring-1 ring-black/[.045] transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[1.15/1] overflow-hidden bg-slate-100">
                    <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full w-full"><img src={imageUrl(product.image)} alt={product.name} loading={index > 7 ? 'lazy' : 'eager'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
                    {product.tag && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">{product.tag}</span>}
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-600 backdrop-blur">{product.category}</span>
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <Link href={`/product/${product.slug}`} className="block"><h3 className="min-h-10 text-sm font-bold leading-5 text-[#1a1d21] transition group-hover:text-[#4f8cff]">{product.name}</h3></Link>
                    <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
                    <div className="mt-3 flex items-center justify-between gap-2"><span className="text-base font-extrabold">${product.price.toFixed(2)}</span><button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#4f8cff] text-xl font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200">+</button></div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
      <footer className="border-t border-black/[.06] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-bold text-slate-700">AAA Grocery <span className="font-normal text-slate-400">· a friendly demo shop</span></span><span>Sample catalog and prices only. No live inventory, payment, delivery, or retailer connection.</span><Link href="/help" className="font-semibold text-[#4f8cff] hover:underline">Demo details & help</Link></div></footer>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GroceryHeader } from "@/components/grocery-header";
import { categories, formatPrice, products, type GroceryCategory } from "@/lib/grocery";

export default function HomePage() {
  const [category, setCategory] = useState<GroceryCategory | "All">("All");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => (category === "All" || product.category === category) && (!search || product.name.toLowerCase().includes(search)));
  }, [category, query]);

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]">
      <GroceryHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:items-center md:py-16 lg:px-8">
        <div className="relative z-10 py-4">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#287a4b]">Good food, close to home</p>
          <h1 className="max-w-xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl">A little more fresh in your day.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#496454]">Shop the neighborhood favorites you love, from just-picked produce to pantry staples. Build a sample basket for delivery or pickup.</p>
          <a href="#catalog" className="mt-7 inline-flex h-12 items-center rounded-full bg-[#287a4b] px-7 font-semibold text-white transition hover:bg-[#1f633c] focus:outline-none focus:ring-4 focus:ring-[#287a4b]/25">Shop groceries</a>
          <p className="mt-4 text-xs text-[#66766a]">Demo experience only. No real orders, payment, delivery, or pickup are placed.</p>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-[#e5f2e8] shadow-sm md:min-h-[430px]">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=88" alt="A colorful selection of fresh market produce" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183b2b]/55 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/50 bg-white/90 p-5 backdrop-blur-sm">
            <p className="font-serif text-2xl">Fresh picks for your table</p>
            <p className="mt-1 text-sm text-[#496454]">A curated sample catalog with 64 neighborhood staples.</p>
          </div>
          <svg className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 text-white/40" viewBox="0 0 160 160" fill="none" aria-hidden="true"><path d="M132 15C68 26 28 65 28 125c40-6 77-35 104-110Z" stroke="currentColor" strokeWidth="2"/><path d="M29 124c24-29 55-56 93-79M60 94l-2-31m24 13 23-4m-52 40-24-7" stroke="currentColor" strokeWidth="2"/></svg>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#287a4b]">The market</p><h2 className="mt-1 font-serif text-4xl">Shop groceries</h2><p className="mt-2 text-sm text-[#66766a]">Browse our sample assortment. Prices and availability are simulated.</p></div>
          <label className="block w-full sm:max-w-sm"><span className="sr-only">Search products</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[#d9dfd7] bg-white px-4 focus-within:border-[#287a4b] focus-within:ring-2 focus-within:ring-[#287a4b]/15"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the market" className="w-full bg-transparent text-sm text-[#183b2b] outline-none placeholder:text-[#869188]" /></span></label>
        </div>
        <div className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by category">
          {(["All", ...categories] as const).map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#287a4b]/30 ${category === item ? "border-[#287a4b] bg-[#287a4b] text-white" : "border-[#d9dfd7] bg-white text-[#385444] hover:border-[#287a4b]"}`} aria-pressed={category === item}>{item}</button>)}
        </div>
        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cdd8cc] bg-white/70 px-6 py-16 text-center"><p className="font-serif text-2xl">No groceries found</p><p className="mt-2 text-sm text-[#66766a]">There are no matches for “{query}”{category !== "All" ? ` in ${category}` : ""}.</p><button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-full bg-[#287a4b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f633c]">Clear search and show all</button></div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => <article key={product.slug} className="group overflow-hidden rounded-2xl border border-[#e8e3d9] bg-white shadow-[0_2px_10px_rgba(24,59,43,0.035)] transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href={`/product/${product.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#287a4b]">
                <div className="aspect-[4/3] overflow-hidden bg-[#e5f2e8]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" /></div>
                <div className="p-4"><p className="text-xs font-semibold text-[#6b806f]">{product.category}</p><h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-[#183b2b]">{product.name}</h3><div className="mt-3 flex items-end justify-between gap-2"><span className="font-bold text-[#183b2b]">{formatPrice(product.price)}</span><span className="text-right text-[11px] text-[#78847a]">{product.unit}</span></div><span className="mt-4 inline-flex text-xs font-bold text-[#287a4b]">View details <span aria-hidden="true" className="ml-1">→</span></span></div>
              </Link>
            </article>)}
          </div>
        )}
      </section>
      <footer className="border-t border-[#e6e1d7] bg-white px-4 py-7 text-center text-xs text-[#66766a]">AAA Grocery is a local demo. Catalog, pricing, inventory, and fulfillment are simulated.</footer>
    </main>
  );
}

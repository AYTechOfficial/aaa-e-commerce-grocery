"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { categories, products, type GroceryCategory } from "@/lib/grocery";

export default function HomePage() {
  const [category, setCategory] = useState<"All" | GroceryCategory>("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => products.filter((product) =>
    (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.trim().toLowerCase()),
  ), [category, query]);

  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]">
    <ShopNav />
    <main className="mx-auto max-w-6xl px-5 pb-16">
      <section className="relative mt-7 grid overflow-hidden rounded-3xl bg-[#e5f2e8] md:grid-cols-2">
        <div className="relative z-10 flex flex-col items-start justify-center p-8 sm:p-12">
          <span className="mb-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Your neighborhood, in season</span>
          <h1 className="max-w-lg font-serif text-4xl leading-tight sm:text-5xl">Good groceries make a good day.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[#45624d]">Discover fresh favorites and pantry staples, all in one easy-to-browse place.</p>
          <a href="#catalog" className="mt-7 rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white transition hover:bg-[#183b2b]">Shop groceries</a>
          <p className="mt-5 text-xs text-[#52715a]">A local shopping demo. Prices, stock, and fulfillment are simulated.</p>
        </div>
        <div className="min-h-64 bg-[#d2e6d2] md:min-h-[340px]">
          <img className="h-full min-h-64 w-full object-cover" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85" alt="A colorful selection of fresh market produce" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 left-1/3 h-64 w-64 rounded-full border border-[#287a4b]/10" />
      </section>

      <section id="catalog" className="scroll-mt-6 pt-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#287a4b]">The neighborhood market</p><h2 className="mt-2 font-serif text-3xl">Shop the catalog</h2><p className="mt-2 text-sm text-[#637365]">Browse 64 sample products across everyday essentials.</p></div>
          <label className="w-full sm:max-w-sm"><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groceries…" className="w-full rounded-xl border border-[#ded9ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#287a4b] focus:ring-2 focus:ring-[#287a4b]/15" /></label>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Product categories">
          {(["All", ...categories] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${category === item ? "border-[#183b2b] bg-[#183b2b] text-white" : "border-[#ded9ce] bg-white text-[#42594a] hover:border-[#287a4b]"}`}>{item}</button>)}
        </div>
        {visible.length ? <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => <article key={product.slug} className="group overflow-hidden rounded-2xl border border-[#ebe6dc] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="block"><div className="aspect-[4/3] overflow-hidden bg-[#e9eee5]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>
              <div className="p-4"><p className="text-xs font-medium text-[#718174]">{product.category}</p><h3 className="mt-1 min-h-10 text-sm font-semibold leading-5">{product.name}</h3><div className="mt-3 flex items-baseline justify-between gap-2"><span className="font-semibold text-[#183b2b]">${product.price.toFixed(2)}</span><span className="text-right text-xs text-[#718174]">{product.unit}</span></div><span className="mt-3 inline-block text-sm font-semibold text-[#287a4b] group-hover:underline">View details →</span></div>
            </Link>
          </article>)}
        </div> : <div className="mt-8 rounded-2xl border border-dashed border-[#c9d4c7] bg-white px-6 py-12 text-center"><h3 className="font-serif text-2xl">No groceries found</h3><p className="mt-2 text-sm text-[#637365]">We couldn’t find products matching “{query}”{category !== "All" ? ` in ${category}` : ""}.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-full bg-[#287a4b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183b2b]">Clear search and show all</button></div>}
      </section>
      <div className="mt-12 rounded-2xl bg-white p-6 text-sm text-[#5c6d60]"><strong className="text-[#183b2b]">Local demo market</strong><p className="mt-1">Sample catalog for Northside Market. No retailer, delivery service, or payment provider is connected.</p><Link href="/stores/northside-market" className="mt-3 inline-block font-semibold text-[#287a4b] hover:underline">Explore Northside Market →</Link></div>
    </main>
  </div>;
}

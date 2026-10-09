"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { groceryCategories, groceryProducts, type GroceryCategory, type GroceryProduct } from "@/lib/grocery";

const categoryPhotos: Record<GroceryCategory, string> = {
  Produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
  "Meat & Seafood": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=85",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=85",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
  Pantry: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=1200&q=85",
  Frozen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85",
  Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85",
  "Household Essentials": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=85",
};

function ProductCard({ product }: { product: GroceryProduct }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#ebe6dc] bg-white shadow-[0_3px_14px_rgba(24,59,43,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(24,59,43,0.10)]">
      <Link href={`/product/${product.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287a4b]">
        <div className="aspect-[4/3] overflow-hidden bg-[#e5f2e8]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#718174]">{product.category}</p>
          <h2 className="mt-1 min-h-12 font-semibold leading-6 text-[#183b2b]">{product.name}</h2>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold text-[#183b2b]">${product.price.toFixed(2)}</span>
            <span className="text-xs text-[#718174]">{product.unit}</span>
          </div>
          <span className="mt-4 inline-block text-sm font-semibold text-[#287a4b] group-hover:underline">View product →</span>
        </div>
      </Link>
    </article>
  );
}

export default function CatalogShop() {
  const [activeCategory, setActiveCategory] = useState<GroceryCategory | "All">("All");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return groceryProducts.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]">
      <div className="bg-[#183b2b] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo — prices, products, inventory, and fulfillment are illustrative.</div>
      <ShopNav />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#e5f2e8] px-7 py-10 md:px-12 md:py-14">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-6 -top-8 h-64 w-64 text-[#287a4b]/10" viewBox="0 0 200 200" fill="none"><path d="M167 24C83 29 31 77 35 146c2 29 22 42 45 34 49-17 75-71 87-156Z" stroke="currentColor" strokeWidth="2"/><path d="M36 177c28-49 67-92 126-143M82 126l-6-43m36 12 25-32m-54 86-37-4" stroke="currentColor" strokeWidth="2"/></svg>
            <p className="relative text-sm font-bold uppercase tracking-[0.16em] text-[#287a4b]">Good things grow here</p>
            <h1 className="relative mt-4 max-w-xl font-serif text-4xl leading-tight md:text-6xl">A little freshness for your everyday.</h1>
            <p className="relative mt-5 max-w-lg leading-7 text-[#526a58]">Build a basket from our sample neighborhood market. Browse freely, then review every demo cost before checkout.</p>
            <a href="#shop" className="relative mt-7 inline-flex rounded-xl bg-[#287a4b] px-6 py-3 font-semibold text-white transition hover:bg-[#1e633b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183b2b]">Shop groceries</a>
            <p className="relative mt-4 text-xs text-[#68766b]">No real orders, payments, delivery, or pickup are placed.</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-[#e5f2e8]">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85" alt="A colorful selection of fresh market produce" className="h-72 w-full object-cover md:h-[430px]" />
          </div>
        </section>

        <section id="shop" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">The sample market</p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl">Shop the catalog</h2>
            </div>
            <label className="w-full md:max-w-sm">
              <span className="sr-only">Search groceries</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groceries…" className="h-12 w-full rounded-xl border border-[#ddd7ca] bg-white px-4 text-[#183b2b] outline-none transition placeholder:text-[#8b958a] focus:border-[#287a4b] focus:ring-2 focus:ring-[#287a4b]/15" />
            </label>
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Product categories">
            {(["All", ...groceryCategories] as const).map((category) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287a4b] ${activeCategory === category ? "border-[#287a4b] bg-[#287a4b] text-white" : "border-[#ddd7ca] bg-white text-[#526a58] hover:border-[#287a4b] hover:text-[#287a4b]"}`}>
                {category}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-[#68766b]">{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}{activeCategory !== "All" ? ` in ${activeCategory}` : ""}</p>
            {query ? <button type="button" onClick={() => setQuery("")} className="text-sm font-semibold text-[#287a4b] hover:underline">Clear search</button> : null}
          </div>
          {visibleProducts.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cfc9bc] bg-white px-6 py-14 text-center">
              <p className="font-serif text-2xl">No groceries found</p>
              <p className="mt-2 text-sm text-[#68766b]">We couldn’t find “{query}”{activeCategory !== "All" ? ` in ${activeCategory}` : ""}. Try another search or browse everything.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => setQuery("")} className="rounded-lg bg-[#287a4b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e633b]">Clear search</button>
                <button type="button" onClick={() => { setQuery(""); setActiveCategory("All"); }} className="rounded-lg border border-[#ddd7ca] bg-white px-4 py-2 text-sm font-semibold text-[#183b2b] hover:border-[#287a4b]">View all groceries</button>
              </div>
            </div>
          )}
          <div className="mt-10 rounded-2xl bg-[#e5f2e8] p-5 text-sm leading-6 text-[#526a58]">Catalog products, sample prices, and availability are demo information only. Selecting a product opens its details; it will not be added to your basket unless you choose “Add to cart.”</div>
        </section>
      </main>
    </div>
  );
}

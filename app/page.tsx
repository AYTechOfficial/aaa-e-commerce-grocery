"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories, products, type Category } from "@/lib/catalog";
import { ProductCard, StoreFooter, StoreHeader } from "@/components/storefront";

export default function CatalogPage() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.trim().toLowerCase())), [category, query]);
  return <div className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><StoreHeader />
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-[1fr_0.94fr] md:items-center md:gap-12 md:pb-16 md:pt-12">
        <div className="relative z-10 py-3 md:py-8"><span className="inline-flex items-center gap-2 rounded-full bg-[#E5F2E8] px-3 py-1.5 text-xs font-semibold text-[#287A4B]"><span className="h-1.5 w-1.5 rounded-full bg-[#287A4B]" />Fresh from the neighborhood</span>
          <h1 className="mt-5 max-w-xl text-5xl leading-[1.04] tracking-tight text-[#183B2B] sm:text-6xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Good food.<br /><span className="text-[#287A4B]">A little closer.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#58695d]">Thoughtful everyday groceries, picked for your table. Browse our neighborhood-inspired demo catalog and build a basket at your own pace.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3"><Link href="#shop" className="inline-flex h-12 items-center rounded-full bg-[#287A4B] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e633b] focus:outline-none focus:ring-2 focus:ring-[#287A4B] focus:ring-offset-2">Shop groceries <span className="ml-2">↓</span></Link><span className="text-xs text-[#748076]">Simulated prices · No real orders</span></div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-[#dcead7] md:min-h-[410px]">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85" alt="A colorful selection of fresh market produce" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183B2B]/45 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white"><p className="max-w-xs text-xl leading-snug" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>A little more fresh<br />in every day.</p><span className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-medium backdrop-blur">Good things, gathered locally</span></div>
          <svg className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-white/25" viewBox="0 0 160 160" fill="none" aria-hidden="true"><path d="M143 17C85 26 44 59 24 133M52 91c2-28-10-44-34-49 1 25 12 41 34 49Zm27-34c4-25 19-39 44-41-3 25-18 40-44 41Zm-27 33c22-15 42-14 59 3-21 14-41 13-59-3Zm-15 29c-3-23-16-37-39-40 2 23 15 37 39 40Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </section>
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-8 sm:px-6">
        <div className="flex flex-col gap-5 border-t border-[#e7e1d6] py-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#287A4B]">The good stuff</p><h2 className="mt-1 text-3xl text-[#183B2B]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Shop the market</h2></div>
          <label className="relative block w-full md:max-w-sm"><span className="sr-only">Search groceries</span><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#728075]" aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groceries..." className="h-12 w-full rounded-full border border-[#ddd8ce] bg-white pl-11 pr-4 text-sm text-[#183B2B] outline-none transition placeholder:text-[#9a9e97] focus:border-[#287A4B] focus:ring-2 focus:ring-[#287A4B]/15" /></label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3" aria-label="Filter by category">{(["All", ...categories] as const).map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#287A4B]/30 ${category === item ? "border-[#287A4B] bg-[#287A4B] text-white" : "border-[#ded9ce] bg-white text-[#536357] hover:border-[#287A4B] hover:text-[#287A4B]"}`}>{item}</button>)}</div>
        <div className="mb-5 mt-4 flex items-center justify-between"><p className="text-xs text-[#788078]">{visible.length} {visible.length === 1 ? "item" : "items"}{category !== "All" ? ` in ${category}` : " · Sample catalog"}</p>{query && <button className="text-xs font-semibold text-[#287A4B] underline underline-offset-4" onClick={() => setQuery("")}>Clear search</button>}</div>
        {visible.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="rounded-2xl border border-dashed border-[#c9d4c9] bg-white/60 px-6 py-14 text-center"><span className="text-3xl" aria-hidden="true">⌕</span><h3 className="mt-3 text-lg font-semibold">No groceries found{query ? ` for “${query}”` : ""}</h3><p className="mt-1 text-sm text-[#748076]">Try another search or browse the full market.</p><button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-full bg-[#287A4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e633b]">Show all groceries</button></div>}
      </section>
    </main><StoreFooter /></div>;
}

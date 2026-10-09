"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";

export function StoreHeader() {
  const { count } = useCart();
  return <>
    <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo · Catalog, prices, availability, and fulfillment are simulated</div>
    <header className="sticky top-0 z-30 border-b border-[#e9e3d8] bg-[#FAF7F0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 text-[22px] font-bold tracking-tight text-[#183B2B]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>good<span className="text-[#287A4B]">grocer</span><span className="text-[#E66A45]">.</span></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#365344] md:flex" aria-label="Main navigation">
          <Link className="transition hover:text-[#287A4B]" href="/#shop">Shop groceries</Link>
          <Link className="transition hover:text-[#287A4B]" href="/cart">Your basket</Link>
          <Link className="transition hover:text-[#287A4B]" href="/checkout">Help</Link>
          <Link className="transition hover:text-[#287A4B]" href="/">Account</Link>
        </nav>
        <Link href="/cart" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#287A4B] px-4 text-sm font-semibold text-white transition hover:bg-[#1e633b] focus:outline-none focus:ring-2 focus:ring-[#287A4B] focus:ring-offset-2">
          Basket <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[#183B2B]" aria-label={`${count} items`}>{count}</span>
        </Link>
      </div>
    </header>
  </>;
}

export function StoreFooter() {
  return <footer className="mt-16 border-t border-[#e9e3d8] bg-white/60"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs leading-5 text-[#68766c] sm:px-6 md:flex-row md:items-center md:justify-between"><span>© 2025 goodgrocer · Made for your neighborhood.</span><span>Demo only. Prices, inventory, fees, delivery, pickup, and orders are simulated. No retailer or payment service is contacted.</span></div></footer>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className="group overflow-hidden rounded-2xl border border-[#e9e3d8] bg-white shadow-[0_3px_12px_rgba(24,59,43,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(24,59,43,0.11)]">
    <Link href={`/product/${product.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#287A4B]" aria-label={`View ${product.name}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e5f2e8]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#365344]">{product.category}</span>
      </div>
      <div className="p-4">
        <h3 className="min-h-11 text-[15px] font-semibold leading-5 text-[#183B2B]">{product.name}</h3>
        <p className="mt-1 text-xs text-[#7b847c]">{product.unit}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[#f0ede6] pt-3"><span className="text-lg font-bold text-[#183B2B]">{formatPrice(product.price)}</span><span className="text-xs font-semibold text-[#287A4B] transition group-hover:translate-x-0.5">View details <span aria-hidden="true">→</span></span></div>
      </div>
    </Link>
  </article>;
}

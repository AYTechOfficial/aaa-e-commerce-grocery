"use client";

import Link from "next/link";
import { useState } from "react";
import ShopNav from "@/components/shop-nav";
import { addToCart, findProduct } from "@/lib/grocery";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = findProduct(params.slug);
  const [added, setAdded] = useState(false);
  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><main className="mx-auto max-w-5xl px-5 py-10">
    <Link href="/" className="text-sm font-semibold text-[#287a4b] hover:underline">← Back to shopping</Link>
    {!product ? <section className="mt-8 rounded-2xl border border-[#e6e1d6] bg-white px-6 py-14 text-center"><h1 className="font-serif text-3xl">We couldn’t find that product</h1><p className="mt-3 text-[#667367]">It may have moved out of this demo catalog.</p><Link href="/" className="mt-6 inline-block rounded-full bg-[#287a4b] px-5 py-3 font-semibold text-white">Browse groceries</Link></section> : <section className="mt-7 grid overflow-hidden rounded-3xl border border-[#ebe6dc] bg-white md:grid-cols-2">
      <div className="min-h-72 bg-[#e9eee5]"><img src={product.image} alt={product.name} className="h-full min-h-72 w-full object-cover" /></div>
      <div className="flex flex-col items-start p-7 sm:p-10"><p className="text-sm font-semibold text-[#287a4b]">{product.category}</p><h1 className="mt-3 font-serif text-4xl">{product.name}</h1><p className="mt-3 text-sm text-[#718174]">{product.unit}</p><p className="mt-5 text-2xl font-bold text-[#183b2b]">${product.price.toFixed(2)}</p><p className="mt-5 leading-7 text-[#5f6e62]">{product.description}</p>{product.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e5f2e8] px-3 py-1 text-xs font-medium text-[#31523e]">{tag}</span>)}</div>}
        <button type="button" onClick={() => { addToCart(product.slug); setAdded(true); }} className="mt-8 w-full rounded-xl bg-[#287a4b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#183b2b]">Add to basket</button>{added && <p role="status" className="mt-3 text-sm font-medium text-[#287a4b]">Added to your basket. You can keep browsing or review your basket.</p>}<p className="mt-4 text-xs text-[#718174]">Sample price and availability; adding to your basket does not place an order.</p>
      </div>
    </section>}
  </main></div>;
}

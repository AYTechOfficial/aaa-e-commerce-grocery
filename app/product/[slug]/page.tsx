"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { findProduct, formatPrice } from "@/lib/catalog";
import { addProduct } from "@/lib/cart";
import { StoreFooter, StoreHeader } from "@/components/storefront";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = findProduct(params.slug);
  const [added, setAdded] = useState(false);
  return <div className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><StoreHeader /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#287A4B] hover:underline">← Back to shopping</Link>
    {product ? <div className="mt-7 grid gap-8 md:grid-cols-2 md:gap-14">
      <div className="overflow-hidden rounded-[24px] bg-[#E5F2E8]"><img src={product.image} alt={product.name} className="h-full max-h-[560px] min-h-[320px] w-full object-cover" /></div>
      <div className="flex flex-col justify-center py-2"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#287A4B]">{product.category} · Sample item</p><h1 className="mt-3 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{product.name}</h1><p className="mt-2 text-sm text-[#778078]">{product.unit}</p><p className="mt-6 text-3xl font-bold text-[#183B2B]">{formatPrice(product.price)} <span className="text-xs font-normal text-[#7b847c]">simulated price</span></p><p className="mt-6 max-w-xl text-base leading-7 text-[#58695d]">{product.description}</p>
        {product.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#E5F2E8] px-3 py-1.5 text-xs font-semibold text-[#287A4B]">{tag}</span>)}</div>}
        <div className="mt-7 rounded-xl border border-[#e9e3d8] bg-white p-4"><h2 className="text-sm font-semibold">Ingredients & information</h2><p className="mt-1 text-sm leading-6 text-[#68766c]">{product.ingredients}</p></div>
        <button onClick={() => { addProduct(product.slug); setAdded(true); }} className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#287A4B] px-6 text-sm font-semibold text-white transition hover:bg-[#1e633b] focus:outline-none focus:ring-2 focus:ring-[#287A4B] focus:ring-offset-2 sm:w-auto">Add to basket · {formatPrice(product.price)}</button>
        {added && <p role="status" className="mt-3 text-sm font-semibold text-[#287A4B]">Added to your basket. <Link href="/cart" className="underline underline-offset-4">View basket</Link></p>}
        <p className="mt-5 text-xs leading-5 text-[#81877f]">Sample product and price for demonstration only. Availability and product details are not verified against a retailer.</p>
      </div>
    </div> : <div className="mx-auto my-16 max-w-lg rounded-2xl border border-[#e9e3d8] bg-white px-6 py-12 text-center"><span className="text-4xl" aria-hidden="true">🌿</span><h1 className="mt-4 text-3xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>We couldn’t find that item</h1><p className="mt-2 text-sm leading-6 text-[#68766c]">It may have moved out of our sample market. Browse the catalog to find something good.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#287A4B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e633b]">Back to the market</Link></div>}
  </main><StoreFooter /></div>;
}

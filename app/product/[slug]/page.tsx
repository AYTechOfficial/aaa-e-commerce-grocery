"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { GroceryHeader } from "@/components/grocery-header";
import { formatPrice, getProductBySlug, getCart, saveCart } from "@/lib/grocery";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (!product) return;
    const cart = getCart();
    const existing = cart.find((line) => line.productId === product.slug);
    saveCart(existing ? cart.map((line) => line.productId === product.slug ? { ...line, quantity: line.quantity + 1 } : line) : [...cart, { productId: product.slug, quantity: 1 }]);
    setAdded(true);
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryHeader /><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Link href="/" className="text-sm font-semibold text-[#287a4b] hover:underline">← Back to shopping</Link>
      {!product ? <section className="mx-auto my-16 max-w-xl rounded-2xl border border-[#e6e1d7] bg-white p-8 text-center"><p className="font-serif text-3xl">We couldn’t find that grocery</p><p className="mt-3 text-sm leading-6 text-[#66766a]">This product may not be part of our sample catalog.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#287a4b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f633c]">Return to shopping</Link></section> : <section className="mt-7 grid overflow-hidden rounded-3xl border border-[#e8e3d9] bg-white md:grid-cols-2"><div className="min-h-[300px] bg-[#e5f2e8] md:min-h-[520px]"><img src={product.image} alt={product.name} className="h-full min-h-[300px] w-full object-cover md:min-h-[520px]" /></div><div className="flex flex-col justify-center p-6 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#287a4b]">{product.category}</p><h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1><p className="mt-3 text-sm text-[#738176]">{product.unit} · Sample price</p><p className="mt-5 text-3xl font-bold text-[#183b2b]">{formatPrice(product.price)}</p><p className="mt-6 leading-7 text-[#496454]">{product.description}</p>{product.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e5f2e8] px-3 py-1 text-xs font-semibold text-[#287a4b]">{tag}</span>)}</div>}<button onClick={addToCart} className="mt-8 h-12 rounded-full bg-[#287a4b] px-7 font-semibold text-white transition hover:bg-[#1f633c] focus:outline-none focus:ring-4 focus:ring-[#287a4b]/25">Add to cart</button>{added && <p role="status" className="mt-3 text-sm font-semibold text-[#287a4b]">Added to your demo cart.</p>}<p className="mt-5 text-xs leading-5 text-[#78847a]">Sample product and price for demonstration only. No inventory is reserved.</p></div></section>}
    </div></main>
  );
}

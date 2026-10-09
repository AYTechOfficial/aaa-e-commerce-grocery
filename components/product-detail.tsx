"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, findProduct, money, type CartItem } from "@/lib/grocery-data";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = findProduct(params.slug);
  const [added, setAdded] = useState(false);
  function addToCart() {
    if (!product) return;
    const cart = readLocal<CartItem[]>(CART_KEY, []);
    const existing = cart.find((item) => item.slug === product.slug);
    const next = existing ? cart.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { slug: product.slug, quantity: 1 }];
    writeLocal(CART_KEY, next);
    window.dispatchEvent(new Event("aaa-cart-updated"));
    setAdded(true);
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryNav />{product ? <div className="mx-auto max-w-6xl px-5 py-9"><Link href="/" className="font-semibold text-[#287a4b] hover:underline">← Back to shopping</Link><div className="mt-7 grid gap-9 md:grid-cols-2 md:items-center"><img src={product.image} alt={product.name} className="h-80 w-full rounded-3xl bg-[#e5f2e8] object-cover md:h-[520px]"/><div><p className="text-sm font-bold uppercase tracking-wider text-[#287a4b]">{product.category}</p><h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">{product.name}</h1><p className="mt-3 text-[#617367]">{product.unit}</p><p className="mt-5 text-3xl font-bold">{money(product.price)} <span className="text-sm font-normal text-[#617367]">/ {product.unit}</span></p><p className="mt-6 leading-7 text-[#617367]">{product.description}</p><div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e5f2e8] px-3 py-1 text-sm font-medium">{tag}</span>)}</div><p className="mt-5 text-sm text-[#617367]">Price and availability are sample data for this demo.</p><button onClick={addToCart} className="mt-7 w-full rounded-full bg-[#287a4b] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#1e633b]">{added ? "Added to basket — add another" : "Add to cart"}</button>{added && <p role="status" className="mt-3 text-center font-semibold text-[#287a4b]">{product.name} is in your basket.</p>}</div></div></div> : <div className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="font-serif text-4xl font-bold">We couldn’t find that product</p><p className="mt-3 text-[#617367]">This item may not be part of the sample catalog.</p><Link href="/" className="mt-6 inline-block rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white">Back to shopping</Link></div>}</main>;
}

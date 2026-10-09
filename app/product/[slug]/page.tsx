"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import ShopNav from "@/components/shop-nav";
import { Button, Card } from "@/components/ui";
import { getCart, money, products, saveCart } from "@/lib/shop";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = products.find((item) => item.slug === decodeURIComponent(params.slug));
  const [added, setAdded] = useState(false);
  function addToCart() {
    if (!product) return;
    const cart = getCart();
    const current = cart.find((item) => item.productId === product.id);
    saveCart(current ? cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { productId: product.id, slug: product.slug, name: product.name, price: product.price, unit: product.unit, image: product.image, quantity: 1 }]);
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-5xl px-5 py-10"><Link href="/" className="text-sm font-semibold text-[#287a4b]">← Back to shopping</Link>
    {product ? <div className="mt-6 grid overflow-hidden rounded-3xl border border-[#e9e2d7] bg-white shadow-sm md:grid-cols-2">
      <div className="min-h-72 bg-[#e5f2e8]"><img src={product.image} alt={product.name} className="h-full max-h-[520px] w-full object-cover" /></div>
      <div className="p-6 sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">{product.category} · Demo item</p><h1 className="mt-3 font-serif text-4xl font-bold">{product.name}</h1><p className="mt-3 text-[#617367]">{product.unit}</p><p className="mt-5 text-3xl font-bold text-[#287a4b]">{money(product.price)}</p><p className="mt-5 leading-7 text-[#496451]">{product.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e5f2e8] px-3 py-1 text-sm text-[#31523e]">{tag}</span>)}</div>
        <p className="mt-6 text-sm leading-6 text-[#617367]">Sample price and availability are simulated. This demo does not contact a retailer.</p>
        <Button variant="primary" size="lg" onClick={addToCart} className="mt-6 w-full">Add to cart</Button>
        {added && <Card className="mt-4 rounded-xl bg-[#e5f2e8] p-4 text-sm font-medium text-[#183b2b]">Added to your basket. <Link href="/cart" className="underline">Review basket</Link></Card>}
      </div></div> : <div className="mt-8 rounded-2xl bg-white p-8"><h1 className="font-serif text-3xl">Product not found</h1><p className="mt-2 text-[#617367]">That item isn’t in our sample catalog.</p><Link href="/" className="mt-5 inline-block font-semibold text-[#287a4b]">Back to shopping →</Link></div>}
  </div></main>;
}

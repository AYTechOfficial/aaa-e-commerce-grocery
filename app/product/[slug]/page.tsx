"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { CART_STORAGE_KEY, cartCount, getProductBySlug, readCart, saveCart, type CartLine } from "@/lib/grocery";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => setCart(readCart()), []);

  function addToCart() {
    if (!product) return;
    const current = readCart();
    const existing = current.find((line) => line.productId === product.slug);
    const updated = existing
      ? current.map((line) => line.productId === product.slug ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { productId: product.slug, quantity: 1 }];
    saveCart(updated);
    setCart(updated);
    setAdded(true);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F0", color: "#183B2B" }}>
      <div style={{ background: "#183B2B", color: "white", textAlign: "center", padding: 9, fontSize: 13 }}>Demo catalog — prices and availability are simulated.</div>
      <header style={{ maxWidth: 1100, margin: "auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><Link href="/" style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 26, color: "#183B2B", textDecoration: "none" }}>AAA Grocery</Link><Link href="/cart" style={{ color: "#287A4B", fontWeight: 700 }}>Cart ({cartCount(cart)})</Link></header>
      <section style={{ maxWidth: 1000, margin: "20px auto", padding: "0 24px 60px" }}>
        <Link href="/" style={{ color: "#287A4B", fontWeight: 700, textDecoration: "none" }}>← Back to shopping</Link>
        {!product ? <div style={{ marginTop: 28, background: "white", borderRadius: 16, padding: 40, textAlign: "center" }}><h1 style={{ fontFamily: "Georgia,serif" }}>Product not found</h1><p>That item isn’t in our sample catalog.</p><Link href="/" style={{ color: "#287A4B" }}>Return to shopping</Link></div> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 38, alignItems: "center", marginTop: 26 }}>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#E5F2E8", minHeight: 320 }}><img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "cover" }} /></div>
            <div><p style={{ color: "#287A4B", fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>{product.category.toUpperCase()}</p><h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px, 5vw, 48px)", lineHeight: 1.1, margin: "10px 0" }}>{product.name}</h1><div style={{ display: "flex", gap: 10, alignItems: "baseline", margin: "14px 0" }}><strong style={{ color: "#E66A45", fontSize: 26 }}>${product.price.toFixed(2)}</strong><span style={{ color: "#68766c" }}>{product.unit}</span></div><p style={{ lineHeight: 1.7, color: "#526358" }}>{product.description}</p><div style={{ display: "flex", gap: 8, margin: "18px 0 24px" }}>{product.tags.map((tag) => <span key={tag} style={{ background: "#E5F2E8", color: "#287A4B", padding: "6px 10px", borderRadius: 18, fontSize: 12 }}>{tag}</span>)}</div><Button size="lg" onClick={addToCart} style={{ background: "#287A4B", color: "white" }}>Add to cart</Button>{added && <p role="status" style={{ color: "#287A4B", fontWeight: 700 }}>Added to your demo cart. Cart count: {cartCount(cart)}.</p>}<p style={{ color: "#68766c", fontSize: 13, marginTop: 20 }}>Sample price and inventory only. This action does not place an order.</p></div>
          </div>
        )}
      </section>
    </main>
  );
}

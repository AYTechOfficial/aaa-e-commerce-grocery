"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import StoreHeader from "@/components/store-header";
import { getProduct, money, readCart, saveCart } from "@/lib/grocery";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = getProduct(params.slug);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <main style={{ background: "#FAF7F0", minHeight: "100vh", color: "#183B2B" }}><StoreHeader /><section style={{ maxWidth: 760, margin: "70px auto", padding: 24, textAlign: "center" }}><h1 style={{ fontFamily: "Georgia, serif", fontSize: 38 }}>We couldn’t find that product</h1><p style={{ color: "#62796a" }}>It may have moved off our sample shelves.</p><Link href="/" style={{ display: "inline-block", color: "#287A4B", fontWeight: 700 }}>← Back to shopping</Link></section></main>;
  }

  function addToCart() {
    const cart = readCart();
    const existing = cart.find((line) => line.productId === product.slug);
    if (existing) {
      saveCart(cart.map((line) => line.productId === product.slug ? { ...line, quantity: line.quantity + 1 } : line));
    } else {
      saveCart([...cart, { productId: product.slug, quantity: 1 }]);
    }
    setAdded(true);
  }

  return (
    <main style={{ background: "#FAF7F0", minHeight: "100vh", color: "#183B2B" }}>
      <StoreHeader />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px" }}>
        <Link href="/" style={{ color: "#287A4B", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>← Back to shopping</Link>
        <article style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 40, alignItems: "center", marginTop: 25, background: "#fff", border: "1px solid #e9e5db", borderRadius: 18, padding: "clamp(18px, 4vw, 40px)" }}>
          <div style={{ minHeight: 350, background: "#E5F2E8", borderRadius: 14, overflow: "hidden" }}><img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", minHeight: 350, objectFit: "cover" }} /></div>
          <div>
            <p style={{ color: "#287A4B", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{product.category}</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 5vw, 48px)", lineHeight: 1.1, margin: "10px 0" }}>{product.name}</h1>
            <p style={{ color: "#62796a", lineHeight: 1.7 }}>{product.description}</p>
            {product.tags.length > 0 && <p style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{product.tags.map((tag) => <span key={tag} style={{ background: "#E5F2E8", color: "#287A4B", borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 700 }}>{tag}</span>)}</p>}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "25px 0" }}><strong style={{ fontSize: 29, color: "#E66A45" }}>{money(product.price)}</strong><span style={{ color: "#718075" }}>{product.unit} · sample price</span></div>
            <button type="button" onClick={addToCart} style={{ border: 0, borderRadius: 999, padding: "14px 24px", background: "#287A4B", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Add to basket</button>
            {added && <p role="status" style={{ color: "#287A4B", fontWeight: 700, marginTop: 14 }}>{product.name} added to your basket.</p>}
            <p style={{ color: "#718075", fontSize: 12, lineHeight: 1.6, marginTop: 22 }}>This is a simulated product listing. Sample availability and prices are not a real offer.</p>
          </div>
        </article>
      </div>
    </main>
  );
}

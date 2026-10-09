"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import { CartLine, CART_KEY, Product } from "@/lib/grocery-data";

export function GroceryNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const lines = readLocal<CartLine[]>(CART_KEY, []);
      setCount(lines.reduce((total, line) => total + (Number(line.quantity) || 0), 0));
    };
    updateCount();
    window.addEventListener("aaa-cart-change", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("aaa-cart-change", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <>
      <div style={{ background: "#183B2B", color: "white", textAlign: "center", padding: "8px 14px", fontSize: 12, letterSpacing: ".02em" }}>
        Sample catalog, prices, availability, and fulfillment are demo data only.
      </div>
      <header style={{ background: "#fff", borderBottom: "1px solid #e9e4d9" }}>
        <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#183B2B", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 700 }}>AAA Grocery</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", fontSize: 14 }}>
            <Link href="/#catalog" style={navLink}>Shop groceries</Link>
            <Link href="/help" style={navLink}>Help</Link>
            <Link href="/account" style={navLink}>Account</Link>
            <Link href="/cart" style={{ ...navLink, background: "#287A4B", color: "white", padding: "10px 15px", borderRadius: 999, fontWeight: 700 }}>Basket ({count})</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

const navLink: React.CSSProperties = { color: "#183B2B", textDecoration: "none" };

export function ProductCard({ product }: { product: Product }) {
  return (
    <article style={{ background: "white", border: "1px solid #e9e4d9", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(24,59,43,.04)" }}>
      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <img src={product.image} alt={product.name} style={{ display: "block", width: "100%", height: 170, objectFit: "cover", background: "#E5F2E8" }} />
        <div style={{ padding: "14px 15px 16px" }}>
          <div style={{ color: "#6d786f", fontSize: 12, marginBottom: 7 }}>{product.category} · {product.size}</div>
          <div style={{ color: "#183B2B", fontWeight: 700, minHeight: 42, lineHeight: 1.35 }}>{product.name}</div>
          <div style={{ color: "#183B2B", fontWeight: 700, marginTop: 9 }}>${product.price.toFixed(2)} <span style={{ color: "#788078", fontWeight: 400, fontSize: 12 }}> · demo price</span></div>
          <span style={{ display: "inline-block", marginTop: 12, color: "#287A4B", fontWeight: 700, fontSize: 13 }}>View details →</span>
        </div>
      </Link>
    </article>
  );
}

export function PageFooter() {
  return <footer style={{ borderTop: "1px solid #e9e4d9", marginTop: 60, padding: "26px 20px", textAlign: "center", color: "#68746b", fontSize: 13 }}>AAA Grocery is a shopping demo. No real orders, payments, or retailer requests are made. <Link href="/help" style={{ color: "#287A4B" }}>How the demo works</Link></footer>;
}

export function emitCartChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-change"));
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartUnitCount, readCart } from "@/lib/grocery";

export default function StoreHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartUnitCount(readCart()));
    update();
    window.addEventListener("aaa-cart-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aaa-cart-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <div style={{ background: "#183B2B", color: "#fff", textAlign: "center", padding: "9px 16px", fontSize: 12, letterSpacing: ".02em" }}>
        A neighborhood grocery demo · Catalog, prices, and fulfillment are simulated
      </div>
      <header style={{ background: "#fff", borderBottom: "1px solid #e9e5db" }}>
        <nav aria-label="Main navigation" style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <Link href="/" style={{ color: "#183B2B", textDecoration: "none", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 25, whiteSpace: "nowrap" }}>AAA <span style={{ color: "#287A4B" }}>Grocery</span></Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#183B2B", fontSize: 14 }}>
            <Link href="/#catalog" style={{ color: "inherit", textDecoration: "none" }}>Shop</Link>
            <a href="mailto:hello@aaagrocery.example" style={{ color: "inherit", textDecoration: "none" }}>Help</a>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Account</Link>
            <Link href="/cart" aria-label={`Cart, ${count} items`} style={{ color: "#fff", background: "#287A4B", borderRadius: 999, padding: "9px 15px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Basket ({count})</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

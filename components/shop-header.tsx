"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/grocery-state";

export default function ShopHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    update();
    window.addEventListener("aaa-cart-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aaa-cart-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <>
    <div style={{ background: "#183b2b", color: "white", textAlign: "center", padding: "9px 12px", fontSize: 12, letterSpacing: ".04em" }}>A neighborhood grocery demo — catalog, prices, inventory, and fulfillment are simulated.</div>
    <header style={{ background: "#fff", borderBottom: "1px solid #e9e2d6" }}>
      <nav style={{ maxWidth: 1180, margin: "auto", minHeight: 72, padding: "12px 22px", display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#183b2b", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 27, fontWeight: 700 }}>AAA <span style={{ color: "#287a4b" }}>Grocery</span></Link>
        <Link href="/#shop" style={{ color: "#385443", textDecoration: "none" }}>Shop</Link>
        <Link href="/#categories" style={{ color: "#385443", textDecoration: "none" }}>Categories</Link>
        <span style={{ flex: 1 }} />
        <Link href="/orders/demo" style={{ color: "#385443", textDecoration: "none" }}>Help</Link>
        <Link href="/orders/demo" style={{ color: "#385443", textDecoration: "none" }}>Account</Link>
        <Link href="/cart" style={{ background: "#e5f2e8", borderRadius: 999, color: "#183b2b", padding: "10px 16px", textDecoration: "none", fontWeight: 700 }}>Basket ({count})</Link>
      </nav>
    </header>
  </>;
}

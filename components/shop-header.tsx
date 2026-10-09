"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";

const CART_KEY = "aaa-grocery-cart";

type CartEntry = { quantity?: number };

export default function ShopHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const cart = readLocal<CartEntry[]>(CART_KEY, []);
      setCount(Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0);
    };
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <div style={{ background: "#183B2B", color: "white", padding: "9px 16px", textAlign: "center", fontSize: 12, letterSpacing: ".03em" }}>
        A neighborhood grocery demo — catalog, prices, inventory, and fulfillment are simulated.
      </div>
      <header style={{ background: "#fff", borderBottom: "1px solid #e9e3d8" }}>
        <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "17px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#183B2B", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 27, fontWeight: 700, letterSpacing: "-.04em" }}>AAA Grocery<span style={{ color: "#287A4B" }}>.</span></Link>
          <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", fontSize: 14 }}>
            <Link href="/#shop" style={{ color: "#183B2B", textDecoration: "none" }}>Shop</Link>
            <Link href="/help" style={{ color: "#183B2B", textDecoration: "none" }}>Help</Link>
            <Link href="/help#account" style={{ color: "#183B2B", textDecoration: "none" }}>Account</Link>
            <Link href="/cart" aria-label={`Cart, ${count} items`} style={{ color: "#183B2B", textDecoration: "none", border: "1px solid #d8e5d9", background: "#f5faf5", borderRadius: 999, padding: "9px 15px", fontWeight: 700 }}>Basket ({count})</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

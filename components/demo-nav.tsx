"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import { CART_EVENT, CART_KEY, CartItem, validCart } from "@/lib/demo-store";

export default function DemoNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const cart = validCart(readLocal<CartItem[]>(CART_KEY, []));
      setCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <>
      <div style={{ background: "#183B2B", color: "#fff", textAlign: "center", padding: "8px 16px", fontSize: 13 }}>
        Sample catalog, prices, inventory, and fulfillment are demo data only.
      </div>
      <header style={{ background: "#fff", borderBottom: "1px solid #e9e3d7" }}>
        <nav style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#183B2B", fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 700, textDecoration: "none" }}>AAA Grocery</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 15 }}>
            <Link href="/" style={{ color: "#183B2B", textDecoration: "none" }}>Shop</Link>
            <Link href="/help" style={{ color: "#183B2B", textDecoration: "none" }}>Help</Link>
            <Link href="/account" style={{ color: "#183B2B", textDecoration: "none" }}>Account</Link>
            <Link href="/cart" style={{ color: "#fff", background: "#287A4B", borderRadius: 999, padding: "9px 15px", textDecoration: "none", fontWeight: 700 }}>Basket ({count})</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

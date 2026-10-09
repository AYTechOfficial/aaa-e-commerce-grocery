"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CART_STORAGE_KEY, formatPrice, getProductBySlug, readOrders, type DemoOrder } from "@/lib/grocery";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DemoOrder | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(readOrders().find((savedOrder) => savedOrder.id === id));
    setLoaded(true);
  }, [id]);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F0", color: "#183B2B", padding: "28px 20px" }}>
      <header style={{ maxWidth: 760, margin: "0 auto 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><Link href="/" style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 25, color: "#183B2B", textDecoration: "none" }}>AAA Grocery</Link><Link href="/orders" style={{ color: "#287A4B" }}>All demo orders</Link></header>
      <section style={{ maxWidth: 760, margin: "auto", background: "white", border: "1px solid #e9e6de", borderRadius: 16, padding: "clamp(22px, 5vw, 42px)" }}>
        {!loaded ? <p>Loading saved order…</p> : !order ? <><h1 style={{ fontFamily: "Georgia,serif", fontSize: 34 }}>Order not found</h1><p>This saved demo order could not be found in this browser.</p><Link href="/" style={{ color: "#287A4B", fontWeight: 700 }}>Continue shopping</Link></> : <>
          <p style={{ color: "#287A4B", fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>DEMO ORDER CONFIRMED</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 38, margin: "8px 0" }}>Thanks for your order.</h1>
          <p style={{ color: "#526358", lineHeight: 1.6 }}>This confirmation is saved locally for this demo. No payment or real delivery or pickup request was made.</p>
          <div style={{ background: "#E5F2E8", borderRadius: 12, padding: 16, margin: "22px 0" }}><strong>Order #{order.id}</strong><p style={{ margin: "8px 0 0" }}>{new Date(order.placedAt).toLocaleString()} · {order.fulfillment === "delivery" ? "Demo delivery" : "Demo pickup"}</p></div>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Order summary</h2>
          <div style={{ display: "grid", gap: 12 }}>{order.items.map((line) => { const product = getProductBySlug(line.productId); return <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}><span>{product?.name ?? "Catalog item"} × {line.quantity}</span><strong>{formatPrice((product?.price ?? 0) * line.quantity)}</strong></div>; })}</div>
          <div style={{ display: "grid", gap: 8, marginTop: 20 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div><div style={{ display: "flex", justifyContent: "space-between" }}><span>Demo fulfillment fee</span><span>{formatPrice(order.fee)}</span></div><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ddd", paddingTop: 12, fontSize: 18, fontWeight: 700 }}><span>Total</span><span>{formatPrice(order.total)}</span></div></div>
          <Link href="/" style={{ display: "inline-block", marginTop: 26, background: "#287A4B", color: "white", borderRadius: 9, padding: "12px 18px", textDecoration: "none", fontWeight: 700 }}>Continue shopping</Link>
        </>}
      </section>
    </main>
  );
}

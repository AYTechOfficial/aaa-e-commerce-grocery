"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StoreHeader from "@/components/store-header";
import { getProduct, money, ORDERS_STORAGE_KEY, type DemoOrder } from "@/lib/grocery";
import { readLocal } from "@/lib/persist";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  useEffect(() => {
    const saved = readLocal<DemoOrder[]>(ORDERS_STORAGE_KEY, []);
    setOrders(Array.isArray(saved) ? saved : []);
  }, []);

  const order = orders.find((savedOrder) => savedOrder.id === params.id);

  return (
    <main style={{ background: "#FAF7F0", minHeight: "100vh", color: "#183B2B" }}>
      <StoreHeader />
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "42px 24px 70px" }}>
        {order ? (
          <>
            <div style={{ textAlign: "center", padding: "30px 16px" }}>
              <div aria-hidden="true" style={{ display: "inline-flex", width: 54, height: 54, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "#E5F2E8", color: "#287A4B", fontSize: 28 }}>✓</div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, margin: "14px 0 8px" }}>Demo order saved</h1>
              <p style={{ color: "#62796a", lineHeight: 1.6 }}>Your order is saved locally for this demo. No payment or real fulfillment has been requested.</p>
              <p style={{ fontSize: 13, color: "#718075" }}>Order reference <strong style={{ color: "#183B2B" }}>{order.id}</strong></p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e9e5db", borderRadius: 16, padding: 22 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 25, marginTop: 0 }}>Order details</h2>
              <p style={{ color: "#62796a" }}>Fulfillment: <strong style={{ color: "#183B2B", textTransform: "capitalize" }}>{order.fulfillment}</strong></p>
              <p style={{ color: "#62796a" }}>Placed: {new Date(order.placedAt).toLocaleString()}</p>
              <div style={{ borderTop: "1px solid #eee9df", marginTop: 18, paddingTop: 12 }}>
                {order.items.map((line) => {
                  const product = getProduct(line.productId);
                  if (!product) return null;
                  return <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0ede6" }}><span>{line.quantity} × {product.name}<small style={{ display: "block", color: "#718075", marginTop: 3 }}>{money(product.price)} each</small></span><strong>{money(product.price * line.quantity)}</strong></div>;
                })}
              </div>
              <div style={{ display: "grid", gap: 9, paddingTop: 16, color: "#62796a", fontSize: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Simulated {order.fulfillment} fee</span><span>{money(order.fee)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#183B2B", fontWeight: 700, fontSize: 18, borderTop: "1px solid #eee9df", paddingTop: 12 }}><span>Demo total</span><span>{money(order.total)}</span></div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", background: "#fff", border: "1px solid #e9e5db", borderRadius: 16, padding: "48px 24px" }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34 }}>Order not found</h1>
            <p style={{ color: "#62796a", lineHeight: 1.6 }}>This demo order isn’t saved in this browser. Locally saved orders are only available on the device where they were placed.</p>
            <Link href="/" style={{ color: "#287A4B", fontWeight: 700 }}>Continue shopping</Link>
          </div>
        )}
      </section>
    </main>
  );
}

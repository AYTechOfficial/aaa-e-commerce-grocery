"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DemoNav from "@/components/demo-nav";
import { addProductsToCart, CART_KEY, CartItem, DemoOrder, money, ORDERS_KEY, products, readOrders, saveCart, validCart } from "@/lib/demo-store";
import { readLocal, writeLocal } from "@/lib/persist";

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [notice, setNotice] = useState("");
  const order = orders.find((item) => item.id === decodeURIComponent(params.orderId));

  useEffect(() => setOrders(readOrders()), []);

  function updateOrder(patch: Partial<DemoOrder>) {
    if (!order) return;
    const next = orders.map((item) => item.id === order.id ? { ...item, ...patch } : item);
    setOrders(next);
    writeLocal(ORDERS_KEY, next);
  }

  function buyAgain() {
    if (!order) return;
    const current = validCart(readLocal<CartItem[]>(CART_KEY, []));
    const additions = order.lines.map((line) => ({ productId: line.productId, quantity: line.quantity }));
    saveCart(addProductsToCart(current, additions));
    setNotice("The items from this order have been added to your basket.");
  }

  if (!order) return <main style={{ minHeight: "100vh", background: "#FAF7F0", color: "#183B2B" }}><DemoNav /><section style={{ maxWidth: 760, margin: "56px auto", padding: 24 }}><h1 style={{ fontFamily: "Georgia, serif", fontSize: 38 }}>Order not found</h1><p>This order isn’t in your locally saved demo history.</p><Link href="/orders" style={{ color: "#287A4B", fontWeight: 700 }}>Return to order history</Link></section></main>;

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F0", color: "#183B2B" }}>
      <DemoNav />
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "38px 20px 72px" }}>
        <Link href="/orders" style={{ color: "#287A4B", fontWeight: 700, textDecoration: "none" }}>← Order history</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 15, flexWrap: "wrap", margin: "20px 0 24px" }}><div><p style={{ color: "#287A4B", fontWeight: 700, margin: "0 0 6px" }}>DEMO ORDER</p><h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, margin: 0 }}>Order {order.id}</h1><p style={{ color: "#647167" }}>{new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</p></div><span style={{ background: "#E5F2E8", color: "#287A4B", borderRadius: 999, padding: "9px 14px", fontWeight: 700 }}>{order.status}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 20 }}>
          <section style={{ background: "#fff", border: "1px solid #e9e3d7", borderRadius: 15, padding: 22 }}><h2 style={{ fontFamily: "Georgia, serif", marginTop: 0 }}>Order summary</h2>{order.lines.map((line) => { const product = products.find((item) => item.id === line.productId); return <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: "1px solid #f0ece4" }}><span>{line.quantity} × {product?.name ?? "Sample item"}</span><strong>{money(line.unitPrice * line.quantity)}</strong></div>; })}<div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}><span>Subtotal</span><span>{money(order.subtotal)}</span></div><div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span>Demo {order.fulfillment} fee</span><span>{money(order.deliveryFee)}</span></div><div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span>Estimated tax</span><span>{money(order.tax)}</span></div><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e9e3d7", paddingTop: 14, marginTop: 14, fontSize: 19 }}><strong>Total</strong><strong>{money(order.total)}</strong></div></section>
          <section style={{ display: "grid", gap: 18, alignContent: "start" }}><div style={{ background: "#fff", border: "1px solid #e9e3d7", borderRadius: 15, padding: 22 }}><h2 style={{ fontFamily: "Georgia, serif", marginTop: 0 }}>Fulfillment & status</h2><p><strong>Demo {order.fulfillment}</strong></p><p style={{ color: "#647167", lineHeight: 1.6 }}>This is a locally saved sample order. No store, driver, or payment service has received it.</p><p style={{ color: "#647167" }}>Status: <strong style={{ color: "#183B2B" }}>{order.status}</strong></p></div>
            <div style={{ background: "#fff", border: "1px solid #e9e3d7", borderRadius: 15, padding: 22 }}><h2 style={{ fontFamily: "Georgia, serif", marginTop: 0 }}>Substitution proposal</h2><p style={{ color: "#536358", lineHeight: 1.6 }}>Demo proposal: if baby spinach is unavailable, substitute mixed tender greens at the same estimated price.</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button onClick={() => { updateOrder({ substitutionAccepted: true }); setNotice("Substitution preference saved for this demo order."); }} style={{ border: 0, borderRadius: 8, background: "#287A4B", color: "white", padding: "10px 13px", fontWeight: 700, cursor: "pointer" }}>Accept proposal</button><button onClick={() => { updateOrder({ substitutionAccepted: false }); setNotice("You declined the demo substitution proposal."); }} style={{ border: "1px solid #cbd8cd", borderRadius: 8, background: "white", color: "#183B2B", padding: "10px 13px", fontWeight: 700, cursor: "pointer" }}>Decline</button></div>{typeof order.substitutionAccepted === "boolean" && <p role="status" style={{ color: "#287A4B", fontWeight: 700 }}>Your choice: {order.substitutionAccepted ? "accepted" : "declined"}.</p>}</div>
            <div style={{ background: "#E5F2E8", borderRadius: 15, padding: 22 }}><h2 style={{ fontFamily: "Georgia, serif", marginTop: 0 }}>Need a hand?</h2><p>For questions about this demo, contact <a href="mailto:hello@aaagrocery.example" style={{ color: "#183B2B", fontWeight: 700 }}>hello@aaagrocery.example</a>. This inbox is illustrative and does not connect to a retailer.</p><Link href="/help" style={{ color: "#287A4B", fontWeight: 700 }}>Visit help & FAQs →</Link></div></section>
        </div>
        {notice && <p role="status" style={{ color: "#287A4B", fontWeight: 700, marginTop: 20 }}>{notice}</p>}
        <button onClick={buyAgain} style={{ border: 0, borderRadius: 9, background: "#287A4B", color: "white", padding: "13px 19px", marginTop: 22, fontWeight: 700, cursor: "pointer" }}>Buy again</button>
      </section>
    </main>
  );
}

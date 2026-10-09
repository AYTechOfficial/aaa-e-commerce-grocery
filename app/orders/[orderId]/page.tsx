"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type OrderItem = {
  id?: string;
  name?: string;
  quantity?: number;
  price?: number;
  substitution?: "approve" | "contact" | "no-substitution";
};

type OrderRecord = {
  id?: string;
  orderId?: string;
  storeName?: string;
  status?: string;
  fulfillment?: string;
  placedAt?: string;
  items?: OrderItem[];
  total?: number;
  substitutionPreference?: string;
};

const ordersKey = "local-grocery-orders";

function readOrders(): OrderRecord[] {
  const stored = readLocal<OrderRecord[]>(ordersKey, []);
  return Array.isArray(stored) ? stored : [];
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [order, setOrder] = useState<OrderRecord | undefined>();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = readOrders();
    setOrders(saved);
    setOrder(saved.find((item) => item.id === orderId || item.orderId === orderId));
  }, [orderId]);

  function savePreference(preference: "approve" | "contact" | "no-substitution") {
    if (!order) return;
    const nextOrder: OrderRecord = {
      ...order,
      items: (order.items ?? []).map((item) => ({ ...item, substitution: preference })),
      substitutionPreference: preference,
    };
    const nextOrders = orders.map((item) => item.id === orderId || item.orderId === orderId ? nextOrder : item);
    setOrders(nextOrders);
    setOrder(nextOrder);
    writeLocal(ordersKey, nextOrders);
    setNotice("Your substitution preference was saved for this simulated order.");
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-5 py-8 text-[#20352B]">
        <header className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
          <Link href="/" className="text-xl font-bold">🌿 Local Grocery</Link>
          <nav className="flex gap-5 text-sm font-semibold"><Link href="/" className="hover:text-[#2F7657]">Stores</Link><Link href="/cart" className="hover:text-[#2F7657]">Cart</Link><Link href="/orders" className="hover:text-[#2F7657]">Orders</Link></nav>
        </header>
        <div className="mx-auto mt-12 max-w-2xl">
          <EmptyState title="Order not found" message="We couldn’t find this order in the demo on this device." description="Orders are simulated and saved only in this browser. Visit order history or place a demo order to see its details." action={<Link href="/orders" className="inline-flex rounded-full bg-[#2F7657] px-5 py-3 font-semibold text-white hover:bg-[#255f46]">View order history</Link>} />
        </div>
      </main>
    );
  }

  const displayId = order.id || order.orderId || orderId;
  const status = order.status || "Order received";
  const statusTone = status.toLowerCase().includes("deliver") || status.toLowerCase().includes("complete") ? "pass" : "brand";
  const items = order.items ?? [];
  const preference = order.substitutionPreference || items.find((item) => item.substitution)?.substitution || "contact";

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#20352B]">
      <header className="border-b border-[#E5E8DF] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-xl font-bold">🌿 Local Grocery</Link>
          <nav className="flex gap-5 text-sm font-semibold"><Link href="/" className="hover:text-[#2F7657]">Stores</Link><Link href="/cart" className="hover:text-[#2F7657]">Cart</Link><Link href="/orders" className="hover:text-[#2F7657]">Orders</Link></nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <Link href="/orders" className="text-sm font-semibold text-[#2F7657] hover:underline">← Order history</Link>
        <div className="mt-5 flex flex-col justify-between gap-5 rounded-3xl border border-[#E5E8DF] bg-[radial-gradient(ellipse_at_top_right,_#E6F1E7,_#FFFFFF_68%)] p-7 md:flex-row md:items-center md:p-9">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#2F7657]">Simulated order</p>
            <h1 className="mt-2 font-serif text-4xl">Order details</h1>
            <p className="mt-2 text-[#6B756E]">{order.storeName || "Local store"} · Order {displayId}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end"><Badge tone={statusTone}>{status}</Badge><span className="text-sm text-[#6B756E]">{order.fulfillment || "Fulfillment details saved at checkout"}</span></div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="rounded-2xl border border-[#E5E8DF] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl">Your items</h2>
            <div className="mt-4 divide-y divide-[#E5E8DF]">
              {items.length ? items.map((item, index) => (
                <div key={item.id || `${item.name || "item"}-${index}`} className="flex items-center justify-between gap-4 py-4">
                  <div><p className="font-semibold">{item.name || "Grocery item"}</p><p className="mt-1 text-sm text-[#6B756E]">Quantity {item.quantity || 1}</p></div>
                  <span className="font-semibold">{typeof item.price === "number" ? currency(item.price * (item.quantity || 1)) : "—"}</span>
                </div>
              )) : <p className="py-5 text-sm text-[#6B756E]">Item details were not saved with this demo order.</p>}
            </div>
            <div className="mt-4 flex justify-between border-t border-[#E5E8DF] pt-4 font-bold"><span>Order total</span><span>{typeof order.total === "number" ? currency(order.total) : "Shown at checkout"}</span></div>
          </Card>

          <Card className="rounded-2xl border border-[#E5E8DF] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl">If an item is unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B756E]">Choose how this simulated order should handle a missing item. Your choice is saved on this device.</p>
            <div className="mt-5 space-y-3">
              <Button variant={preference === "approve" ? "primary" : "outline"} size="md" className="w-full" onClick={() => savePreference("approve")}>Choose a similar substitute</Button>
              <Button variant={preference === "contact" ? "primary" : "outline"} size="md" className="w-full" onClick={() => savePreference("contact")}>Ask me before substituting</Button>
              <Button variant={preference === "no-substitution" ? "primary" : "outline"} size="md" className="w-full" onClick={() => savePreference("no-substitution")}>Skip unavailable items</Button>
            </div>
            {notice && <p role="status" className="mt-4 rounded-xl bg-[#E6F1E7] p-3 text-sm font-semibold">{notice}</p>}
            <div className="mt-6 border-t border-[#E5E8DF] pt-5">
              <h3 className="font-bold">Demo support</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B756E]">Need help understanding this simulated order? Contact the demo team at <a className="font-semibold text-[#2F7657] underline" href="mailto:hello@localgrocery.demo">hello@localgrocery.demo</a>. No real order or delivery is created.</p>
            </div>
          </Card>
        </div>
        <p className="mt-6 text-center text-sm text-[#6B756E]">Status updates, inventory, and fulfillment are simulated for the Northside demo area.</p>
      </div>
    </main>
  );
}

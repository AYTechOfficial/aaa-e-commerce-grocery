"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type JsonObject = { [key: string]: unknown };
type DisplayItem = { id: string; name: string; quantity: number; price: number };

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Store (seeded client-side data)";
const STATUS_STEPS = ["Order placed", "Shopping", "Ready for handoff", "On the way", "Delivered"];
const DEFAULT_ITEMS: DisplayItem[] = [
  { id: "market-strawberries", name: "Organic strawberries", quantity: 1, price: 5.49 },
  { id: "market-sourdough", name: "Country sourdough loaf", quantity: 1, price: 6.25 },
  { id: "market-oat-milk", name: "Oat milk, original", quantity: 2, price: 4.19 },
];

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : null;
}

function stringValue(...values: unknown[]): string {
  for (const value of values) if (typeof value === "string" && value.trim()) return value;
  return "";
}

function numericValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function extractItems(order: JsonObject | null): DisplayItem[] {
  if (!order) return [];
  const rawItems = order.items ?? order.lineItems ?? order.products ?? order.basket;
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((raw, index) => {
    const item = asObject(raw) ?? {};
    const quantity = Math.max(1, numericValue(item.quantity ?? item.qty, 1));
    let price = numericValue(item.price ?? item.unitPrice ?? item.amount ?? item.priceEach, 0);
    if (price > 1000 && !item.priceIsCents) price /= 100;
    return {
      id: stringValue(item.id, item.productId) || `item-${index}`,
      name: stringValue(item.name, item.title, item.productName, item.label) || "Grocery item",
      quantity,
      price,
    };
  });
}

function findOrder(data: unknown, id: string): JsonObject | null {
  const root = asObject(data);
  if (!root) return null;
  const sourceKeys = ["orders", "demoOrders", "orderHistory", "purchaseHistory", "lastOrder", "order"];
  for (const key of sourceKeys) {
    const source = root[key];
    if (Array.isArray(source)) {
      const match = source.map(asObject).find((candidate) => candidate && stringValue(candidate.id, candidate.orderId) === id);
      if (match) return match;
    } else {
      const obj = asObject(source);
      if (obj && stringValue(obj.id, obj.orderId) === id) return obj;
      if (obj && asObject(obj[id])) return asObject(obj[id]);
    }
  }
  for (const value of Object.values(root)) {
    if (Array.isArray(value)) {
      const match = value.map(asObject).find((candidate) => candidate && stringValue(candidate.id, candidate.orderId) === id && (candidate.items || candidate.lineItems || candidate.fulfillment));
      if (match) return match;
    }
  }
  return null;
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function normalizedStatus(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("deliver") || value === "complete" || value === "completed") return "Delivered";
  if (value.includes("way") || value.includes("transit") || value.includes("driver")) return "On the way";
  if (value.includes("ready") || value.includes("pickup")) return "Ready for handoff";
  if (value.includes("shop") || value.includes("prepar")) return "Shopping";
  return "Order placed";
}

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = typeof params?.orderId === "string" ? decodeURIComponent(params.orderId) : "demo-order";
  const [storedData, setStoredData] = useState<unknown>(null);
  const [order, setOrder] = useState<JsonObject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = readLocal<unknown>(STORAGE_KEY, {});
    setStoredData(saved);
    setOrder(findOrder(saved, orderId));
    setLoaded(true);
  }, [orderId]);

  const items = useMemo(() => extractItems(order), [order]);
  const displayItems = items.length ? items : DEFAULT_ITEMS;
  const isSeededFallback = !order;
  const status = normalizedStatus(stringValue(order?.status, order?.statusLabel, order?.state));
  const activeStep = STATUS_STEPS.indexOf(status);
  const fulfillment = stringValue(order?.fulfillment, order?.fulfillmentOption, order?.deliveryOption, order?.method) || "Delivery";
  const orderTotal = numericValue(order?.total ?? order?.orderTotal, displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const subtotal = displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const substitutionChoice = stringValue(order?.substitutionChoice, order?.substitutionStatus);
  const substitutionResolved = substitutionChoice === "approved" || substitutionChoice === "rejected";

  function saveOrderUpdate(choice: "approved" | "rejected") {
    const root = asObject(storedData) ?? {};
    const currentOrder = order ?? {
      id: orderId,
      title: "Market basket",
      items: DEFAULT_ITEMS.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
      fulfillment: "Delivery",
      status: "Shopping",
      total: subtotal,
    };
    const updatedOrder: JsonObject = { ...currentOrder, substitutionChoice: choice };
    const nextRoot: JsonObject = { ...root };
    let updatedCollection = false;
    for (const key of ["orders", "demoOrders", "orderHistory", "purchaseHistory"]) {
      const collection = root[key];
      if (Array.isArray(collection)) {
        const foundIndex = collection.findIndex((entry) => stringValue(asObject(entry)?.id, asObject(entry)?.orderId) === orderId);
        if (foundIndex >= 0) {
          const updated = [...collection];
          updated[foundIndex] = updatedOrder;
          nextRoot[key] = updated;
          updatedCollection = true;
          break;
        }
      }
    }
    if (!updatedCollection) {
      const existingOrders = Array.isArray(root.orders) ? root.orders : [];
      nextRoot.orders = [...existingOrders, updatedOrder];
    }
    try {
      writeLocal(STORAGE_KEY, nextRoot);
      setStoredData(nextRoot);
      setOrder(updatedOrder);
      setNotice(choice === "approved" ? "Substitute approved. Your order details are up to date." : "Substitute declined. No replacement will be added.");
    } catch {
      setNotice("We couldn't save that choice. Please try again; your order is still available.");
    }
  }

  function reorder() {
    const cartItems = displayItems.map((item) => ({ id: item.id, productId: item.id, name: item.name, title: item.name, quantity: item.quantity, price: item.price }));
    const root = asObject(storedData) ?? {};
    const nextRoot: JsonObject = { ...root, cart: cartItems, cartItems };
    try {
      writeLocal(STORAGE_KEY, nextRoot);
      setStoredData(nextRoot);
      setNotice("Your previous basket is back in your cart. You can edit it before checkout.");
    } catch {
      setNotice("We couldn't restore this basket to your cart. Please try again.");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-5 py-12 text-[#1a1d21]">
        <div className="mx-auto max-w-4xl animate-pulse rounded-3xl bg-white p-8">
          <div className="h-5 w-32 rounded bg-stone-200" />
          <div className="mt-5 h-9 w-2/3 rounded bg-stone-200" />
          <div className="mt-8 h-48 rounded-2xl bg-stone-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 text-[#1a1d21]">
      <div className="mx-auto max-w-4xl">
        <Link href="/orders" className="text-sm text-stone-600 hover:text-stone-900">← Back to orders</Link>
        <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Order details</p>
            <h1 className="mt-1 text-3xl font-semibold">Order #{orderId}</h1>
            <p className="mt-2 text-sm text-stone-600">{fulfillment} · {status}</p>
          </div>
          <Badge tone={status === "Delivered" ? "pass" : "brand"}>{status}</Badge>
        </header>

        {isSeededFallback ? (
          <div className="mt-5">
            <EmptyState title="Showing a sample order" message="We couldn't find saved details for this order, so here's a sample basket." />
          </div>
        ) : null}

        <Card className="mt-6 !border-stone-200 !bg-white !text-[#1a1d21]">
          <h2 className="text-lg font-semibold">Order progress</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-5">
            {STATUS_STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-2 text-sm sm:flex-col sm:items-start">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${index <= activeStep ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-500"}`}>
                  {index + 1}
                </span>
                <span className={index <= activeStep ? "font-medium text-stone-900" : "text-stone-500"}>{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_280px]">
          <Card className="!border-stone-200 !bg-white !text-[#1a1d21]">
            <h2 className="text-lg font-semibold">Your items</h2>
            <ul className="mt-4 divide-y divide-stone-100">
              {displayItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-stone-500">Qty {item.quantity} · {money(item.price)} each</p>
                  </div>
                  <p className="shrink-0 font-medium">{money(item.quantity * item.price)}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-stone-200 pt-4 font-semibold">
              <span>Order total</span>
              <span>{money(orderTotal)}</span>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="!border-stone-200 !bg-white !text-[#1a1d21]">
              <h2 className="text-lg font-semibold">Substitution</h2>
              <p className="mt-2 text-sm text-stone-600">
                {substitutionResolved
                  ? `Your substitute was ${substitutionChoice}.`
                  : "A shopper may suggest a replacement if an item is unavailable."}
              </p>
              {!substitutionResolved ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => saveOrderUpdate("approved")}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => saveOrderUpdate("rejected")}>Decline</Button>
                </div>
              ) : null}
            </Card>
            <Card className="!border-stone-200 !bg-white !text-[#1a1d21]">
              <h2 className="text-lg font-semibold">Need help?</h2>
              <p className="mt-2 text-sm text-stone-600">Questions about your order? Our support team is here to help.</p>
              <Button className="mt-4" variant="secondary" onClick={() => setSupportOpen((open) => !open)}>
                {supportOpen ? "Hide support details" : "Contact support"}
              </Button>
              {supportOpen ? <p className="mt-3 text-sm text-stone-600">Contact us at support@example.com and include order #{orderId}.</p> : null}
            </Card>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={reorder}>Reorder these items</Button>
          <Link href="/" className="text-sm text-stone-600 hover:text-stone-900">Continue shopping</Link>
        </div>
        {notice ? <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p> : null}
      </div>
    </main>
  );
}

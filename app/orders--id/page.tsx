"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { readLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };
type OrderLine = { name: string; quantity: number; price: number; detail?: string };
type OrderView = {
  id: string;
  confirmation: string;
  fulfillment: string;
  placedAt: string;
  items: OrderLine[];
  subtotal?: number;
  tax?: number;
  fee?: number;
  total?: number;
};

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Product (static sample catalog)";
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function asObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed) && value.trim() !== "") return parsed;
  }
  return undefined;
}

function firstValue(objects: Record<string, unknown>[], keys: string[]): unknown {
  for (const object of objects) {
    for (const key of keys) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
    }
  }
  return undefined;
}

function findOrder(record: RecordItem | undefined, routeId: string): OrderView | null {
  if (!record) return null;
  const rawRecord = record as unknown as Record<string, unknown>;
  let parsedNotes: unknown;
  try {
    parsedNotes = record.notes ? JSON.parse(record.notes) : undefined;
  } catch {
    parsedNotes = undefined;
  }

  const layers: Record<string, unknown>[] = [rawRecord];
  const addLayer = (value: unknown) => {
    const object = asObject(value);
    if (object && !layers.includes(object)) layers.push(object);
  };
  addLayer(parsedNotes);
  for (const layer of [...layers]) {
    addLayer(layer.order);
    addLayer(layer.details);
    addLayer(layer.payload);
    addLayer(layer.data);
    addLayer(layer.confirmation);
  }

  const rawItems = firstValue(layers, ["items", "orderItems", "products", "lines", "cart"]);
  const items: OrderLine[] = Array.isArray(rawItems)
    ? rawItems.map((entry) => {
        const item = asObject(entry) ?? {};
        const product = asObject(item.product) ?? {};
        const nameValue = item.name ?? item.title ?? product.name ?? product.title;
        const price = numberValue(item.unitPrice ?? item.price ?? item.amount ?? product.price) ?? 0;
        const quantity = Math.max(1, numberValue(item.quantity ?? item.qty) ?? 1);
        const detailValue = item.size ?? item.unit ?? item.detail ?? product.size ?? product.unit;
        return {
          name: typeof nameValue === "string" && nameValue.trim() ? nameValue : "Sample grocery item",
          quantity,
          price,
          detail: typeof detailValue === "string" ? detailValue : undefined,
        };
      })
    : [];

  const fulfillmentRaw = firstValue(layers, ["fulfillment", "fulfillmentType", "deliveryMethod", "method"]);
  const fulfillment = typeof fulfillmentRaw === "string" && fulfillmentRaw.trim()
    ? fulfillmentRaw
    : "Pickup";
  const placedRaw = firstValue(layers, ["placedAt", "createdAt", "date", "orderDate"]);
  const placedAt = typeof placedRaw === "string" ? placedRaw : record.createdAt;
  const subtotal = numberValue(firstValue(layers, ["subtotal", "itemSubtotal"]));
  const tax = numberValue(firstValue(layers, ["tax", "estimatedTax"]));
  const fee = numberValue(firstValue(layers, ["fee", "fulfillmentFee", "deliveryFee", "pickupFee"]));
  const total = numberValue(firstValue(layers, ["total", "orderTotal", "grandTotal"]));

  return {
    id: record.id || routeId,
    confirmation: String(firstValue(layers, ["confirmationNumber", "confirmation", "orderNumber"]) ?? record.id ?? routeId),
    fulfillment,
    placedAt,
    items,
    subtotal,
    tax,
    fee,
    total,
  };
}

function displayDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(date);
}

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const routeId = decodeURIComponent(params?.id ?? "");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = readLocal<RecordItem[]>(STORAGE_KEY, []);
      setRecords(Array.isArray(saved) ? saved : []);
    } catch {
      setRecords([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const order = useMemo(() => {
    const match = records.find((item) => item.id === routeId);
    return findOrder(match, routeId);
  }, [records, routeId]);

  const subtotalFromLines = order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const subtotal = order?.subtotal ?? subtotalFromLines;
  const tax = order?.tax ?? 0;
  const fee = order?.fee ?? 0;
  const total = order?.total ?? subtotal + tax + fee;
  const fulfillmentLabel = order?.fulfillment.toLowerCase().includes("deliver") ? "Delivery" : "Pickup";

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <header className="border-b border-[#e9e6e1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="AAA Grocery home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1a1d21] text-lg font-bold text-white">A</span>
            <span className="text-lg font-bold tracking-tight">AAA <span className="font-medium">Grocery</span></span>
          </Link>
          <Link href="/help" className="rounded-full px-4 py-2 text-sm font-semibold text-[#454b53] transition hover:bg-[#f3f2ef]">Help</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        {!loaded ? (
          <div className="rounded-3xl border border-[#e9e6e1] bg-white p-8 text-sm text-[#626970]">Loading your saved order…</div>
        ) : !order ? (
          <section className="rounded-[2rem] border border-[#e9e6e1] bg-white px-6 py-12 text-center shadow-[0_18px_60px_rgba(26,29,33,0.05)] sm:px-12">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#f0f4ff] text-2xl text-[#4f8cff]" aria-hidden="true">⌕</div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8cff]">Saved order lookup</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">We couldn’t find that order</h1>
            <p className="mx-auto mt-4 max-w-xl break-words text-sm leading-6 text-[#626970]">
              This confirmation may have been cleared from this browser, or the link may be incomplete. Demo order history is saved locally and may not be available on another device or browser session.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/account" className="rounded-full bg-[#1a1d21] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#353a40]">View order history</Link>
              <Link href="/" className="rounded-full border border-[#d9d7d2] px-6 py-3 text-sm font-bold text-[#1a1d21] transition hover:bg-[#faf9f7]">Back to shopping</Link>
            </div>
          </section>
        ) : (
          <>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dbe8dc] bg-[#f1f8f1] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#386640]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#dceedd] text-sm" aria-hidden="true">✓</span>
              Demo order saved
            </div>

            <section className="relative overflow-hidden rounded-[2rem] bg-[#1a1d21] px-6 py-9 text-white shadow-[0_24px_70px_rgba(26,29,33,0.14)] sm:px-10 sm:py-11">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[1px] border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border-[1px] border-white/10" />
              <div className="relative max-w-2xl">
                <p className="text-sm font-semibold text-[#a9c7ff]">Your basket is in good hands (in this demo).</p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Thanks for your order.</h1>
                <p className="mt-4 max-w-xl break-words text-sm leading-6 text-white/70">
                  Your demo confirmation is saved in this browser. No real payment was taken, and no order was submitted to a store.
                </p>
                <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Confirmation</p>
                    <p className="mt-1 break-all font-mono text-sm font-semibold">{order.confirmation}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Fulfillment</p>
                    <p className="mt-1 text-sm font-semibold">{fulfillmentLabel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Placed</p>
                    <p className="mt-1 text-sm font-semibold">{displayDate(order.placedAt)}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.35fr_0.85fr]">
              <section className="rounded-[1.5rem] border border-[#e9e6e1] bg-white p-5 shadow-[0_8px_32px_rgba(26,29,33,0.035)] sm:p-7">
                <div className="flex items-end justify-between gap-4 border-b border-[#efede9] pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#858a90]">Order details</p>
                    <h2 className="mt-1 font-serif text-2xl font-semibold">Your items</h2>
                  </div>
                  {order.items.length > 0 && <span className="rounded-full bg-[#f4f3f0] px-3 py-1 text-xs font-semibold text-[#626970]">{order.items.reduce((count, item) => count + item.quantity, 0)} items</span>}
                </div>
                {order.items.length ? (
                  <ul className="divide-y divide-[#efede9]">
                    {order.items.map((item, index) => (
                      <li key={`${item.name}-${index}`} className="flex min-w-0 items-center justify-between gap-4 py-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f5f3ee] text-sm" aria-hidden="true">🥬</span>
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold">{item.name}</p>
                            <p className="mt-1 break-words text-xs text-[#777d83]">Qty {item.quantity}{item.detail ? ` · ${item.detail}` : ""}</p>
                          </div>
                        </div>
                        <p className="shrink-0 text-sm font-semibold">{currency.format(item.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="my-5 rounded-2xl bg-[#faf9f7] p-5 text-sm leading-6 text-[#626970]">
                    Item details are not available in this saved confirmation. Your order total and confirmation details are shown here when saved data includes them.
                  </div>
                )}
                <div className="mt-2 border-t border-[#efede9] pt-4">
                  <div className="flex justify-between py-1.5 text-sm text-[#626970]"><span>Items subtotal</span><span>{currency.format(subtotal)}</span></div>
                  <div className="flex justify-between py-1.5 text-sm text-[#626970]"><span>Estimated tax</span><span>{currency.format(tax)}</span></div>
                  <div className="flex justify-between py-1.5 text-sm text-[#626970]"><span>{fulfillmentLabel} fee</span><span>{fee === 0 ? "Free" : currency.format(fee)}</span></div>
                  <div className="mt-3 flex justify-between border-t border-[#efede9] pt-4 text-base font-bold"><span>Demo total</span><span>{currency.format(total)}</span></div>
                </div>
              </section>

              <aside className="space-y-4">
                <section className="rounded-[1.5rem] border border-[#dce7fa] bg-[#f0f5ff] p-5 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg" aria-hidden="true">✳</div>
                  <h2 className="mt-4 font-serif text-xl font-semibold">A note about this demo</h2>
                  <p className="mt-2 break-words text-sm leading-6 text-[#505d70]">Prices, taxes, fees, inventory, and fulfillment are sample data. This page does not connect to a retailer, payment service, delivery tracking, or live customer support.</p>
                </section>
                <section className="rounded-[1.5rem] border border-[#e9e6e1] bg-white p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#858a90]">What now?</p>
                  <p className="mt-2 text-sm leading-6 text-[#626970]">You can revisit this confirmation from your account while this browser’s local demo data remains available.</p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link href="/account" className="flex items-center justify-center rounded-full bg-[#1a1d21] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#353a40]">Go to order history</Link>
                    <Link href="/help" className="flex items-center justify-center rounded-full border border-[#dedcd7] px-5 py-3 text-sm font-bold text-[#1a1d21] transition hover:bg-[#faf9f7]">Demo help & FAQs</Link>
                    <Link href="/" className="flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-[#4f8cff] transition hover:bg-[#f5f8ff]">Back to shopping</Link>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

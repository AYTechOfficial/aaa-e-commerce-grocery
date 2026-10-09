"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Store (seeded client-side data)";

type CartLine = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: unknown;
};

type Fulfillment = "delivery" | "pickup";

type StoredData = {
  [key: string]: unknown;
  cart?: unknown;
  orders?: unknown;
};

function asObject(value: unknown): StoredData | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as StoredData)
    : null;
}

function asCartLine(value: unknown): CartLine | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const title = String(item.title ?? item.name ?? item.productName ?? "Grocery item");
  const priceValue = Number(item.price ?? item.unitPrice ?? item.amount ?? 0);
  const quantityValue = Number(item.quantity ?? item.qty ?? 1);
  return {
    ...item,
    id: String(item.id ?? item.productId ?? title),
    title,
    price: Number.isFinite(priceValue) ? priceValue : 0,
    quantity: Number.isFinite(quantityValue) ? Math.max(1, Math.floor(quantityValue)) : 1,
    image: typeof item.image === "string" ? item.image : undefined,
  };
}

function readCart(data: unknown): CartLine[] {
  if (Array.isArray(data)) return data.map(asCartLine).filter((line): line is CartLine => line !== null);
  const root = asObject(data);
  if (!root) return [];
  const nested = asObject(root.cart);
  const candidates = Array.isArray(root.cart)
    ? root.cart
    : Array.isArray(nested?.items)
      ? nested.items
      : Array.isArray(root.items)
        ? root.items
        : Array.isArray(root.basket)
          ? root.basket
          : [];
  return candidates.map(asCartLine).filter((line): line is CartLine => line !== null);
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function CartPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [savedData, setSavedData] = useState<unknown>(null);
  const [items, setItems] = useState<CartLine[]>([]);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const data = readLocal<unknown>(STORAGE_KEY, {});
    setSavedData(data);
    setItems(readCart(data));
    setReady(true);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const deliveryFee = fulfillment === "delivery" && items.length ? 4.99 : 0;
  const serviceFee = items.length ? 1.49 : 0;
  const tax = (subtotal + deliveryFee + serviceFee) * 0.0825;
  const total = subtotal + deliveryFee + serviceFee + tax;

  function saveItems(next: CartLine[]) {
    setItems(next);
    setError("");
    const root = asObject(savedData);
    let updated: unknown;
    if (Array.isArray(savedData)) {
      updated = next;
    } else if (root) {
      const previousCart = asObject(root.cart);
      updated = {
        ...root,
        cart: previousCart && Array.isArray(previousCart.items)
          ? { ...previousCart, items: next }
          : next,
      };
    } else {
      updated = { cart: next };
    }
    try {
      writeLocal(STORAGE_KEY, updated);
      setSavedData(updated);
    } catch {
      setError("We couldn’t save that basket change. Please try again.");
    }
  }

  function changeQuantity(id: string, amount: number) {
    const next = items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0);
    saveItems(next);
  }

  function placeOrder() {
    if (!items.length || placing) return;
    setError("");
    setPlacing(true);
    const orderId = `demo-${Date.now().toString(36)}`;
    const order = {
      id: orderId,
      status: "Order received",
      simulated: true,
      fulfillment,
      items: items.map((item) => ({ ...item })),
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };
    const root = asObject(savedData) ?? {};
    const existingOrders = Array.isArray(root.orders) ? root.orders : [];
    const updated = { ...root, cart: [], orders: [...existingOrders, order] };
    try {
      writeLocal(STORAGE_KEY, updated);
      setSavedData(updated);
      setItems([]);
      router.push(`/orders/${encodeURIComponent(orderId)}`);
    } catch {
      setError("Your demo order couldn’t be saved. Your basket is still here—please try again.");
      setPlacing(false);
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-5 py-10 text-[#1a1d21]">
        <div className="mx-auto max-w-6xl animate-pulse rounded-3xl bg-white p-8 text-sm text-[#6f7378] shadow-sm">Loading your basket…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#656a70] transition hover:text-[#1a1d21]">
          <span aria-hidden="true">←</span> Keep shopping
        </a>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4f8cff]">Your neighborhood basket</p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Your basket<span className="text-[#4f8cff]">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f7378]">A few good things, delivered on your terms. Review the demo costs before you place your order.</p>
          </div>
          {items.length > 0 && <Badge tone="brand">{items.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>}
        </div>

        {error && <div role="alert" className="mt-6 rounded-2xl border border-[#f0c7c1] bg-[#fff6f4] px-4 py-3 text-sm text-[#9b3426]">{error}</div>}

        {!items.length ? (
          <Card className="mt-8 rounded-3xl border border-[#eeece8] bg-white p-8 shadow-sm sm:p-12">
            <EmptyState
              title="Your basket is taking a breather"
              message="Head back to the shop and add a few fresh finds. They’ll be waiting here when you return."
              icon="🧺"
              action={<Button variant="primary" onClick={() => router.push("/")}>Explore the shop</Button>}
              className="py-8"
            />
          </Card>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section aria-label="Basket items" className="space-y-4">
              <Card className="overflow-hidden rounded-3xl border border-[#eeece8] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f0efed] px-5 py-4 sm:px-7">
                  <h2 className="text-base font-bold">Basket items</h2>
                  <span className="text-xs text-[#777b80]">Quantities can be changed anytime</span>
                </div>
                <ul className="divide-y divide-[#f0efed]">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 px-5 py-5 sm:gap-5 sm:px-7">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f2ee] text-2xl">
                        {item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : "🥬"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="break-words pr-2 text-sm font-semibold leading-5">{item.title}</h3>
                          <span className="whitespace-nowrap text-sm font-bold">{money(item.price * item.quantity)}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#777b80]">{money(item.price)} each</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-[#e8e6e2] bg-[#faf9f7] p-1">
                            <button type="button" aria-label={`Decrease ${item.title} quantity`} onClick={() => changeQuantity(item.id, -1)} className="h-7 w-7 rounded-full text-lg leading-none text-[#51565c] transition hover:bg-white">−</button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button type="button" aria-label={`Increase ${item.title} quantity`} onClick={() => changeQuantity(item.id, 1)} className="h-7 w-7 rounded-full text-lg leading-none text-[#51565c] transition hover:bg-white">+</button>
                          </div>
                          <button type="button" onClick={() => saveItems(items.filter((candidate) => candidate.id !== item.id))} className="text-xs font-semibold text-[#777b80] underline decoration-[#d4d1cc] underline-offset-4 transition hover:text-[#b34332]">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
              <div className="rounded-2xl border border-[#e9e5de] bg-[#f3f0e9] px-5 py-4 text-xs leading-5 text-[#6f6c65]">
                <span className="mr-2">✦</span>Demo checkout only. Prices, availability, fees, and tax are illustrative and aren’t a live quote.
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6">
              <Card className="rounded-3xl border border-[#eeece8] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold">How would you like it?</h2>
                <p className="mt-1 text-xs leading-5 text-[#777b80]">Choose an available demo fulfillment option.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {([
                    ["delivery", "Delivery", "To your door"],
                    ["pickup", "Pickup", "Collect in store"],
                  ] as const).map(([value, label, detail]) => (
                    <button key={value} type="button" onClick={() => setFulfillment(value)} aria-pressed={fulfillment === value} className={`rounded-2xl border p-3 text-left transition ${fulfillment === value ? "border-[#4f8cff] bg-[#f0f6ff] ring-1 ring-[#4f8cff]" : "border-[#e9e7e3] bg-white hover:border-[#b8cffa]"}`}>
                      <span className="flex items-center justify-between text-sm font-bold">{label}<span className={`flex h-4 w-4 items-center justify-center rounded-full border ${fulfillment === value ? "border-[#4f8cff] bg-[#4f8cff] text-[10px] text-white" : "border-[#c9c7c2]"}`}>{fulfillment === value ? "✓" : ""}</span></span>
                      <span className="mt-1 block text-[11px] text-[#777b80]">{detail}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#f0efed] pt-5">
                  <h3 className="mb-4 text-sm font-bold">Cost breakdown <span className="font-normal text-[#85888c]">· demo</span></h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-[#6f7378]">Items subtotal</dt><dd className="font-medium">{money(subtotal)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-[#6f7378]">{fulfillment === "delivery" ? "Delivery fee" : "Pickup fee"}</dt><dd className="font-medium">{deliveryFee ? money(deliveryFee) : "Free"}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-[#6f7378]">Service fee</dt><dd className="font-medium">{money(serviceFee)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-[#6f7378]">Estimated tax</dt><dd className="font-medium">{money(tax)}</dd></div>
                  </dl>
                  <div className="mt-5 flex items-baseline justify-between border-t border-[#f0efed] pt-4">
                    <span className="font-bold">Order total</span><span className="text-2xl font-bold tracking-tight">{money(total)}</span>
                  </div>
                  <Button variant="primary" size="lg" onClick={placeOrder} disabled={placing} className="mt-5 w-full">
                    {placing ? "Placing demo order…" : "Place demo order"}
                  </Button>
                  <p className="mt-3 text-center text-[11px] leading-4 text-[#85888c]">Simulated order · no payment will be taken</p>
                </div>
              </Card>
              <p className="px-2 text-[11px] leading-5 text-[#85888c]">Basket state is saved in this browser only. Clearing browser data removes it, and it won’t sync to other devices.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

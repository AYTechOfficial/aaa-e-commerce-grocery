"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };
type CartItem = { id: string; title: string; price: number; quantity: number; unit?: string; image?: string };
type Fulfillment = "delivery" | "pickup";
type OrderItem = CartItem & { substitution: "allow" | "none" };
type DemoOrder = {
  id: string;
  confirmation: string;
  fulfillment: Fulfillment;
  customerName: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  createdAt: string;
};
type SavedState = {
  cart?: CartItem[];
  substitutions?: Record<string, "allow" | "none">;
  fulfillment?: Fulfillment;
  customerName?: string;
  address?: string;
  orders?: DemoOrder[];
};

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Product (static sample catalog)";
const STATE_ID = "__aaa_checkout_state__";
const DELIVERY_FEE = 5.99;
const SERVICE_FEE = 1.49;
const TAX_RATE = 0.0825;
const money = (value: number) => `$${value.toFixed(2)}`;

function parseJson(value: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function toCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const id = String(item.id ?? item.slug ?? item.productId ?? "");
  const title = String(item.title ?? item.name ?? "");
  const price = Number(item.price ?? item.unitPrice ?? 0);
  const quantity = Math.max(1, Math.floor(Number(item.quantity ?? item.qty ?? 1)));
  if (!id || !title || !Number.isFinite(price) || price < 0) return null;
  return {
    id,
    title,
    price,
    quantity,
    unit: typeof item.unit === "string" ? item.unit : typeof item.size === "string" ? item.size : undefined,
    image: typeof item.image === "string" ? item.image : undefined,
  };
}

function readSavedState(records: RecordItem[]): SavedState {
  const stateRecord = records.find((record) => record.id === STATE_ID);
  const parsed = stateRecord ? parseJson(stateRecord.notes) : null;
  const saved = parsed ? ({ ...parsed } as SavedState) : {};
  if (!saved.cart) {
    const inferred: CartItem[] = [];
    for (const record of records) {
      if (record.id === STATE_ID) continue;
      const detail = parseJson(record.notes);
      if (!detail) continue;
      const quantity = Number(detail.cartQuantity ?? detail.cartQty);
      if (!(detail.inCart === true || quantity > 0)) continue;
      const product = toCartItem({ ...detail, id: record.id, title: detail.title ?? record.title, quantity });
      if (product) inferred.push(product);
    }
    saved.cart = inferred;
  }
  saved.cart = (Array.isArray(saved.cart) ? saved.cart : []).map(toCartItem).filter((item): item is CartItem => item !== null);
  saved.substitutions = saved.substitutions && typeof saved.substitutions === "object" ? saved.substitutions : {};
  saved.orders = Array.isArray(saved.orders) ? saved.orders : [];
  saved.fulfillment = saved.fulfillment === "pickup" ? "pickup" : "delivery";
  return saved;
}

export default function CheckoutPage() {
  const recordsRef = useRef<RecordItem[]>([]);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [substitutions, setSubstitutions] = useState<Record<string, "allow" | "none">>({});
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const raw = readLocal<RecordItem[]>(STORAGE_KEY, []);
    const records = Array.isArray(raw) ? raw : [];
    recordsRef.current = records;
    const saved = readSavedState(records);
    setCart(saved.cart ?? []);
    setSubstitutions(saved.substitutions ?? {});
    setFulfillment(saved.fulfillment ?? "delivery");
    setCustomerName(saved.customerName ?? "");
    setAddress(saved.address ?? "");
    setOrders(saved.orders ?? []);
    setReady(true);
  }, []);

  const persist = (next: Partial<SavedState>) => {
    const existing = readSavedState(recordsRef.current);
    const combined: SavedState = { ...existing, cart, substitutions, fulfillment, customerName, address, orders, ...next };
    const withoutState = recordsRef.current.filter((record) => record.id !== STATE_ID);
    const stateRecord: RecordItem = {
      id: STATE_ID,
      title: "Checkout demo state",
      notes: JSON.stringify(combined),
      createdAt: new Date().toISOString(),
    };
    const updated = [...withoutState, stateRecord];
    recordsRef.current = updated;
    writeLocal(STORAGE_KEY, updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && cart.length ? DELIVERY_FEE : 0;
  const serviceFee = cart.length ? SERVICE_FEE : 0;
  const tax = cart.length ? subtotal * TAX_RATE : 0;
  const total = subtotal + deliveryFee + serviceFee + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const changeFulfillment = (next: Fulfillment) => {
    setFulfillment(next);
    setError("");
    persist({ fulfillment: next });
  };

  const setPreference = (id: string, choice: "allow" | "none") => {
    const next = { ...substitutions, [id]: choice };
    setSubstitutions(next);
    persist({ substitutions: next });
  };

  const submitOrder = () => {
    if (placing) return;
    if (!cart.length) {
      setError("Your cart is empty. Add a few items before placing a demo order.");
      return;
    }
    if (!customerName.trim()) {
      setError("Please enter a name for this demo order.");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      setError("Please enter a delivery address to continue.");
      return;
    }
    setError("");
    setPlacing(true);
    try {
      const id = `demo-${Date.now().toString(36)}`;
      const order: DemoOrder = {
        id,
        confirmation: `AAA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        fulfillment,
        customerName: customerName.trim(),
        address: fulfillment === "delivery" ? address.trim() : "AAA Market pickup counter",
        items: cart.map((item) => ({ ...item, substitution: substitutions[item.id] ?? "allow" })),
        subtotal,
        deliveryFee,
        serviceFee,
        tax,
        total,
        createdAt: new Date().toISOString(),
      };
      const nextOrders = [order, ...orders];
      setOrders(nextOrders);
      setCart([]);
      persist({ cart: [], orders: nextOrders, customerName: customerName.trim(), address: address.trim(), fulfillment });
      window.location.assign(`/orders/${encodeURIComponent(id)}`);
    } catch {
      setError("We couldn’t save this demo order. Your cart is still here—please try again.");
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21] font-['DM_Sans']">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="AAA Grocery home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1a1d21] text-lg font-bold text-white">A</span>
            <span className="font-['DM_Serif_Display'] text-2xl tracking-tight">AAA Grocery</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/cart" className="rounded-full border border-black/10 px-4 py-2 hover:bg-[#faf9f7]">Cart <span className="ml-1 text-[#4f8cff]">{itemCount}</span></Link>
            <Link href="/help" className="hidden text-black/60 hover:text-black sm:inline">Help</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-9 overflow-hidden rounded-[2rem] bg-[#1a1d21] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2"><Badge tone="brand">DEMO CHECKOUT</Badge><span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">No payment · no store order</span></div>
              <h1 className="font-['DM_Serif_Display'] text-4xl leading-tight sm:text-5xl">The good stuff, <span className="text-[#8fb5ff]">your way.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Choose a sample fulfillment option, tell us how to handle substitutions, and check the demo total before you place your order.</p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/5 px-4 py-3 sm:self-auto">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#4f8cff] text-xl">✳</span>
              <div><p className="text-xs text-white/55">Sample basket</p><p className="font-semibold">{itemCount} {itemCount === 1 ? "item" : "items"}</p></div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/55"><span className="rounded-full bg-white/10 px-3 py-1.5">Sample prices & inventory</span><span className="rounded-full bg-white/10 px-3 py-1.5">Fees are estimates</span><span className="rounded-full bg-white/10 px-3 py-1.5">Availability is not live</span></div>
        </div>

        {!ready ? (
          <Card className="p-8 text-center text-sm text-black/55">Preparing your saved demo basket…</Card>
        ) : cart.length === 0 ? (
          <Card className="mx-auto max-w-2xl p-8 sm:p-12">
            <EmptyState title="Your basket is taking a breather" message="Add sample groceries to your cart before checking out." description="Your cart stays empty until you choose Add to cart on a product. Demo checkout cannot submit a real store order." icon="🧺" action={<Link href="/"><Button variant="primary">Browse groceries</Button></Link>} />
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          </Card>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-7">
              <section>
                <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f8cff]">01 · Fulfillment</p><h2 className="mt-1 font-['DM_Serif_Display'] text-3xl">How should we get it to you?</h2></div><span className="hidden text-xs text-black/45 sm:block">Demo options only</span></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["delivery", "pickup"] as Fulfillment[]).map((option) => {
                    const selected = fulfillment === option;
                    return <button key={option} type="button" onClick={() => changeFulfillment(option)} aria-pressed={selected} className={`rounded-2xl border-2 p-5 text-left transition ${selected ? "border-[#4f8cff] bg-[#eef4ff] shadow-[0_8px_24px_rgba(79,140,255,0.1)]" : "border-black/10 bg-white hover:border-black/25"}`}>
                      <span className="flex items-start justify-between"><span className="text-2xl">{option === "delivery" ? "⌂" : "↗"}</span><span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? "border-[#4f8cff] bg-[#4f8cff] text-xs text-white" : "border-black/20"}`}>{selected ? "✓" : ""}</span></span>
                      <span className="mt-4 block text-lg font-bold">{option === "delivery" ? "Delivery" : "Pickup"}</span>
                      <span className="mt-1 block text-sm leading-5 text-black/55">{option === "delivery" ? "A sample doorstep delivery option." : "Collect at the sample AAA Market counter."}</span>
                      <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-black/65">{option === "delivery" ? `${money(DELIVERY_FEE)} estimated fee` : "No delivery fee"}</span>
                    </button>;
                  })}
                </div>
                <Card className="mt-4 p-5 sm:p-6">
                  <h3 className="font-bold">{fulfillment === "delivery" ? "Delivery details" : "Pickup details"}</h3>
                  <p className="mt-1 text-sm text-black/55">{fulfillment === "delivery" ? "Enter any sample address; this demo does not check service areas or dispatch a driver." : "Your sample pickup location is AAA Market. No pickup slot is reserved."}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold">Name <span className="text-[#4f8cff]">Required</span><input value={customerName} onChange={(event) => { setCustomerName(event.target.value); persist({ customerName: event.target.value }); }} autoComplete="name" className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#4f8cff] focus:ring-4 focus:ring-[#4f8cff]/10" placeholder="Name for this demo order" /></label>
                    {fulfillment === "delivery" ? <label className="block text-sm font-semibold">Delivery address <span className="text-[#4f8cff]">Required</span><input value={address} onChange={(event) => { setAddress(event.target.value); persist({ address: event.target.value }); }} autoComplete="street-address" className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#4f8cff] focus:ring-4 focus:ring-[#4f8cff]/10" placeholder="Street address" /></label> : <div className="rounded-xl bg-[#faf9f7] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-black/45">Sample pickup point</p><p className="mt-1 font-semibold">AAA Market · Pickup counter</p></div>}
                  </div>
                </Card>
              </section>

              <section>
                <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f8cff]">02 · Substitutions</p><h2 className="mt-1 font-['DM_Serif_Display'] text-3xl">If something is missing</h2><p className="mt-2 text-sm text-black/55">Choose your preference for every item. These are saved with this demo basket.</p></div>
                <Card className="divide-y divide-black/5 px-5 sm:px-6">
                  {cart.map((item) => {
                    const choice = substitutions[item.id] ?? "allow";
                    return <div key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#faf9f7] text-xl">🥬</span><div className="min-w-0"><p className="break-words font-semibold">{item.title}</p><p className="mt-1 text-sm text-black/50">{item.quantity} × {money(item.price)}{item.unit ? ` · ${item.unit}` : ""}</p></div></div>
                      <div className="grid grid-cols-2 gap-2 sm:min-w-[300px]">
                        <button type="button" onClick={() => setPreference(item.id, "allow")} aria-pressed={choice === "allow"} className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${choice === "allow" ? "border-[#4f8cff] bg-[#eef4ff] text-[#245ab1]" : "border-black/10 bg-white text-black/60 hover:border-black/25"}`}><span className="block font-bold">Suggest a swap</span><span className="mt-1 block leading-4">Allow a similar item</span></button>
                        <button type="button" onClick={() => setPreference(item.id, "none")} aria-pressed={choice === "none"} className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${choice === "none" ? "border-[#4f8cff] bg-[#eef4ff] text-[#245ab1]" : "border-black/10 bg-white text-black/60 hover:border-black/25"}`}><span className="block font-bold">No substitute</span><span className="mt-1 block leading-4">Leave it out instead</span></button>
                      </div>
                    </div>;
                  })}
                </Card>
              </section>

              <Card className="border-[#dbe7ff] bg-[#f2f6ff] p-5 sm:p-6">
                <div className="flex gap-3"><span className="text-xl">ⓘ</span><div><h3 className="font-bold">A demo, not a live grocery service</h3><p className="mt-1 break-words text-sm leading-6 text-black/65">Products, prices, inventory, estimated tax, fees, and fulfillment availability are sample data. This browser-only experience does not connect to a retailer, take payment, reserve stock, arrange delivery, or submit an order. Saved demo details may be lost if browser storage is cleared and are not shared across devices.</p><Link href="/help" className="mt-3 inline-block text-sm font-bold text-[#286ad2] underline underline-offset-4">How this demo works</Link></div></div>
              </Card>
            </div>

            <aside className="lg:sticky lg:top-6">
              <Card className="overflow-hidden">
                <div className="border-b border-black/5 px-5 py-5 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f8cff]">03 · Review</p><h2 className="mt-1 font-['DM_Serif_Display'] text-3xl">Order summary</h2><p className="mt-1 text-sm text-black/50">{itemCount} {itemCount === 1 ? "item" : "items"} · {fulfillment === "delivery" ? "Demo delivery" : "Demo pickup"}</p></div>
                <div className="max-h-72 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                  {cart.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><div className="min-w-0"><p className="break-words font-semibold">{item.title} <span className="font-normal text-black/50">× {item.quantity}</span></p><p className="mt-1 text-xs text-black/50">Substitution: {substitutions[item.id] === "none" ? "No substitute" : "Suggest a similar item"}</p></div><span className="shrink-0 font-semibold">{money(item.price * item.quantity)}</span></div>)}
                </div>
                <div className="space-y-3 border-t border-black/5 px-5 py-5 text-sm sm:px-6">
                  <div className="flex justify-between"><span className="text-black/60">Items subtotal</span><span>{money(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-black/60">{fulfillment === "delivery" ? "Estimated delivery fee" : "Delivery fee"}</span><span>{money(deliveryFee)}</span></div>
                  <div className="flex justify-between"><span className="text-black/60">Sample service fee</span><span>{money(serviceFee)}</span></div>
                  <div className="flex justify-between"><span className="text-black/60">Estimated tax <span className="text-xs">(8.25%)</span></span><span>{money(tax)}</span></div>
                  <div className="mt-4 flex items-end justify-between border-t border-dashed border-black/15 pt-4"><span className="font-bold">Demo total</span><span className="font-['DM_Serif_Display'] text-3xl">{money(total)}</span></div>
                  <p className="text-xs leading-5 text-black/45">Tax and fees are illustrative estimates only. No charge will be made.</p>
                </div>
                <div className="px-5 pb-5 sm:px-6">
                  {error && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p>}
                  <Button variant="primary" size="lg" type="button" onClick={submitOrder} disabled={placing} className="w-full">{placing ? "Saving demo order…" : "Place demo order"}</Button>
                  <p className="mt-3 text-center text-xs leading-5 text-black/45">No real payment taken. No store order submitted.</p>
                </div>
              </Card>
              <Link href="/cart" className="mt-4 block text-center text-sm font-semibold text-black/55 underline underline-offset-4 hover:text-black">Return to cart</Link>
            </aside>
          </div>
        )}
        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs text-black/45 sm:flex-row"><span>AAA Grocery · A sample shopping experience</span><span>Sample prices, stock, fees & fulfillment only</span></footer>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };

type ProductDetails = {
  price?: unknown;
  unitPrice?: unknown;
  quantity?: unknown;
  qty?: unknown;
  cartQuantity?: unknown;
  size?: unknown;
  unit?: unknown;
  category?: unknown;
  description?: unknown;
  notes?: unknown;
  product?: unknown;
};

type CartLine = {
  record: RecordItem;
  details: Record<string, unknown>;
  quantity: number;
  price: number;
};

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Product (static sample catalog)";

function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function detailsFor(notes: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(notes);
    const root = asObject(parsed);
    const nested = asObject(root.product);
    return { ...nested, ...root };
  } catch {
    return {};
  }
}

function numberFrom(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function linesFrom(value: unknown): CartLine[] {
  const source = Array.isArray(value)
    ? value
    : Array.isArray(asObject(value).cart)
      ? (asObject(value).cart as unknown[])
      : Array.isArray(asObject(value).items)
        ? (asObject(value).items as unknown[])
        : [];

  const merged = new Map<string, CartLine>();
  for (const candidate of source) {
    const item = asObject(candidate);
    if (typeof item.id !== "string" || typeof item.title !== "string") continue;
    const record: RecordItem = {
      id: item.id,
      title: item.title,
      notes: typeof item.notes === "string" ? item.notes : "",
      createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
    };
    const details = detailsFor(record.notes);
    const quantity = Math.max(1, Math.floor(numberFrom(details.quantity ?? details.qty ?? details.cartQuantity) ?? 1));
    const price = Math.max(0, numberFrom(details.price ?? details.unitPrice) ?? 0);
    const previous = merged.get(record.id);
    if (previous) {
      previous.quantity += quantity;
    } else {
      merged.set(record.id, { record, details, quantity, price });
    }
  }
  return Array.from(merged.values());
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function detailText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setLines(linesFrom(readLocal<unknown>(STORAGE_KEY, [])));
    } catch {
      setError("Your saved cart could not be read. Try refreshing, or keep shopping and add items again.");
    } finally {
      setLoaded(true);
    }
  }, []);

  const itemCount = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((total, line) => total + line.price * line.quantity, 0), [lines]);

  function saveLines(next: CartLine[]) {
    const records = next.map(({ record, quantity }) => {
      let notes: string;
      const parsed = detailsFor(record.notes);
      try {
        const original: unknown = JSON.parse(record.notes);
        if (original && typeof original === "object" && !Array.isArray(original)) {
          notes = JSON.stringify({ ...(original as Record<string, unknown>), quantity });
        } else {
          notes = JSON.stringify({ description: record.notes, quantity });
        }
      } catch {
        notes = JSON.stringify({ description: record.notes, quantity });
      }
      // Keep the saved product metadata intact while updating only its cart quantity.
      void parsed;
      return { ...record, notes };
    });
    try {
      writeLocal(STORAGE_KEY, records);
      setLines(next);
      setError("");
    } catch {
      setError("That cart change could not be saved. Your current cart is still available on this screen.");
    }
  }

  function changeQuantity(id: string, delta: number) {
    const next = lines
      .map((line) => line.record.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0);
    saveLines(next);
  }

  function removeItem(id: string) {
    saveLines(lines.filter((line) => line.record.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-9 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1d21] transition hover:text-[#4f8cff]">
            <span aria-hidden="true" className="text-lg">←</span> Back to shopping
          </Link>
          <span className="rounded-full border border-[#e9e7e2] bg-white px-3.5 py-2 text-xs font-semibold tracking-wide text-[#5c626a]">
            SAMPLE STORE · DEMO DATA
          </span>
        </div>

        <header className="mb-8 border-b border-[#e8e5df] pb-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8cff]">Your fresh picks</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Your cart<span className="text-[#4f8cff]">.</span></h1>
              <p className="mt-3 text-base text-[#656a71]">
                {loaded ? `${itemCount} ${itemCount === 1 ? "item" : "items"} ready for review` : "Loading your saved cart…"}
              </p>
            </div>
            {lines.length > 0 && (
              <Link href="/checkout" className="hidden sm:block">
                <Button variant="primary" size="md">Continue to checkout <span aria-hidden="true">→</span></Button>
              </Link>
            )}
          </div>
        </header>

        <div className="mb-6 rounded-xl border border-[#dce8ff] bg-[#eef4ff] px-4 py-3 text-sm leading-6 text-[#3f536f] sm:px-5">
          <span className="font-bold text-[#1a1d21]">Demo cart:</span> Products, prices, stock, fees, and fulfillment options are sample data only. Nothing here is reserved or connected to a live store.
        </div>

        {error && (
          <div role="alert" className="mb-6 break-words rounded-xl border border-[#f1caca] bg-[#fff5f4] px-4 py-3 text-sm text-[#8f3535]">{error}</div>
        )}

        {!loaded ? (
          <Card className="rounded-2xl border border-[#ebe8e2] bg-white p-8 text-sm text-[#656a71]">Getting your cart ready…</Card>
        ) : lines.length === 0 ? (
          <Card className="rounded-2xl border border-[#ebe8e2] bg-white px-5 py-4 sm:px-10 sm:py-8">
            <EmptyState
              title="Your cart is taking a breather"
              message="Add something delicious from the sample catalog and it’ll show up here."
              description="Your cart stays saved in this browser when storage is available."
              icon="🧺"
              className="py-8"
            />
            <div className="mt-2 flex justify-center">
              <Link href="/"><Button variant="primary" size="md">Explore the aisles</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
            <section aria-label="Cart items" className="space-y-3">
              {lines.map((line) => {
                const size = detailText(line.details.size);
                const unit = detailText(line.details.unit);
                const category = detailText(line.details.category);
                const description = detailText(line.details.description) ?? detailText(line.details.notes);
                return (
                  <Card key={line.record.id} className="overflow-hidden rounded-2xl border border-[#ebe8e2] bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f3f6fb] text-3xl">🥬</div>
                        <div className="min-w-0 flex-1">
                          {category && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4f8cff]">{category}</p>}
                          <h2 className="break-words text-lg font-semibold leading-snug">{line.record.title}</h2>
                          {(size || unit) && <p className="mt-1 text-sm text-[#737880]">{[size, unit].filter(Boolean).join(" · ")}</p>}
                          {description && <p className="mt-2 break-words text-sm leading-5 text-[#737880]">{description}</p>}
                          <p className="mt-2 text-sm font-semibold">{money(line.price)} <span className="font-normal text-[#858990]">each</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-[#f0eeea] pt-4 sm:w-[190px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="inline-flex items-center rounded-full border border-[#e7e5e0] bg-[#faf9f7] p-1" aria-label={`Quantity for ${line.record.title}`}>
                          <button type="button" onClick={() => changeQuantity(line.record.id, -1)} aria-label={`Decrease ${line.record.title} quantity`} className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f8cff]">−</button>
                          <span className="min-w-9 text-center text-sm font-semibold" aria-live="polite">{line.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(line.record.id, 1)} aria-label={`Increase ${line.record.title} quantity`} className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f8cff]">+</button>
                        </div>
                        <div className="flex items-center gap-4 sm:w-full sm:justify-between">
                          <span className="text-sm font-bold">{money(line.price * line.quantity)}</span>
                          <button type="button" onClick={() => removeItem(line.record.id)} className="text-sm font-medium text-[#777c83] underline decoration-[#c9c9c5] underline-offset-4 transition hover:text-[#a23b3b]" aria-label={`Remove ${line.record.title} from cart`}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              <Link href="/" className="inline-flex items-center gap-2 px-1 py-3 text-sm font-semibold text-[#4f8cff] hover:text-[#286be0]">
                <span aria-hidden="true">＋</span> Keep shopping
              </Link>
            </section>

            <aside className="lg:sticky lg:top-6">
              <Card className="rounded-2xl border border-[#ebe8e2] bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#777c83]">Order summary</p>
                <div className="mt-5 space-y-3 border-b border-[#eeece8] pb-5 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-[#656a71]">Items ({itemCount})</span><span className="font-semibold">{money(subtotal)}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-[#656a71]">Delivery &amp; fees</span><span className="text-[#858990]">Calculated at checkout</span></div>
                  <div className="flex justify-between gap-4"><span className="text-[#656a71]">Estimated tax</span><span className="text-[#858990]">Calculated at checkout</span></div>
                </div>
                <div className="flex justify-between gap-4 py-5 text-base font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <p className="mb-5 text-xs leading-5 text-[#777c83]">Taxes and any sample fulfillment fees are shown for review at checkout. No payment is collected in this demo.</p>
                <Link href="/checkout" className="block">
                  <Button variant="primary" size="lg" className="w-full justify-center">Continue to checkout <span aria-hidden="true">→</span></Button>
                </Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#777c83]"><span aria-hidden="true" className="text-[#4f8cff]">✦</span> A little goodness, gathered locally</div>
              </Card>
              <p className="mt-4 break-words px-2 text-center text-xs leading-5 text-[#858990]">Cart data is saved on this device when browser storage is available. It may not carry across browsers or devices.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

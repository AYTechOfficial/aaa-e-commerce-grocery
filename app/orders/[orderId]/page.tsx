"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GroceryHeader from "@/components/grocery-header";
import { formatPrice } from "@/lib/grocery";
import { readLocal } from "@/lib/persist";

type SavedOrder = {
  id: string;
  items?: { name?: string; quantity?: number; price?: number }[];
  subtotal?: number;
  fulfillment?: string;
  createdAt?: string;
  total?: number;
};

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const orders = readLocal<SavedOrder[]>("aaa-grocery-orders", []);
    setOrder(orders.find((item) => item.id === params.orderId) ?? null);
  }, [params.orderId]);

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#183B2B]">
      <GroceryHeader />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/" className="text-sm font-semibold text-[#287A4B] hover:underline">← Back to shopping</Link>
        {!order ? (
          <section className="mt-8 rounded-3xl border border-[#ebe6dc] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl" aria-hidden="true">⌕</div>
            <h1 className="mt-5 font-serif text-3xl">Order not found</h1>
            <p className="mx-auto mt-3 max-w-md leading-6 text-[#647568]">We couldn’t find a locally saved demo order with that confirmation number. Orders are stored only in this browser.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#287A4B] px-6 py-3 font-semibold text-white transition hover:bg-[#1f633b]">Continue shopping</Link>
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-[#ebe6dc] bg-white p-7 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl text-[#287A4B]" aria-hidden="true">✓</div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[.16em] text-[#287A4B]">Demo order saved</p>
            <h1 className="mt-2 font-serif text-4xl">Thanks for your order</h1>
            <p className="mt-3 text-[#647568]">Confirmation <span className="font-semibold text-[#183B2B]">{order.id}</span></p>
            <div className="mt-8 border-t border-[#eee9df] pt-6">
              <h2 className="font-semibold">Order details</h2>
              <ul className="mt-4 space-y-3">
                {(order.items ?? []).map((item, index) => (
                  <li key={`${item.name ?? "item"}-${index}`} className="flex justify-between gap-4 text-sm">
                    <span>{item.name ?? "Grocery item"} <span className="text-[#718174]">× {item.quantity ?? 1}</span></span>
                    {typeof item.price === "number" && <span>{formatPrice(item.price * (item.quantity ?? 1))}</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-[#eee9df] pt-4 text-sm">
                {order.fulfillment && <p className="flex justify-between gap-4"><span className="text-[#647568]">Fulfillment</span><span>{order.fulfillment}</span></p>}
                {typeof order.subtotal === "number" && <p className="flex justify-between gap-4"><span className="text-[#647568]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></p>}
                {typeof order.total === "number" && <p className="flex justify-between gap-4 font-bold"><span>Demo total</span><span>{formatPrice(order.total)}</span></p>}
              </div>
            </div>
            <p className="mt-7 rounded-xl bg-[#FAF7F0] p-4 text-sm leading-6 text-[#647568]">This is a locally saved demo confirmation only. No payment, delivery, or pickup request has been sent to a retailer.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#287A4B] px-6 py-3 font-semibold text-white transition hover:bg-[#1f633b]">Continue shopping</Link>
          </section>
        )}
      </div>
    </main>
  );
}

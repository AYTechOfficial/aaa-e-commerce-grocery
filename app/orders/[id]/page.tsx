"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { getProduct, getSavedOrder, type DemoOrder } from "@/lib/grocery";

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function OrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<DemoOrder | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(getSavedOrder(params.id));
    setLoaded(true);
  }, [params.id]);

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-8 text-[#183B2B] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-serif text-2xl font-bold">AAA Grocery</Link>
        {!loaded ? null : !order ? (
          <section className="mt-10 rounded-2xl border border-[#e5e0d5] bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#287A4B]">Demo order lookup</p>
            <h1 className="mt-4 font-serif text-4xl">Order not found</h1>
            <p className="mt-3 text-[#526456]">This order isn’t saved in this browser. Demo orders are stored locally on the device where they were placed.</p>
            <Link href="/" className="mt-7 inline-flex rounded-lg bg-[#287A4B] px-5 py-3 font-semibold text-white hover:bg-[#20623b]">Continue shopping</Link>
          </section>
        ) : (
          <>
            <section className="mt-9 rounded-2xl bg-[#E5F2E8] p-6 sm:p-9">
              <Badge tone="pass">Demo order saved locally</Badge>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Thanks for trying AAA Grocery</h1>
              <p className="mt-3 leading-7 text-[#526456]">Your demo order is saved in this browser. It has not been sent to a retailer, and no payment or fulfillment has been requested.</p>
              <p className="mt-5 text-sm font-semibold">Order reference <span className="font-mono">{order.id}</span></p>
              <p className="mt-1 text-sm text-[#657367]">Placed {new Date(order.placedAt).toLocaleString()}</p>
            </section>
            <Card className="mt-6 border-[#e8e2d7] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9df] pb-5">
                <h2 className="font-serif text-2xl">Order details</h2>
                <Badge>{order.fulfillment === "delivery" ? "Demo delivery" : "Demo pickup"}</Badge>
              </div>
              <div className="divide-y divide-[#eee9df]">
                {order.items.map((line) => {
                  const product = getProduct(line.productId);
                  if (!product) return null;
                  return <div key={line.productId} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">{product.name}</p><p className="mt-1 text-sm text-[#657367]">{line.quantity} × {money(product.price)}</p></div><p className="font-semibold">{money(product.price * line.quantity)}</p></div>;
                })}
              </div>
              <div className="space-y-2 border-t border-[#eee9df] pt-5 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>{order.fulfillment === "delivery" ? "Simulated delivery fee" : "Pickup fee"}</span><span>{order.fee === 0 ? "Free" : money(order.fee)}</span></div>
                <div className="flex justify-between pt-2 text-lg font-bold"><span>Demo total</span><span>{money(order.total)}</span></div>
              </div>
            </Card>
            <Link href="/" className="mt-6 inline-flex rounded-lg bg-[#287A4B] px-5 py-3 font-semibold text-white hover:bg-[#20623b]">Back to shopping</Link>
          </>
        )}
      </div>
    </main>
  );
}

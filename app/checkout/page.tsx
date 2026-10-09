"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ShopHeader from "@/components/shop-header";
import { Button, Card, EmptyState } from "@/components/ui";
import { findProduct } from "@/lib/shop-data";
import { CartLine, DemoOrder, Fulfillment, getCart, getOrders, money, saveCart, saveOrders, subtotalFor } from "@/lib/shop-state";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [placed, setPlaced] = useState(false);
  useEffect(() => setCart(getCart()), []);
  const subtotal = subtotalFor(cart);
  const fee = fulfillment === "Delivery" && cart.length ? 4.99 : 0;
  const items = cart.flatMap((line) => {
    const product = findProduct(line.productId);
    return product ? [{ productId: product.id, name: product.name, image: product.image, unit: product.unit, unitPrice: product.price, quantity: line.quantity }] : [];
  });

  function placeDemoOrder() {
    if (!items.length) return;
    const order: DemoOrder = { id: `demo-${Date.now()}`, createdAt: new Date().toISOString(), status: "Confirmed — demo", fulfillment, items, subtotal, fee, total: subtotal + fee };
    saveOrders([order, ...getOrders()]);
    saveCart([]);
    setPlaced(true);
    router.push(`/orders/${order.id}`);
  }

  return <main className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><ShopHeader /><section className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><p className="text-sm font-semibold uppercase tracking-widest text-[#287A4B]">Review your basket</p><h1 className="mt-2 font-serif text-4xl font-bold">Demo checkout</h1>
    {!items.length ? <div className="mt-8 rounded-2xl border border-[#e8e2d7] bg-white p-8"><EmptyState title="Your basket is empty" message="Add some items before continuing to checkout." action={<Link href="/"><Button variant="primary">Shop groceries</Button></Link>} /></div> : <div className="mt-7 grid gap-6 md:grid-cols-[1fr_320px]"><Card className="rounded-xl border border-[#e8e2d7] bg-white p-6"><h2 className="text-xl font-semibold">Choose fulfillment</h2><p className="mt-2 text-sm text-[#65746a]">This choice is for the demo only. No retailer receives a request.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{(["Delivery", "Pickup"] as Fulfillment[]).map((option) => <button key={option} onClick={() => setFulfillment(option)} className={`rounded-xl border p-4 text-left transition ${fulfillment === option ? "border-[#287A4B] bg-[#E5F2E8] ring-2 ring-[#287A4B]/20" : "border-[#e8e2d7] hover:border-[#287A4B]"}`}><span className="font-semibold">{option}</span><span className="mt-1 block text-sm text-[#65746a]">{option === "Delivery" ? "Sample delivery fee: $4.99" : "No pickup fee"}</span></button>)}</div><h2 className="mt-8 text-xl font-semibold">Items</h2><div className="mt-3 divide-y divide-[#eee9df]">{items.map((item) => <div key={item.productId} className="flex justify-between py-3 text-sm"><span>{item.name} × {item.quantity}</span><span>{money(item.unitPrice * item.quantity)}</span></div>)}</div></Card><Card className="h-fit rounded-xl border border-[#e8e2d7] bg-white p-5"><h2 className="text-xl font-semibold">Cost summary</h2><div className="mt-5 flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="mt-3 flex justify-between"><span>{fulfillment} fee</span><span>{fee ? money(fee) : "Free"}</span></div><div className="my-5 border-t border-[#e8e2d7]" /><div className="flex justify-between text-lg font-bold"><span>Demo total</span><span>{money(subtotal + fee)}</span></div><p className="mt-4 text-xs leading-5 text-[#65746a]">No payment is collected. This creates a locally saved sample order only; nothing is sent to a retailer.</p><Button variant="primary" size="lg" onClick={placeDemoOrder} className="mt-5 w-full">Place demo order</Button>{placed && <p role="status" className="mt-3 text-sm text-[#287A4B]">Your demo order is saved.</p>}</Card></div>}
  </section></main>;
}

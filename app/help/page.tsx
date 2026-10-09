import Link from "next/link";
import ShopNav from "@/components/shop-nav";

const faqs = [
  ["Is AAA Grocery a real store?", "No. This is a client-side shopping demo with sample products, prices, inventory, and fulfillment options."],
  ["Will checkout place a real order or charge me?", "No. Checkout only creates a demo order saved in this browser. No payment details are collected and no retailer or delivery service receives an order."],
  ["Are product prices and availability accurate?", "No. All catalog information is illustrative demo data and is not a live price or inventory feed."],
  ["Where are my cart and order details saved?", "Your basket and completed demo orders are stored locally in this browser. They are not synced to an account or another device."],
  ["How can I contact support?", "This demo has no connected customer support team. For questions about this demonstration, use the account and order pages to review locally saved demo details."],
];

export default function HelpPage() {
  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><main className="mx-auto max-w-3xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Here to help</p><h1 className="mt-2 font-serif text-4xl">Help & frequently asked questions</h1><p className="mt-4 leading-7 text-[#68766b]">AAA Grocery is a shopping experience prototype. Read how the demo works before building a basket.</p><section className="mt-8 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-[#ebe6dc] bg-white p-5"><summary className="cursor-pointer list-none pr-6 font-semibold marker:hidden">{question}<span className="float-right text-[#287a4b] group-open:rotate-45">＋</span></summary><p className="mt-3 leading-7 text-[#68766b]">{answer}</p></details>)}</section><div className="mt-8 rounded-2xl bg-[#e5f2e8] p-6"><h2 className="font-serif text-2xl">Need to review an order?</h2><p className="mt-2 text-sm leading-6 text-[#526a58]">Your demo order history is available from your account on this device.</p><Link href="/account" className="mt-4 inline-block font-semibold text-[#287a4b] hover:underline">Go to account →</Link></div><p className="mt-8 text-xs text-[#718174]">This demo does not provide real customer support, delivery, pickup, payment processing, or retailer services.</p></main></div>;
}

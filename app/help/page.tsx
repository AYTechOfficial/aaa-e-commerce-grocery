import Link from "next/link";
import ShopNav from "@/components/shop-nav";
import { Card } from "@/components/ui";

const faqs = [
  { question: "Will my order reach a grocery store?", answer: "No. AAA Grocery is a demonstration shopping app. Orders are saved locally in your browser and are never sent to a retailer." },
  { question: "Are prices and availability real?", answer: "No. Product prices, inventory, fees, substitutions, and fulfillment details are sample data and may not reflect a real store." },
  { question: "Is payment collected?", answer: "No payment information is requested or collected. Checkout only creates a locally saved demo order." },
  { question: "How can I review or repeat an order?", answer: "Visit Account or Order history to see locally saved demo orders and add their items to your basket again." },
  { question: "Can I choose delivery or pickup?", answer: "The app may display demo fulfillment choices, but selecting one does not arrange a real delivery or pickup." },
];

export default function HelpPage() {
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Here to help</p><h1 className="mt-2 font-serif text-4xl font-bold">Help & FAQs</h1><Card className="mt-6 rounded-2xl border border-[#e9e2d7] bg-[#e5f2e8] p-5"><h2 className="font-serif text-xl">A clear note about this demo</h2><p className="mt-2 leading-7">AAA Grocery is a client-side demo. Catalog details and fulfillment are simulated, and any order is saved only in this browser. Nothing is sent to a retailer and no payment is taken.</p></Card>
    <div className="mt-8 space-y-4">{faqs.map((faq) => <Card key={faq.question} className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-semibold">{faq.question}</h2><p className="mt-2 leading-7 text-[#617367]">{faq.answer}</p></Card>)}</div>
    <Card className="mt-8 rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl">Contact</h2><p className="mt-2 leading-7 text-[#617367]">For questions about this demonstration, email <a className="font-semibold text-[#287a4b] underline" href="mailto:hello@aaagrocery.example">hello@aaagrocery.example</a>. This demo contact does not connect to a retailer.</p><div className="mt-5 flex gap-4"><Link href="/account" className="font-semibold text-[#287a4b]">Your account</Link><Link href="/" className="font-semibold text-[#287a4b]">Shop sample catalog</Link></div></Card>
  </div></main>;
}

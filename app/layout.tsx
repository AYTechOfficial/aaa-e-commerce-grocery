import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAA Grocery",
  description: "A retailer-aligned grocery delivery and pickup app focused on a defined local market, with reliable same-day fulfillment and clear order costs. This is a proposed position, not a verified unmet market need.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

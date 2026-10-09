type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Order details</h1>
      <p className="mt-2 text-sm text-gray-500">Order #{orderId}</p>
    </main>
  );
}

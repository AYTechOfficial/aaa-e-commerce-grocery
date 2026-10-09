export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main>
      <h1>Order details</h1>
      <p>Order ID: {orderId}</p>
    </main>
  );
}

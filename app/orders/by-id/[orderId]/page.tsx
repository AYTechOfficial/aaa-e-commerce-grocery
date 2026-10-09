export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main>
      <h1>Order {orderId}</h1>
    </main>
  );
}

export default async function OrderByIdPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Order details</h1>
      <p className="mt-3 text-sm text-white/60">Order #{orderId}</p>
    </main>
  );
}

import { useSalesSummaryQuery } from "@/entities/sales/api";

export function DashboardPage() {
  const { data, isLoading, isError } = useSalesSummaryQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <section>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}

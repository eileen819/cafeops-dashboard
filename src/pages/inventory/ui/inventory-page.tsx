import { useInventoryItemsQuery } from "@/entities/inventory/api";

export function InventoryPage() {
  const { data, isLoading, isError } = useInventoryItemsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <section>
      <h2>Inventory</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}

interface GetRequiredStockUntilNextCycleRestockParams {
  daysUntilNextCycleRestock: number;
  expectedDailyUsage: number;
  bufferStock: number;
}

export function getRequiredStockUntilNextCycleRestock({
  daysUntilNextCycleRestock,
  expectedDailyUsage,
  bufferStock,
}: GetRequiredStockUntilNextCycleRestockParams) {
  return daysUntilNextCycleRestock * expectedDailyUsage + bufferStock;
}

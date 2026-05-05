interface GetEstimatedCurrentStockParams {
  lastCheckedStock: number;
  receivedQuantitySinceLastChecked: number;
  expectedDailyUsage: number;
  daysSinceLastChecked: number;
}

export function getEstimatedCurrentStock({
  lastCheckedStock,
  receivedQuantitySinceLastChecked,
  expectedDailyUsage,
  daysSinceLastChecked,
}: GetEstimatedCurrentStockParams) {
  return Math.max(
    lastCheckedStock +
      receivedQuantitySinceLastChecked -
      expectedDailyUsage * daysSinceLastChecked,
    0,
  );
}

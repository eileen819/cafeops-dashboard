interface GetRecommendedOrderQuantityParams {
  requiredStockUntilNextCycleRestock: number;
  estimatedCurrentStock: number;
}

export function getRecommendedOrderQuantity({
  requiredStockUntilNextCycleRestock,
  estimatedCurrentStock,
}: GetRecommendedOrderQuantityParams) {
  return Math.max(
    requiredStockUntilNextCycleRestock - estimatedCurrentStock,
    0,
  );
}

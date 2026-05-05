import type { InventoryStatus } from "./types";

interface GetInventoryStatusParams {
  estimatedCurrentStock: number;
  requiredStockUntilNextCycleRestock: number;
  maxStock: number;
}

export function getInventoryStatus({
  estimatedCurrentStock,
  requiredStockUntilNextCycleRestock,
  maxStock,
}: GetInventoryStatusParams): InventoryStatus {
  if (estimatedCurrentStock > maxStock) {
    return "overstock";
  }

  if (estimatedCurrentStock < requiredStockUntilNextCycleRestock) {
    return "low";
  }

  return "normal";
}

export type InventoryCategory =
  | "coffee-bean"
  | "milk"
  | "syrup"
  | "beverage"
  | "bakery"
  | "supplies";

export type InventoryUnit = "ea" | "kg" | "g" | "ml" | "l";

export type InventoryStatus = "low" | "normal" | "overstock";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  lastCheckedStock: number;
  lastCheckedDate: string;
  receivedQuantitySinceLastChecked: number;
  expectedDailyUsage: number;
  nextRestockDate: string;
  nextCycleRestockDate: string;
  bufferStock: number;
  maxStock: number;
  unit: InventoryUnit;
  supplier?: string;
  updatedAt: string;
}

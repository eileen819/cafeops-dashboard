import type { InventoryItem } from "./types";

export const inventoryItemsMock: InventoryItem[] = [
  {
    id: "inventory-1",
    name: "에스프레소 원두",
    category: "coffee-bean",
    lastCheckedStock: 30,
    lastCheckedDate: "2026-04-25",
    receivedQuantitySinceLastChecked: 0,
    expectedDailyUsage: 5,
    nextRestockDate: "2026-04-29",
    nextCycleRestockDate: "2026-05-06",
    bufferStock: 5,
    maxStock: 100,
    unit: "kg",
    supplier: "Bean Supply",
    updatedAt: "2026-04-28",
  },
];

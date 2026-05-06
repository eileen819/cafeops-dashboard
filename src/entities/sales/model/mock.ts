import type { CategorySalesRatio, SalesSummary, SalesTrendItem } from "./types";

export const salesSummaryMock: SalesSummary = {
  todaySales: 1280000,
  weeklyOrderCount: 342,
  lowStockCount: 3,
  pendingOrderCount: 4,
};

export const salesTrendMock: SalesTrendItem[] = [
  { date: "2026-04-22", sales: 920000, orderCount: 214 },
  { date: "2026-04-23", sales: 1010000, orderCount: 238 },
  { date: "2026-04-24", sales: 1180000, orderCount: 267 },
  { date: "2026-04-25", sales: 1350000, orderCount: 301 },
  { date: "2026-04-26", sales: 980000, orderCount: 221 },
  { date: "2026-04-27", sales: 1120000, orderCount: 249 },
  { date: "2026-04-28", sales: 1280000, orderCount: 286 },
];

export const categorySalesRatioMock: CategorySalesRatio[] = [
  { category: "coffee-bean", sales: 520000, ratio: 40.6 },
  { category: "milk", sales: 310000, ratio: 24.2 },
  { category: "syrup", sales: 160000, ratio: 12.5 },
  { category: "beverage", sales: 180000, ratio: 14.1 },
  { category: "bakery", sales: 110000, ratio: 8.6 },
];

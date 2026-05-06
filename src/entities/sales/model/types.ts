import type { InventoryCategory } from "@/entities/inventory/model/types";

export interface SalesSummary {
  todaySales: number;
  weeklyOrderCount: number;
  lowStockCount: number;
  pendingOrderCount: number;
}

export interface SalesTrendItem {
  date: string;
  sales: number;
  orderCount: number;
}

export interface CategorySalesRatio {
  category: InventoryCategory;
  sales: number;
  ratio: number;
}

export interface SalesSummaryResponse {
  summary: SalesSummary;
}

export interface SalesTrendResponse {
  items: SalesTrendItem[];
}

export interface CategorySalesRatioResponse {
  items: CategorySalesRatio[];
}

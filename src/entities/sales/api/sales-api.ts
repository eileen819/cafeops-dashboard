import { httpClient } from "@/shared/api/http-client";
import type {
  CategorySalesRatioResponse,
  SalesSummaryResponse,
  SalesTrendResponse,
} from "../model/types";

export async function getSalesSummary() {
  return httpClient<SalesSummaryResponse>("/sales/summary");
}

export async function getSalesTrend() {
  return httpClient<SalesTrendResponse>("/sales/trend");
}

export async function getCategorySalesRatio() {
  return httpClient<CategorySalesRatioResponse>("/sales/category-ratio");
}

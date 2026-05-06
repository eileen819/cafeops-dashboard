import { useQuery } from "@tanstack/react-query";
import {
  getCategorySalesRatio,
  getSalesSummary,
  getSalesTrend,
} from "./sales-api";

export const salesQueryKeys = {
  summary: ["sales", "summary"] as const,
  trend: ["sales", "trend"] as const,
  categoryRatio: ["sales", "category-ratio"] as const,
};

export function useSalesSummaryQuery() {
  return useQuery({
    queryKey: salesQueryKeys.summary,
    queryFn: getSalesSummary,
  });
}

export function useSalesTrendQuery() {
  return useQuery({
    queryKey: salesQueryKeys.trend,
    queryFn: getSalesTrend,
  });
}

export function useCategorySalesRatioQuery() {
  return useQuery({
    queryKey: salesQueryKeys.categoryRatio,
    queryFn: getCategorySalesRatio,
  });
}

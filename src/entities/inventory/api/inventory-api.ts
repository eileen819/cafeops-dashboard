import { httpClient } from "@/shared/api/http-client";

import type {
  InventoryItem,
  InventoryItemResponse,
  InventoryListResponse,
} from "../model/types";

export type CreateInventoryItemRequest = Omit<
  InventoryItem,
  "id" | "updatedAt"
>;

export type UpdateInventoryItemRequest = Partial<
  Omit<InventoryItem, "id" | "updatedAt">
>;

export async function getInventoryItems() {
  return httpClient<InventoryListResponse>("/inventory");
}

export async function createInventoryItem(payload: CreateInventoryItemRequest) {
  return httpClient<InventoryItemResponse>("/inventory", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateInventoryItem({
  id,
  payload,
}: {
  id: string;
  payload: UpdateInventoryItemRequest;
}) {
  return httpClient<InventoryItemResponse>(`/inventory/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  type CreateInventoryItemRequest,
  type UpdateInventoryItemRequest,
} from "./inventory-api";

export const inventoryQueryKeys = {
  all: ["inventory"] as const,
};

export function useInventoryItemsQuery() {
  return useQuery({
    queryKey: inventoryQueryKeys.all,
    queryFn: getInventoryItems,
  });
}

export function useCreateInventoryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInventoryItemRequest) =>
      createInventoryItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryQueryKeys.all,
      });
    },
  });
}

export function useUpdateInventoryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateInventoryItemRequest;
    }) => updateInventoryItem({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryQueryKeys.all,
      });
    },
  });
}

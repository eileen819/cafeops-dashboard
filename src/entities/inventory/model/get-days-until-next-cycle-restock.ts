import { getDaysBetween } from "@/shared/lib/get-days-between";

export function getDaysUntilNextCycleRestock(
  today: string | Date,
  nextCycleRestockDate: string | Date,
) {
  return Math.max(getDaysBetween(today, nextCycleRestockDate), 0);
}

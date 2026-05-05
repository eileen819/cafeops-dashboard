import { getDaysBetween } from "@/shared/lib/get-days-between";

export function getDaysUntilNextRestock(
  today: string | Date,
  nextRestockDate: string | Date,
) {
  return getDaysBetween(today, nextRestockDate);
}

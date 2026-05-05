import { getDaysBetween } from "@/shared/lib/get-days-between";

export function getDaysSinceLastChecked(
  lastCheckedDate: string | Date,
  today: string | Date,
) {
  return Math.max(getDaysBetween(lastCheckedDate, today), 0);
}

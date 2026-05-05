const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDaysBetween(from: string | Date, to: string | Date) {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const fromUTC = Date.UTC(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );

  const toUTC = Date.UTC(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate(),
  );

  return Math.floor((toUTC - fromUTC) / MS_PER_DAY);
}

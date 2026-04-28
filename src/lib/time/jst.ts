export function getJstDayRange(now = new Date()): { label: string; start: Date; end: Date } {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const label = formatter.format(now);
  const start = new Date(`${label}T00:00:00+09:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { label, start, end };
}

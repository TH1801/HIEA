/** Format ISO date string to Vietnamese short format: "12 Thg 3, 2026" */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const months = [
    "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
    "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

/** Estimate reading time in minutes from word count */
export function estimateReadingTime(text: string | null): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
